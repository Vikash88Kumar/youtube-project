    import { User } from "../models/user.models.js";
    import {asyncHandler} from "../utils/asyncHandler.js"
    import {ApiError} from "../utils/apiError.js"
    import {ApiResponse} from "../utils/apiResponse.js" 
    import { uploadOnCloudinary } from "../utils/cloudinary.js";
    import jwt from "jsonwebtoken";
    import mongoose from "mongoose";

        const generateAccessRefreshToken=async(userId)=>{   
            try {
                const user=await User.findById(userId)
                if (!user) {
                    throw new ApiError(404, "User not found while generating tokens");
                }
                const accessToken=user.generateAccessToken()
                const refreshToken=user.generateRefreshToken()
        
                user.refreshToken=refreshToken
                await user.save({validateBeforeSave:false})
                
                return {accessToken,refreshToken}
            } catch (error) {
            throw new ApiError(400,"Error while generating tokens")
            }
        }
        const registerUser=asyncHandler(async(req,res)=>{

            const {username,email,fullName,password}=req.body;
            if([username,email,fullName,password].some(field=>
                field?.trim()===""
            )){
                throw new ApiError(400,"ALL fields are required")
            }
            const existedUser=await User.findOne({
                $or:[{username},{email}]
            })
            if(existedUser){
                throw new ApiError(402,"User already exist");
            }
            const avatarLocalpath=req.files?.avatar[0]?.path
            // const coverImageLocalpath=req.files?.coverImage[0]?.path
            let coverImageLocalpath;
            if(req.files && Array.isArray(req.files.coverImage) && req.files.coverImage.length>0){
                coverImageLocalpath=req.files.coverImage[0].path
            }
            if(!avatarLocalpath){
                throw new ApiError(400,"Avatar file is missing")
            }
            const avatar=await uploadOnCloudinary(avatarLocalpath)
            const coverImage=await uploadOnCloudinary(coverImageLocalpath)
            if(!avatar){
                throw new ApiError(400,"Avatar file is required")
            }
            const user=await User.create({
                username:username.toLowerCase(),
                fullName,
                email,
                password,
                avatar:avatar.url,
                coverImage:coverImage.url || "",
                refreshToken:""
            })

            const createdUser = await User.findById(user._id).select("-password -refreshToken");
            if (!createdUser) {
                throw new ApiError(500, "Unable to create user");
            }

            return res.status(200).json(
                new ApiResponse(200,createdUser,"User Register Successsfully")
            )
        })
        const loginUser=asyncHandler(async(req,res)=>{
            const {email,password}=req.body;
            if([email,password].some(field=>field.trim()==="")){
                throw new ApiError(400,"All fields are required");
            }
            const user=await User.findOne({
                $or:[{email}]
            })
            if(!user){
                throw new ApiError(403,"User Not Exists")
            }
            if(!user.isPasswordCorrect(password)){
                throw new ApiError(404,"Password is incorrect");
            }
            const {accessToken,refreshToken}= await generateAccessRefreshToken(user._id)

            const loggenInuser = user.toObject();
            delete loggenInuser.password;
            delete loggenInuser.refreshToken;

            const options={
                httpOnly:true,
                secure:true
            }
            res.status(200)
            .cookie("accessToken",accessToken,options)
            .cookie("refreshToken",refreshToken,options)
            .json(
                new ApiResponse(200,
                    {
                        user:loggenInuser,
                        accessToken,
                        refreshToken
                    },
                    "User Logged In succesfully"
                ))
        })
        const logout=asyncHandler(async (req,res)=>{
                await User.findByIdAndUpdate(req.user._id,
                    {$set:{refreshToken:null}},
                    { new:true}
                )
                const options={
                    httpOnly:true,              
                    secure:true
                }
                res.status(200)
                .clearCookie("accessToken",options)
                .clearCookie("refreshToken",options)
                .json(new ApiResponse(200,{},"User logged Out"))

        })
        const getUserChannelProfile=asyncHandler(async(req,res)=>{
            const {username}=req.params
            if(!username){
                throw new ApiError(402,"username is missing")
            }
            const channel=await User.aggregate([
                {
                    $match:{
                        username:username?.toLowerCase()
                    }
                },
                {
                    $lookup:{
                        from:"subscriptions",
                        localField:"_id",
                        foreignField:"channel",
                        as:"subscribers"
                    }
                },
                {
                    $lookup:{
                        from:"subscriptions",
                        localField:"_id",
                        foreignField:"subscriber",
                        as:"subscribedTo"
                    }
                },
                {
                    $addFields:{
                        subscribersCount:{
                            $size:"$subscribers"
                        },
                        channelsSubscribedToCount:{
                            $size:"$subscribedTo"
                        },
                        isSubscribed:{     //not understand
                            $cond: {
                                if: {$in: [req.user?._id, "$subscribers.subscriber"]},
                                then: true,
                                else: false
                            }
                        }
                    }
                },
                {
                    $project:{
                        fullName: 1,
                        username: 1,
                        subscribersCount: 1,
                        channelsSubscribedToCount: 1,
                        isSubscribed: 1,
                        avatar: 1,
                        coverImage: 1,
                        email: 1
                    }
                }
            ])
            if (!channel?.length) { //not understand
            throw new ApiError(404, "channel does not exists")
            }

            return res
            .status(200)
            .json(
                new ApiResponse(200, channel[0], "User channel fetched successfully")
            )

        })
        const getWatchHistory=asyncHandler(async(req,res)=>{
            const user=await User.aggregate([
                {
                    $match:{
                        _id:new mongoose.Types.ObjectId(req.user._id)
                    }
                },
                {
                    $lookup:{
                        from:"videos",
                        localField:"getWatchHistory",
                        foreignField:"_id",
                        as:"watchHistory",
                        pipeline:[
                            {
                                $lookup:{
                                    from:"users",
                                    localField:"owner",
                                    foreignField:"_id",
                                    as:"owner",
                                    pipeline:[
                                        {
                                            $project:{
                                                username:1,
                                                fullName:1,
                                                avatar:1
                                            }
                                        }
                                    ]

                                }
                            },
                            {
                                $addFields:{
                                    owner:{
                                        $first:"$owner"
                                    }
                                }
                            }
                        ]
                    }
                },
                
            ])
            return res.status(200).json(
                new ApiResponse(200,user[0].watchHistory,"watchHistory fetched Successfully")
            )
        })
        const refreshAccessToken = asyncHandler(async (req, res) => {
        const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken

        if (!incomingRefreshToken) {
            throw new ApiError(401, "unauthorized request")
        }

        try {
            const decodedToken = jwt.verify(
                incomingRefreshToken,
                process.env.REFRESH_TOKEN_SECRET
            )
        
            const user = await User.findById(decodedToken?._id)
        
            if (!user) {
                throw new ApiError(401, "Invalid refresh token")
            }
        
            if (incomingRefreshToken !== user?.refreshToken) {
                throw new ApiError(401, "Refresh token is expired or used")
                
            }
        
            const options = {
                httpOnly: true,
                secure: true
            }
        
            const {accessToken, newRefreshToken} = await generateAccessAndRefereshTokens(user._id)
        
            return res
            .status(200)
            .cookie("accessToken", accessToken, options)
            .cookie("refreshToken", newRefreshToken, options)
            .json(
                new ApiResponse(
                    200, 
                    {accessToken, refreshToken: newRefreshToken},
                    "Access token refreshed"
                )
            )
        } catch (error) {
            throw new ApiError(401, error?.message || "Invalid refresh token")
        }

        })
        const changeCurrentPassword=asyncHandler(async(req,res)=>{
            const {oldPassword,newPassword}=req.body;
            if(!(oldPassword && newPassword)){
                throw new ApiError(402,"All fields are required")
            }
            const user=await User.findById(req.user?._id)
            if(!user){
                throw new ApiError(400,"user not fetched")
            }
            const isPasswordCorrect = await user.isPasswordCorrect(oldPassword)

            if (!isPasswordCorrect) {
                throw new ApiError(400, "Invalid old password")
            }
            user.password=newPassword
            await user.save({validateBeforeSave:false})

            return res.status(200).json(
                new ApiResponse(200,{},"Password update Successfully")
            )
        })
        const getCurrentUser=asyncHandler((req,res)=>{
            return res.status(200).
            json(
                new ApiResponse(200,
                req.user,
                "Current user fetch successfully")
            )
        })
        const updateAccountDetails=asyncHandler(async(req,res)=>{
            const {fullName,email}=req.body
            if(!(fullName || email)){
                throw new ApiError(400,"All fields are required")
            }
            const user=await User.findByIdAndUpdate(
                req.user._id,
            { 
                $set:{
                    fullName,
                    email
                }
            },{new:true}).select("-password -refreshToken")

            return res.status(200).json(new ApiResponse(200,user,"Account details update Successfully"))

        })
        const updateUserAvatar=asyncHandler(async(req,res)=>{
            const avatarLocalpath=req.file?.path 
            if(!avatarLocalpath){
                throw new ApiError(402,"Avatar file missing")
            }
            const avatar=await uploadOnCloudinary(avatarLocalpath)
            if(!avatar){
                throw new ApiError(400,"avatar file upload failed")
            }
            const user=await User.findByIdAndUpdate(
                req.user._id,
                {
                    $set:{
                        avatar:avatar.url
                    }
                },
                {new:true}
            ).select("-password")

            return res.status(200).json(new ApiResponse(200,user,"avatar update Succesfully"))
        })
        const updateUserCoverImage=asyncHandler(async(req,res)=>{
            const coverImageLocalpath=req.file?.path 
            if(!coverImageLocalpath){
                throw new ApiError(402,"CoverImage file missing")
            }
            const coverImage=await uploadOnCloudinary(coverImageLocalpath)
            if(!coverImage){
                throw new ApiError(400,"CoverImage file upload failed")
            }
            const user=await User.findByIdAndUpdate(
                req.user._id,
                {
                    $set:{
                        coverImage:coverImage.url
                    }
                },
                {new:true}
            ).select("-password")

            return res.status(200).json(new ApiResponse(200,user,"coverImage update Succesfully"))
        })
        
    export {
        registerUser,
        loginUser,
        logout,
        getUserChannelProfile,
        getWatchHistory,
        refreshAccessToken,
        changeCurrentPassword,
        getCurrentUser,
        updateAccountDetails,
        updateUserAvatar,
        updateUserCoverImage

    }
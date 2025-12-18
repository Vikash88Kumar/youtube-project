import mongoose, { isValidObjectId } from "mongoose"
import {Tweet} from "../models/tweet.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"

const createTweet = asyncHandler(async (req, res) => {
    //TODO: create tweet
    const {content}=req.body
    if(!content || content.trim()===""){
        throw new ApiError(400,"content is required")
    }
    if(content.length>300){
        throw new ApiError(400,"Tweets Exceeds maximum of 300 characters")
    }
    const imageLocalpath=req.file?.path
    let imageUrl;
    if(imageLocalpath){
        const image=await uploadOnCloudinary(imageLocalpath)
        if(!image?.url){
            throw new ApiError(500,"Image upload failed")
        }
        imageUrl=image.url
    }

    if (!req.user?._id) {
        throw new ApiError(401, "Unauthorized: Please log in to create a tweet");
    }
    const tweet=await Tweet.create({
        content,
        image:imageUrl ||null ,
        owner:req.user._id
    })
    return res.status(200).json(
        new ApiResponse(200,tweet,"tweet added successfully")
    )
})
//
const getAllTweete=asyncHandler(async (req,res)=>{
    const allTweets=await Tweet.find().populate("owner","username fullName avatar").sort({createdAt:-1})
    return res.status(200).json(new ApiResponse(200,allTweets,"all tweets fetched successfully"))
})
const getUserTweets = asyncHandler(async (req, res) => {

    // TODO: get user tweets
    const page = Math.max(1, parseInt(req.query.page || "1", 10)); //not clear
    const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
    const skip = (page - 1) * limit;

    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized");
    }
    const allTweets=await Tweet.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(req?.user._id)
            }
        },
        { $sort: { createdAt: -1 } }, 
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
        { $addFields: { owner: { $first: "$owner" } } },
        {
            $facet: {
                metadata: [{ $count: "total" }],
                data: [{ $skip: skip }, { $limit: limit }]
            }
        }
    ])
    return res.status(200).json(
        new ApiResponse(200,
        {
            results:allTweets,
            pagination: {  page, limit }
        },
      "all usertweets fetched successfully")
    )  
})

const updateTweet = asyncHandler(async (req, res) => {
    //TODO: update tweet
    const {newContent}=req.body
    const {tweetId}=req.params  
    if(!newContent){
        throw new ApiError(400,"Content is smissing")
    }
    if (!mongoose.Types.ObjectId.isValid(tweetId)) {
            throw new ApiError(400, "Invalid tweet");
        }
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(404,"tweet not found")
    }
    if(String(tweet.owner)!==String(req?.user._id)){
        throw new ApiError(402,"unauthorized to edit tweet")
    }
    tweet.content=newContent.trim()
    await tweet.save()
    
    return res.status(200).json(
        new ApiResponse(200,tweet,"Tweet update Successfully")
    )
})

const deleteTweet = asyncHandler(async (req, res) => {
    //TODO: delete tweet   
    const {tweetId}=req.params
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400,"invalid tweetId")
    } 
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"Tweet not found")
    }
    if((String(tweet.owner)!==String(req.user._id))){
        throw new ApiError(400,"unauthorized user for delete a tweet")
    }
    await Tweet.findByIdAndDelete(tweetId)
    return res.status(200).json(200,null,"Tweet deleted successfully")
})

export {
    createTweet,
    getUserTweets,
    getAllTweete,
    updateTweet,
    deleteTweet
}
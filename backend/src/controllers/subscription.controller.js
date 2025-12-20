import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
        const {channelId} = req.params
        // TODO: toggle subscription
    if(!mongoose.Types.ObjectId.isValid(channelId)){
        throw new ApiError(400,"invalid channelId")
    }
    let subscribed
    const existedSubscriber=await Subscription.findOne({channel:channelId,subscriber:req.user._id})
    if(existedSubscriber){
        await Subscription.deleteOne({_id:existedSubscriber._id})
        subscribed=false
    }else{
        await Subscription.create({channel:channelId,subscriber:req.user._id})
        subscribed=true
    }
    const subscribersCount=await Subscription.countDocuments({channel:channelId})
    return res.status(200).json(new ApiResponse(200,{subscribed,subscribersCount},"subscription toggle successful"))


})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {username} = req.params
    const user=await User.findOne({username})
    const subscriber=await Subscription.aggregate([
        {
            $match:{channel:new mongoose.Types.ObjectId(user?._id)}
        },
        {
            $lookup:{
                from:"users",
                localField:"subscriber",
                foreignField:"_id",
                as:"subscriber",
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
        }
    ])
    return res.status(200).json(new ApiResponse(200,subscriber,"All subscriber fetched successfully"))

})

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params
    const channels=await Subscription.aggregate([
        {
            $match:{
                subscriber:new mongoose.Types.ObjectId(subscriberId)
            }
        },
        {
           $lookup:{
            from:"users",
            localField:"channel",
            foreignField:"_id",
            as:"channel",
            pipeline:[
                {
                    $project:{
                        username:1,
                        fullName:1,
                        avatar:1,
                    }
                }
            ]
           } 
        },
        {
            $addFields:{channel:{$first:"$channel"}}
        },
        {
        $replaceRoot: {
            newRoot: "$channel", //return only channel
        },
        }
    ])
    return res.status(200).json(new ApiResponse(200,channels,"All subscribed channels fetched"))
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
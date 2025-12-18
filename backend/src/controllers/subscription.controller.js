import mongoose, {isValidObjectId} from "mongoose"
import {User} from "../models/user.models.js"
import { Subscription } from "../models/subscription.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
        const {channelId} = req.params
        // TODO: toggle subscription
        if (!mongoose.Types.ObjectId.isValid(channelId)) {
        throw new ApiError(400, "Invalid channelId");
    }

    if (!req.user || !req.user._id) {
        throw new ApiError(401, "Unauthorized");
    }
    if (String(req.user._id) === String(channelId)) {
        throw new ApiError(400, "You cannot subscribe to yourself");
    }
    const channel = await User.findById(channelId).select("_id");
    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const userId = new mongoose.Types.ObjectId(req.user._id);
    const chanId = new mongoose.Types.ObjectId(channelId);

    try {
        await Subscription.create({ subscriber: userId, channel: chanId });
        const subscribersCount = await Subscription.countDocuments({ channel: chanId });
        return res.status(200).json(
        new ApiResponse(200, { subscribed: true, subscribersCount }, "Subscribed")
        );
    } catch (err) {
        if (err && err.code === 11000) {
        await Subscription.deleteOne({ subscriber: userId, channel: chanId });
        const subscribersCount = await Subscription.countDocuments({ channel: chanId });
        return res.status(200).json(
            new ApiResponse(200, { subscribed: false, subscribersCount }, "Unsubscribed")
        );
        }

        // Other errors — rethrow as server error
        console.error("toggleSubscription error:", err);
        throw new ApiError(500, "Failed to toggle subscription");
    }
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {
    const {channelId} = req.params
    const subscriber=await Subscription.aggregate([
        {
            $match:{channel:new mongoose.Types.ObjectId(channelId)}
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
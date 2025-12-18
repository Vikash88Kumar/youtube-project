import mongoose from "mongoose"
import {Video} from "../models/video.models.js"
import {Subscription} from "../models/subscription.models.js"
import {Like} from "../models/like.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { User } from "../models/user.models.js"
import { getAllVideos } from "./video.controller.js"

const getChannelStats = asyncHandler(async (req, res) => {
    // TODO: Get the channel stats like total video views, total subscribers, total videos, total likes etc.

})

const getChannelVideos = asyncHandler(async (req, res) => {
    // TODO: Get all the videos uploaded by the channel
    const {username}=req.params
    const channelUser=await User.findOne({username}).select("_id username avatar fullName").lean();
    //read about lean()
    if(!channelUser){
        throw new ApiError(400,"channel not exist")
    }
    const allVideos=await Video.aggregate([
        {
            $match:{
                owner:new mongoose.Types.ObjectId(channelUser._id)
            }
        },
        {
        $sort: { createdAt: -1 } // newest first
        },
        {
            $project: {
                title: 1,
                description: 1,
                thumbnail: 1,
                views: 1,
                duration: 1,
                createdAt: 1,
            }
        }
    ])

    return res.status(200).json(
        new ApiResponse(200,{
        channel: channelUser,// not 
        videos: allVideos,
        },
      "all Videos fetched Successfully")
    )

})

export {
    getChannelStats, 
    getChannelVideos
    }
import { User } from "../models/user.models.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/apiError.js";
import { ApiResponse } from "../utils/apiResponse.js";
import mongoose from "mongoose";

const getWatchHistory = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const history = await User.aggregate([
    {
      $match: {
        _id: new mongoose.Types.ObjectId(userId),
      },
    },
    {
      $project: {
        watchHistory: { $slice: ["$watchHistory", 20] }
      },
    },
    {
      $unwind: {
        path: "$watchHistory",
        includeArrayIndex: "order",
      },
    },
    {
      $lookup: {
        from: "videos",
        localField: "watchHistory",
        foreignField: "_id",
        as: "video",
        pipeline: [
          {
            $lookup: {
              from: "users",
              localField: "owner",
              foreignField: "_id",
              as: "owner",
              pipeline: [
                {
                  $project: {
                    username: 1,
                    avatar: 1,
                  },
                },
              ],
            },
          },
          {
            $addFields: {
              owner: { $first: "$owner" },
            },
          },
          {
            $project: {
              title: 1,
              thumbnail: 1,
              duration: 1,
              views: 1,
              createdAt: 1,
              owner: 1,
            },
          },
        ],
      },
    },
    {
      $unwind: "$video",
    },
    {
      $sort: {
        order: 1, // preserve watch order
      },
    },
    {
      $replaceRoot: {
        newRoot: "$video",
      },
    },
  ]);

  return res.status(200).json(
    new ApiResponse(200, history, "Watch history fetched")
  );
});
const addVideoTowatchHistory=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"invalid videoId")
    }
    await User.findByIdAndUpdate(req.user._id,
    {
      $pull: { watchHistory: videoId },
    }
    )

    await User.findByIdAndUpdate(
        req.user._id,
        {
        $push: {
            watchHistory: {
            $each: [videoId],
            $position: 0,
            $slice: 50,
            },
        },
        }
    );

    return res.status(200).json(new ApiResponse(200,{},"video added to watchHistory"))
 

})
const removeWatchHistory=asyncHandler(async(req,res)=>{
    await User.findByIdAndUpdate(req.user._id, {
    $set: { watchHistory: [] },
    });
    return res.status(200).json(new ApiResponse(200,{},"watchHistory deleted"))

})

export {
    getWatchHistory,
    addVideoTowatchHistory,
    removeWatchHistory
}
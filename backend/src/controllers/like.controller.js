import mongoose, {isValidObjectId} from "mongoose"
import {Like} from "../models/like.models.js"
import { Video } from "../models/video.models.js"
import { Comment } from "../models/comment.models.js"
import { Tweet } from "../models/tweet.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const {videoId} = req.params
    //TODO: toggle like on video

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId).select("_id");
    if (!video) throw new ApiError(404, "Video not found");

  // attempt to toggle using unique index; handle race conditions
  // try to create a Like; if duplicate key error -> like already exists => remove it
    try {
        await Like.create({ likedBy: req.user._id, video: videoId });
        const likesCount = await Like.countDocuments({ video: videoId });
        return res.status(200).json(new ApiResponse(200, { liked: true,likedBy:req.user._id, likesCount }, "Liked"));
        } catch (err) {
        // duplicate key means like already exists -> remove it (unlike)
        if (err.code === 11000) {
        await Like.deleteOne({ likedBy: req.user._id, video: videoId });
        const likesCount = await Like.countDocuments({ video: videoId });
        return res.status(200).json(new ApiResponse(200, { liked: false, likesCount }, "Like removed"));
        }
        console.error("toggleVideoLike error:", err);
        throw new ApiError(500, "Failed to toggle like");
    }
    
})
//check comment and tweet like
const toggleCommentLike = asyncHandler(async (req, res) => {
    const {commentId} = req.params
    //TODO: toggle like on comment
    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400,"invalid commentId")
    }
    const comment=Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"Comment not found")
    }
    try {
        await Like.create({likedBy:req.user._id,comment:commentId})
        const likeCount=await Like.countDocuments({comment:commentId})
        return res.status(200).json(new ApiResponse(200,{liked:true,likeCount},"Comment Liked"))
    } catch (error) {
        if(error.code===11000){
            await Like.deleteOne({likedBy:req.user._id,comment:commentId})
        }
        const likesCount = await Like.countDocuments({ comment: commentId });
        return res.status(200).json(new ApiResponse(200, { liked: false, likesCount }, "Comment Like removed"));

        console.error("toggleVideoLike error:", error);
        throw new ApiError(500, "Failed to toggle like");
    }

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const {tweetId} = req.params
    //TODO: toggle like on tweet
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400,"Invalid TweetId")
    }
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(500,"Tweet not found")
    }
    try {
        await Like.create({likedBy:req.user._id,tweet:tweetId})
        const likeCount=await Like.countDocuments({tweet:tweetId})
        return res.status(200).json(new ApiResponse(200,{liked:true,likeCount},"Liked"))
    } catch (error) {
        if(error.code===11000){
            await Like.deleteOne({likedBy:req.user._id,tweet:tweetId})
            const likesCount = await Like.countDocuments({ tweet: tweetId });
            return res.status(200).json(new ApiResponse(200, { liked: false, likesCount }, "Like removed"));
        }
        console.error("toggleVideoLike error:", err);
        throw new ApiError(500, "Failed to toggle like");
        
    }
})

const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos=await Like.aggregate([
        {
            $match:{
                likedBy:req.user._id
            }
        },
        {
            $lookup:{
                from:"videos",
                localField:"video",
                foreignField:"_id",
                as:"video",
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
        {
            $addFields:{
                video:{$first:"$video"}
            }
        }
    ])
    return res.status(200).json(new ApiResponse(200,likedVideos,"All liked videos fetched successfully"))
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
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

    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    let liked
    const existingVideo=await Like.findOne({likedBy:req.user._id,video:videoId})
 
    if(existingVideo){
        await Like.deleteOne({_id:existingVideo._id});
        liked=false
    }else{
        await Like.create({likedBy:req.user._id,video:videoId})
        liked=true
    }
    const likeCount = await Like.countDocuments({ video: videoId });

     return res.status(200).json(
    new ApiResponse(
      200,
      { liked, likeCount },
      liked ? "video liked" : "Like removed"
    )
  );
    
})
const toggleCommentLike = asyncHandler(async (req, res) => {
  const { commentId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(commentId)) {
    throw new ApiError(400, "Invalid CommentID");
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    throw new ApiError(404, "Comment not found");
  }

  const existingComment = await Like.findOne({
    likedBy: req.user._id,
    comment: commentId,
  });

  let liked;

  if (existingComment) {
    await Like.deleteOne({ _id: existingComment._id });
    liked = false;
  } else {
    await Like.create({
      likedBy: req.user._id,
      comment: commentId,
    });
    liked = true;
  }

  const likeCount = await Like.countDocuments({ comment: commentId });

  return res.status(200).json(
    new ApiResponse(
      200,
      { liked, likeCount },
      liked ? "comment liked" : "Like removed"
    )
  );
});
const toggleTweetLike = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid TweetId");
  }

  const tweet = await Tweet.findById(tweetId);
  if (!tweet) {
    throw new ApiError(404, "Tweet not found");
  }

  const existingLike = await Like.findOne({
    likedBy: req.user._id,
    tweet: tweetId,
  });

  let liked;

  if (existingLike) {
    await Like.deleteOne({ _id: existingLike._id });
    liked = false;
  } else {
    await Like.create({
      likedBy: req.user._id,
      tweet: tweetId,
    });
    liked = true;
  }

  const likeCount = await Like.countDocuments({ tweet: tweetId });

  return res.status(200).json(
    new ApiResponse(
      200,
      { liked, likeCount },
      liked ? "Tweet liked" : "Like removed"
    )
  );
});
const getLikedTweets=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params

    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400,"invalid tweetId")
    }
    const tweet=await Tweet.findById(tweetId)
    if(!tweet){
        throw new ApiError(400,"tweet not found")
    }
    const userLike=await Like.findOne({likedBy:req.user._id,tweet:tweetId})
    const likeCount=await Like.countDocuments({tweet:tweetId})
    
    return res.status(200)
    .json(
        new ApiResponse(200,
            {liked:Boolean(userLike),likeCount}
            ,"get liked Tweets"))

})
const getLikedperVideo=asyncHandler(async(req,res)=>{
    const {videoId}=req.params
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(402,"invalid videoId")
    }
    const video=await Video.findById(videoId)
    if(!video){
        throw new ApiError(402,"video not found")
    }
    const userLike=await Like.findOne({likedBy:req.user._id,video:videoId})
    const likeCount=await Like.countDocuments({video:videoId})

    return res.status(200).json(new ApiResponse(200,{liked:Boolean(userLike),likeCount},"get Liked per videos"))
})
const getLikedComments=asyncHandler(async(req,res)=>{
    const {commentId}=req.params

    if(!mongoose.Types.ObjectId.isValid(commentId)){
        throw new ApiError(400,"invalid commentId")
    }
    const comment=await Comment.findById(commentId)
    if(!comment){
        throw new ApiError(400,"comment not found")
    }
    const userLike=await Like.findOne({likedBy:req.user._id,comment:commentId})
    const likeCount=await Like.countDocuments({comment:commentId})
    
    return res.status(200)
    .json(
        new ApiResponse(200,
            {liked:Boolean(userLike),likeCount}
            ,"get liked comments"))

})
    const getLikedVideos = asyncHandler(async (req, res) => {
    //TODO: get all liked videos
    const likedVideos=await Like.aggregate([
        {
            $match:{
                likedBy:req.user._id,
                video: { $exists: true, $ne: null },
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
    getLikedVideos,
    getLikedTweets,
    getLikedperVideo,
    getLikedComments
}
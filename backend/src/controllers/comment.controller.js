import mongoose, { Mongoose, Schema } from "mongoose"
import {Comment} from "../models/comment.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Like } from "../models/like.models.js"

const getVideoComments = asyncHandler(async (req, res) => {
    const { videoId } = req.params;
    let { page = 1, limit = 10 } = req.query;

    page = Number(page);
    limit = Number(limit);
    const skip = (page - 1) * limit;

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const comments = await Comment.aggregate([
        {
        $match: {
            video: new mongoose.Types.ObjectId(videoId),
        },
        },
        { $sort: { createdAt: -1 } },

        {
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner",
            pipeline: [{ $project: { username: 1, avatar: 1 } }],
        },
        },
        { $addFields: { owner: { $first: "$owner" } } },

        {
        $project: {
            content: 1,
            createdAt: 1,
            updatedAt: 1,
            owner: 1,
        },
        },

        {
        $lookup: {
            from: "likes",
            localField: "_id",
            foreignField: "comment",
            as: "likes",
        },
        },

        {
        $addFields: {
            likeCount: { $size: "$likes" },
            liked: {
            $in: [
                new mongoose.Types.ObjectId(req.user._id),
                "$likes.likedBy",
            ],
            },
        },
        },

        // 🔥 REMOVE likes array
        {
        $project: {
            likes: 0,
        },
        },

        { $skip: skip },
        { $limit: limit },
            ]);


    const totalComments = await Comment.countDocuments({ video: videoId });
    return res.status(200).json(
        new ApiResponse(
            200,
            {
                comments,
                pagination: {
                    total: totalComments,
                    page,
                    limit,
                    totalPages: Math.ceil(totalComments / limit)
                },

            },
            "All comments fetched successfully"
        )
    );
});

const getTweetComments=asyncHandler(async(req,res)=>{
    const {tweetId}=req.params
    if(!mongoose.Types.ObjectId.isValid(tweetId)){
        throw new ApiError(400,"invalid tweetId")
    }
    const comments=await Comment.aggregate([
        {
            $match:{tweet:new mongoose.Types.ObjectId(tweetId)}
        },
        {$sort:{createdAt:-1}},
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
            $addFields:{owner:{$first:"$owner"}}
        },
        {
          $lookup:{
            from:"likes",
            localField:"_id",
            foreignField:"tweet",
            as:"likes"
            }  
        },
        {
            $addFields:{
                likeCount:{$size:"$likes"},
                liked:{$in:[new mongoose.Types.ObjectId(req.user._id),"$likes.likedBy"]}
            }
        },
        {
        $project: {
            content: 1,
            createdAt: 1,
            owner: 1,
            likeCount: 1,
            liked: 1,
        },
        },
    
    ])
    return res.status(200).json(
    new ApiResponse(
      200,
      { comments },
      "Tweet comments fetched successfully"
    )
  );
    
})

const addTweetComment = asyncHandler(async (req, res) => {
  const { tweetId } = req.params;
  const { content } = req.body;

  if (!content?.trim()) {
    throw new ApiError(400, "Content is required");
  }

  if (!mongoose.Types.ObjectId.isValid(tweetId)) {
    throw new ApiError(400, "Invalid tweetId");
  }

  // 1️⃣ Create comment
  const comment = await Comment.create({
    content,
    tweet: tweetId,
    owner: req.user._id,
  });

  // 2️⃣ Populate owner (🔥 MOST IMPORTANT FIX)
  const populatedComment = await Comment.findById(comment._id)
    .populate("owner", "username fullName avatar");

  // 3️⃣ Add defaults expected by frontend
  const responseComment = {
    ...populatedComment.toObject(),
    liked: false,
    likeCount: 0,
  };

  return res.status(201).json(
    new ApiResponse(
      201,
      responseComment,
      "Comment added successfully"
    )
  );
});


const addVideoComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const {videoId}=req.params
    const {content}=req.body
    if(!content){
        throw new ApiError(400,"Content is required")
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400, "Invalid videoId");
    }
    const comment=await Comment.create({
        content,
        video:videoId,
        owner:req.user._id
    })
    return res.status(200).json(
        new ApiResponse(200,comment,"Comments added successfully")
    )
})

const updateComment = asyncHandler(async (req, res) => {
    // TODO: update a comment
    const { commentId } = req.params;
    const { content } = req.body;

    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    if (!content || !String(content).trim()) {
        throw new ApiError(400, "Content is required");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    if (String(comment.owner) !== String(req.user._id)) {
        throw new ApiError(403, "You are not authorized to edit this comment");
    }

    comment.content = content.trim();
    await comment.save();

    return res.status(200).json(
        new ApiResponse(200, comment, "Comment updated successfully")
    );
})

const deleteComment = asyncHandler(async (req, res) => {
    // TODO: delete a comment
    const { commentId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(commentId)) {
        throw new ApiError(400, "Invalid commentId");
    }

    const comment = await Comment.findById(commentId);
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }
    if (!(String(comment.owner) === String(req.user._id))) {
        throw new ApiError(403, "You are not authorized to delete this comment");
    }
    await Comment.findByIdAndDelete(commentId)
    return res.status(200).json(
        new ApiResponse(200,null,"comment deleted successfully")
    )
})

export {
    getVideoComments, 
    getTweetComments,
    addVideoComment,
    addTweetComment, 
    updateComment,
    deleteComment
    }
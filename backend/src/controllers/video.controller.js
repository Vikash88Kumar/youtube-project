import mongoose, {isValidObjectId} from "mongoose"
import {Video} from "../models/video.models.js"
import {User} from "../models/user.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
  // query params
  const page = Math.max(1, parseInt(req.query.page || "1", 10));
  const limit = Math.max(1, parseInt(req.query.limit || "10", 10));
  const skip = (page - 1) * limit;
  const { query, sortBy = "createdAt", sortType = "desc", userId } = req.query;

  // Build filter
  const filter = {};

  // By default only published videos
  filter.isPublished = true;

  // Optional: filter by user/channel
  if (userId) {
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      throw new ApiError(400, "Invalid userId");
    }
    filter.owner = new mongoose.Types.ObjectId(userId);
  }

  // Search: title or description (case-insensitive)
  if (query && String(query).trim()) {
    const q = String(query).trim();
    const regex = new RegExp(q, "i");
    filter.$or = [{ title: regex }, { description: regex }];
  }

  // Determine sort
  const sortDirection = String(sortType).toLowerCase() === "asc" ? 1 : -1;
  // whitelist sortBy fields to avoid injection (extend as needed)
  const allowedSortFields = ["createdAt", "views", "title", "duration", "likes"];
  const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

  const agg = [
    { $match: filter },

    // optional: project fields you want to index/return quickly
    {
      $project: {
        title: 1,
        description: 1,
        thumbnail: 1,
        videoFile: 1,
        duration: 1,
        views: 1,
        likes: 1,
        owner: 1,
        createdAt: 1,
      }
    },

    // owner lookup (small projection)
    {
      $lookup: {
        from: "users",
        localField: "owner",
        foreignField: "_id",
        as: "owner",
        pipeline: [{ $project: { username: 1, avatar: 1, fullName: 1 } }]
      }
    },
    { $addFields: { owner: { $first: "$owner" } } },

    // sort first, then facet for pagination
    { $sort: { [sortField]: sortDirection } },

    {
      $facet: {
        metadata: [{ $count: "total" }],
        data: [{ $skip: skip }, { $limit: limit }]
      }
    }
  ];

  const aggregateResult = await Video.aggregate(agg);
  const result = aggregateResult[0] || { metadata: [], data: [] };
  const total = (result.metadata[0] && result.metadata[0].total) || 0;
  const totalPages = Math.ceil(total / limit);

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        videos: result.data,
        pagination: { total, page, limit, totalPages }
      },
      "Videos fetched successfully"
    )
  );
});
//need to be understand

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description} = req.body
    // TODO: get video, upload to cloudinary, create video
    if(!(title && description)){
        throw new ApiError(400,"All fields are required")
    }
    const videoLocalpath=req.files?.videoFile[0]?.path
    if(!videoLocalpath){
        throw new ApiError(400,"Video file is missing")
    }
    const videoFile=await uploadOnCloudinary(videoLocalpath)
    if(!videoFile){
        throw new ApiError(400,"Error occured on uplaoding video")
    }
    const thumbnailLocalpath=req.files?.thumbnail[0]?.path
    if(!thumbnailLocalpath){
        throw new ApiError(400,"thumbnail file is missing")
    }
    const thumbnail=await uploadOnCloudinary(thumbnailLocalpath)
    if(!thumbnail){
        throw new ApiError(400,"Error occured on uplaoding video")
    }
    const videoDoc=await Video.create({
        videoFile:videoFile.secure_url,
        thumbnail:thumbnail.secure_url,
        title,
        description,
        owner:req.user?._id,
        duration:videoFile.duration
    })
    return res.status(200).json(new ApiResponse(200,videoDoc,"video uploaded successfully"))
})

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"inavlid videoId")
    }
    const videoDoc=await Video.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(videoId)
            }
        },
        {
            $lookup:{
                from:"users",
                localField:"owner",
                foreignField:"_id",
                as:"owner",
                pipeline:[
                    {
                      $project:{username:1,fullName:1,avatar:1}
                    }
                ]
            }
        },
        {
          $addFields:{owner:{$first:"$owner"}}
        },
        {
          $lookup:{
            from:"subscriptions",
            localField:"owner._id",
            foreignField:"channel",
            as:"subscriptions"
          }
        },
        {
          $addFields:{
            subscribersCount:{$size:"$subscriptions"},
            isSubscribed:{$in:[new mongoose.Types.ObjectId(req.user._id),"$subscriptions.subscriber"]}
          }
        },
        {
          $project:{subscriptions:0}
        }
    ])
    return res.status(200).json(
        new ApiResponse(200,videoDoc[0],"video fetched successfully")
    )


})
//
const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail
    if(!mongoose.Types.ObjectId.isValid(videoId)){
        throw new ApiError(400,"inavlid videoId")
    }

    const {title,description}=req.body
    if(!(title && description)){
        throw new ApiError(400,"All fields are required")
    }
    const newThumbnailLocalpath=req.file?.thumbnail?.[0]?.path
    if(!newThumbnailLocalpath){
        throw new ApiError(400,"thumbnail is missing")
    }
    const newThumbnail=await uploadOnCloudinary(newThumbnailLocalpath)
    if(!newThumbnail){
        throw new ApiError(400,"newThumbnail upload failed")
    }
    const video=await Video.findByIdAndUpdate(
        videoId,
        {
            $set:{
                title,
                description,
                thumbnail:newThumbnail.secure_url
            }
        },
        {new:true}

    )
    return res.status(200).json(200,video,"Video update successfully")
    


})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video

  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }

  if (String(video.owner) !== String(req.user._id)) {
    throw new ApiError(403, "You are not authorized to delete this video");
  }

  //  Delete video + thumbnail from Cloudinary
  try {
    if (video.videoPublicId) {
      await cloudinary.v2.uploader.destroy(video.videoPublicId, {
        resource_type: "video"
      });
    }

    if (video.thumbnailPublicId) {
      await cloudinary.v2.uploader.destroy(video.thumbnailPublicId, {
        resource_type: "image"
      });
    }
  } catch (err) {
    console.warn("Cloudinary deletion failed:", err);
  }


  await Video.findByIdAndDelete(videoId);

  return res.status(200).json(
    new ApiResponse(200, null, "Video deleted successfully")
  );


})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
  if (!mongoose.Types.ObjectId.isValid(videoId)) {
    throw new ApiError(400, "Invalid videoId");
  }
  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found");
  }
  const newStatus = !video.isPublished;
  video.isPublished = newStatus;
  await video.save();

  return res.status(200).json(
    new ApiResponse(
      200,
      { videoId, isPublished: newStatus },
      `Video is now ${newStatus ? "Published" : "Unpublished"}`
    )
  );
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
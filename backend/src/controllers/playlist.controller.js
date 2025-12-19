import mongoose, {isValidObjectId} from "mongoose"
import {Playlist} from "../models/playlist.models.js"
import {ApiError} from "../utils/apiError.js"
import {ApiResponse} from "../utils/apiResponse.js"
import {asyncHandler} from "../utils/asyncHandler.js"
import { Video } from "../models/video.models.js"
import {uploadOnCloudinary} from "../utils/cloudinary.js"

const createPlaylist = asyncHandler(async (req, res) => {
    const {name, description,visibility} = req.body
    //TODO: create playlist
    if(!(name && description && visibility)){
        throw new ApiError(400,"All fields are required")
    }
    const thumbnailLocalpath=req.file?.path
    if(!thumbnailLocalpath){
        throw new ApiError(400,"thumbnail required")
    }
    const thumbnail=await uploadOnCloudinary(thumbnailLocalpath)
    if(!thumbnail){
        throw new ApiError(400,"failed upload thumbnail")
    }
    const playlist=await Playlist.create({
        name,
        description,
        thumbnail:thumbnail.url,
        visibility,
        owner:req.user._id
    })
    return res.status(200).json(new ApiResponse(200,playlist,"playlist creaatrd successfully"))
})  

const getUserPlaylists = asyncHandler(async (req, res) => {
    //TODO: get user playlists
    const allPlaylist=await Playlist.aggregate([
        {
            $match:{owner:req.user._id}
        }
    ])
    return res.status(200).json(new ApiResponse(200,allPlaylist,"allPlaylist creaatrd successfully"))
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    //TODO: get playlist by id
    const playlist=await Playlist.aggregate([
        {
            $match:{
                _id:new mongoose.Types.ObjectId(playlistId)
            }
        },
        {   $lookup:{
                from:"videos",
                localField:"videos",
                foreignField:"_id",
                as:"videos",
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
        new ApiResponse(200,playlist[0],"playlist fetched Successfully")
    )
})

const addVideoToPlaylist = asyncHandler(async (req, res) => {
    const { name,videoId} = req.params

    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }

    const video = await Video.findById(videoId).select("_id title owner"); 
    if (!video) {
        throw new ApiError(404, "Video not found");
    }


    const playlist = await Playlist.findOne({name});
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, "You are not allowed to modify this playlist");
    }

    const updated = await Playlist.findByIdAndUpdate(
        playlist._id,
        { $addToSet: { videos: video._id } }, 
        )
        .populate([  //not clear
        { path: "videos", select: "title duration owner" }, // adjust fields
        { path: "owner", select: "username avatar" }
        ]);
    //not clear
    const alreadyPresent = playlist.videos && playlist.videos.some(v => String(v) === String(video._id));

    return res.status(200).json(
        new ApiResponse(
        200,
        { playlist: updated, alreadyPresent },
        alreadyPresent ? "Video already in playlist" : "Video added to playlist"
        )
    );

})

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {
    const {playlistId, videoId} = req.params
    // TODO: remove video from playlist
    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }
    if (!mongoose.Types.ObjectId.isValid(videoId)) {
        throw new ApiError(400, "Invalid videoId");
    }
    const playlist = await Playlist.findById(playlistId).select("owner videos");
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }


    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, "You are not authorized to modify this playlist");
    }

    // check if video is present
    const videoPresent = Array.isArray(playlist.videos) &&
        playlist.videos.some(v => String(v) === String(videoId));
    if (!videoPresent) {
        return res.status(200).json(new ApiResponse(200, playlist, "Video was not in the playlist"));
    }

    // atomically remove the video using $pull
    const updated = await Playlist.findByIdAndUpdate(
        playlistId,
        { $pull: { videos: new mongoose.Types.ObjectId(videoId) } },
        { new: true }
    )

    return res.status(200).json(new ApiResponse(200, updated, "Video removed from playlist successfully"));

})

const deletePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    // TODO: delete playlist


    if (!mongoose.Types.ObjectId.isValid(playlistId)) {
        throw new ApiError(400, "Invalid playlistId");
    }

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }
    if (String(playlist.owner) !== String(req.user._id)) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }


    await Playlist.findByIdAndDelete(playlistId);

    return res.status(200).json(
        new ApiResponse(200, null, "Playlist deleted successfully")
    );
})

const updatePlaylist = asyncHandler(async (req, res) => {
    const {playlistId} = req.params
    const {name, description} = req.body
    //TODO: update playlist
    if(!(name && description)){
        throw new ApiError(400,"all fiels are required")
    } 
    if(!(mongoose.Types.ObjectId.isValid(playlistId))){
        throw new ApiError(400, "Invalid playlistId");
    }
    const playlist= await Playlist.findById(playlistId)
    if(!playlist){
        throw new ApiError(400,"playlist not found")
    }
    if(String(playlist.owner)!==String(req.user._id)){
        throw new ApiError(400,"Unauthorized to update playlist")
    }
    playlist.name=name;
    playlist.description=description
    await playlist.save()
    return res.status(200).json(
        new ApiResponse(200,playlist, "Playlist updated successfully")
    )
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
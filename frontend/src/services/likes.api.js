import api from "../api/axios.js"

export const likeVideos=async(videoId)=>{
    const res=await api.post(`/likes/toggle/v/${videoId}`)
}
export const likeTweets=async()=>{

}
export const likeComments=async()=>{

}

export const getLikedVideos=async()=>{
    const res=await api.get("/likes/videos")
    return res.data
}

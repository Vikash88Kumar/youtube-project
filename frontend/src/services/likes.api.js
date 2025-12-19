import api from "../api/axios.js"

export const likeVideos=async(videoId)=>{
    return await api.post(`/likes/toggle/v/${videoId}`)
}
export const getLikedperVideo=async(videoId)=>{
    return await api.get(`/likes/get/v/${videoId}`)
}
export const likeTweets=async(tweetId)=>{
    return await api.post(`/likes/toggle/t/${tweetId}`)
}
export const getlikedTweets=async(tweetId)=>{
    return await api.get(`/likes/tweets/${tweetId}`)
}
export const likeComments=async(commentId)=>{
    return await api.post(`/likes/toggle/c/${commentId}`)
}
export const getLikedComment = (commentId) => {
    return api.get(`/likes/comments/${commentId}`);
};
export const getLikedVideos=async()=>{
    const res=await api.get("/likes/videos")
    return res.data
}

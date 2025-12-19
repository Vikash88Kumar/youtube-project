import api from "../api/axios.js"

export const createComment=async(videoId,data)=>{
    try {
        const res=await api.post(`/comments/${videoId}`,data)
        return res
    } catch (error) {
        console.log("failed commnet create on video",error?.message)
    }
}
export const getVideoComments=async(videoId)=>{
    try {
        const res=await api.get(`/comments/${videoId}`)
        return res.data
    } catch (error) {
        console.log("failed fetch commnet on video",error?.message)
    }
}
export const createTweetComment=async(tweetId,data)=>{
    try {
        return await api.post(`/comments/t/${tweetId}`,data)
        
    } catch (error) {
        console.log("failed commnet create on post",error?.message)  
    }
}
export const getTweetComments=async(tweetId)=>{
    try {
        const res=await api.get(`/comments/t/${tweetId}`)
        return res.data
    } catch (error) {
        console.log("failed fetch commnet on video",error?.message)
    }
}

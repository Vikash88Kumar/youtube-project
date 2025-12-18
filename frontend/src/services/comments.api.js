import api from "../api/axios.js"

export const createComment=async(videoId,data)=>{
    try {
        const res=await api.post(`/comments/${videoId}`,data)
        return res.data
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

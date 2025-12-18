import api from "../api/axios.js"

export const getAllVideos=async()=>{
    try {
        const res=await api.get("/videos")
        return res.data;
    } catch (error) {
        console.error("Error fetching videos:", error.response?.data || error.message);
        throw error;
    }
}
export const publishAVideo=async(data)=>{
    try {
      const res=await api.post("/videos",data,{
            headers: {
                "Content-Type": "multipart/form-data",
            },
      })
      return res.data;
    } catch (error) {
      console.error("publishAvideo error:", error.response?.data || error.message);
      throw error;
    }
}
export const getVideoById=async(videoId)=>{
    try {
        const res=await api.get(`/videos/${videoId}`)
        return res
    } catch (error) {
        console.log("getvideobyId error", error.response?.data || error.message)
        throw error
    }
}
export const deleteVideo=async()=>{
    try {
        const res=await api.delete(`/videos/${videoId}`)
        return res.dta
    } catch (error) {
        console.log("getvideobyId error", error.response?.data || error.message)
        throw error
    }
}
export const updateVideo=async()=>{
    try {
        const res=await api.patch(`/videos/${videoId}`)
        return res.dta
    } catch (error) {
        console.log("getvideobyId error", error.response?.data || error.message)
        throw error
    }
}
export const togglePublishStatus=async()=>{
    try {
        const res=await api.patch(`/toggle/publish/${videoId}`)
        return res.data
    } catch (error) {
        console.log("toggle Publish Status",error.response?.data || error.message)
    }
}
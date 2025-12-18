import api from "../api/axios.js"

export const getWatchHistory=async()=>{
    try {
        const res=await api.get("/history")
        return res.data
    } catch (error) {
        console.log("watch history failed",error?.message)
    }
}
export const addVideoTowatchHistory=async(videoId)=>{
    try {
       const res=await api.post(`/history/${videoId}`) 
    } catch (error) {
        console.log("failed videoadd to watch history",error?.message)
    }
}
export const removeWatchHistory=async()=>{
    try {
      const res=await api.delete("/history")
      return res  
    } catch (error) {
        console.log("failed watch history deleted",error?.message)
    }
}
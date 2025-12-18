import api from "../api/axios.js"

export const getChannelVideos=async(username)=>{
    try {
     const res=await api.get(`/dashboard/${username}/videos`)
     return res.data   
    } catch (error) {
        console.log("getchannelVideos Error",error.message)
    }
}
export const getChannelStatus=async()=>{
    
}
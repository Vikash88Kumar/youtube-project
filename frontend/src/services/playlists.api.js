import api from "../api/axios.js"

export const createPlaylist=async(formdata)=>{
    const res=await api.post("/playlist",formdata,
        {
            headers:{"Content-Type":"multipart/form-data"}
        }
    )
}

export const getUserPlaylists=async(userId)=>{
    try {
        const res =await api.get(`/playlist/user/${userId}`)
        return res.data
    } catch (error) {
        console.log("get user palylist failed",error?.message)
    }
}

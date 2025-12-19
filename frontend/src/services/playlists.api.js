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

export const getPlaylistById = (playlistId) => {
  return api.get(`/playlist/${playlistId}`);
};

export const addVideoToPlaylist = (videoId,name) => {
  return api.patch(`/playlist/add/${videoId}/${name}`);
};

export const removeVideoFromPlaylist = (videoId,playlistId) => {
  return api.patch(`/playlist/remove/${videoId}/${playlistId}`);
};
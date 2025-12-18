import api from "../api/axios.js";

export const registerUser = async (data) => {
  try {
    const res = await api.post("/users/register", data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return res.data;
  } catch (err) {
    console.error("Registration error:", err.response?.data || err.message);
    throw err;
  }
}
export const LoginUser=async(data)=>{
    try {
      const res=await api.post("/users/login",data,{
          headers:{
              "Content-Type":"application/json"
          }
      })
      return res.data;
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      throw error;
    }
}
export const LogoutUser=async()=>{
    try {
      const res=await api.post("/users/logout")
      return res.data;
    } catch (error) {
      console.error("Logout error:", error.response?.data || error.message);
      throw error;
    }
}
export const getCurrentUser=async()=>{
  try {
    const res=await api.get("/users/current-user")
    return res
  } catch (error) {
    console.log("getCurrentUser error",error.message)
    throw error
  }
}
export const getUserChannelProfile=async(username)=>{
    try {
      const res=await api.get(`/users/channel/${username}`,{
          headers:{
              "Content-Type":"application/json"
          }
      })
      return res.data;
    } catch (error) {
      console.error("getuserchannelprofile error:", error.response?.data || error.message);
      throw error;
    }
}
export const getWatchHistory=async()=>{
    try {
      const res=await api.get("/users/watchistory",{
          headers:{
              "Content-Type":"application/json"
          }
      })
      return res.data;
    } catch (error) {
      console.error("getwatchhistory error:", error.response?.data || error.message);
      throw error;
    }
}

import api from "../api/axios.js"

export const createTweet = async (formData) => {
  const response = await api.post("/tweets", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};
export const getAllPosts=async ()=>{
    const response=await api.get("/tweets")
    return response.data
}
export const getUserTweets=async (username)=>{
    const response=await api.get(`/tweets/${username}/post`)
    return response.data
}


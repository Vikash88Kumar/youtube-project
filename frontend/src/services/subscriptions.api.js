import api from "../api/axios.js"

export const toggleSubscription=async(channelId)=>{
    try {
        const res =await api.post(`/subscriptions/c/${channelId}`)
        return res.data
    } catch (error) {
        console.log("toggle subsccription failed",error?.message)
    }
}
export const getSubscribedChannels=async(subscriberId)=>{
    try {
        const res= await api.get(`/subscriptions/u/${subscriberId}`)
        return res.data
    } catch (error) {
        console.log("fetching subscribed channel failed",error?.message)
    }
}

export const getUserChannelSubscribers=async(username)=>{
    const res=await api.get(`/subscriptions/c/${username}`)
    return res.data.data
}

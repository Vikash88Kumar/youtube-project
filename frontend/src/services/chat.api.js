import api from "../api/axios.js"

export const createMessage=async(chatId,content)=>{
    try {
       const res= await api.post(`/chat/${chatId}/create-message`,content,
       ) 
       return res.data
    } catch (error) {
        console.log("create message Error",error.message)
        throw error
    }
}

export const createChatRooms=async(username)=>{
    try {
        const res=await api.post("/chat/create-chatroom",username)
        return res.data
    } catch (error) {
        console.log("create Chatroom failed",error.message)
        throw error
    }
}

export const getallChatRooms=async()=>{
    try {
       const res=await api.get("/chat/getallchatrooms")
       return res.data 
    } catch (error) {
        console.log("get All chtroom failed",error.message)
        throw error
    }
}

export const chatHistory=async(chatId)=>{
    try {
       const res=await api.get(`/chat/${chatId}/chatHistory`)
       return res.data 
    } catch (error) {
        console.log("get All chat history",error.message)
        throw error
    }
}

import axiosInstance from "../api/axios.js";
// import api from "../api/axios.js"
export const getNotifications = async (page = 1, limit = 20) => {
  return await axiosInstance.get(`/notifications?page=${page}&limit=${limit}`);
};

export const markAllNotificationsRead = async () => {
  return await axiosInstance.patch("/notifications/mark-all-read");
};

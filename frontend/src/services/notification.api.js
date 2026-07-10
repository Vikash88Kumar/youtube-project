import api from "../api/axios.js";


export const getNotifications = async (page = 1, limit = 20) => {
  return await api.get(`/notifications?page=${page}&limit=${limit}`);
};

export const markAllNotificationsRead = async () => {
  return await api.patch("/notifications/mark-all-read");
};

import axios from "axios";

const api = axios.create({
  baseURL: "https://youtube-project-gkgf.onrender.com/api/v1",
  withCredentials: true,
});

export default api;

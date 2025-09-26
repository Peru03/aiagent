import axios from "axios";

const API = axios.create({
  baseURL: "https://aiagent-production-a2f5.up.railway.app/api",
});

API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // must exist
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});
const token = localStorage.getItem('token');

const Config = axios.create({
  baseURL: "https://aiagent-production-a2f5.up.railway.app/api",
  headers: {
    'Authorization': `Bearer ${token}`
  },
});

export default API;


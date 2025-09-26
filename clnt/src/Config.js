import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:8000/api",
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
  baseURL: "http://localhost:8000/api",
  headers: {
    'Authorization': `Bearer ${token}`
  },
});

export default API;


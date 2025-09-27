import axios from "axios";

const API = axios.create({
  baseURL: "https://aiagent-production-a2f5.up.railway.app/api",
});

// Add token dynamically before every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  // CORS headers (informational only; backend must allow them)
  config.headers["Access-Control-Allow-Origin"] = "*";
  config.headers["Access-Control-Allow-Methods"] = "GET, POST, PUT, DELETE, OPTIONS";
  config.headers["Access-Control-Allow-Headers"] = "Content-Type, Authorization";

  return config;
}, (error) => {
  return Promise.reject(error);
});

export default API;

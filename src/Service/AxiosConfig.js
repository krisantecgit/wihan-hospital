import axios from "axios";

const BASE_URL = "http://192.168.0.180:1234/"; 
// const BASE_URL = "https://api-staging.wihan.in/";
// const BASE_URL = "https://api.wihan.in/";
 
export const CURRENT_BASE_URL = BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Attach token automatically
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers["Authorization"] = `Token ${token}`;
  }

  return config;
});

export default axiosInstance;

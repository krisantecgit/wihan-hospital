import axios from "axios";

// Create an Axios instance
const axiosInstance = axios.create({
  // baseURL: "http://192.168.0.241:9876/",
  baseURL: "https://api.wihan.in/",
  // baseURL: "https://api.wihan.in/",
});

// Add a request interceptor to attach the token from localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Retrieve the token from localStorage
  if (token) {
    config.headers["Authorization"] = `Token ${token}`; // Add the token to the request headers
  }

  return config;
});

export default axiosInstance;

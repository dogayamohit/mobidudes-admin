import axios from "axios";

const api = axios.create({
  baseURL: "https://api.winnester.com",

  // API uses status code to define success 
  validateStatus: function (status) {
    return status >= 200 && status < 300; 
  },
});

// Add token if required
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default api;

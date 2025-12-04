import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.PROD
    ? import.meta.env.VITE_API_URL  // Render
    : "/api",                       // Local com proxy
});

export default api;
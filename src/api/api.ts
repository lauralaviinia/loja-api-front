import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL || "https://loja-api-back.onrender.com", // Render
    heards: {
      "Content-Type": "application/json",
    },                      
});

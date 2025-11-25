import axios from "axios";

const api = axios.create({
  // Em dev, usamos o proxy do Vite: prefixe chamadas com /api
  // O proxy configurado em `vite.config.ts` encaminha para localhost:3000
  baseURL: "/api",
});

export default api;

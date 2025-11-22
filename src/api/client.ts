// src/api/client.ts
import axios from "axios";

const CYBERSOFT_TOKEN = import.meta.env.VITE_CYBERSOFT_TOKEN as string;

// Keys for localStorage
export const ACCESS_TOKEN_KEY = "ACCESS_TOKEN";
export const USER_INFO_KEY = "USER_INFO";

export const api = axios.create({
  baseURL: "https://movienew.cybersoft.edu.vn/api",
});

api.interceptors.request.use((config) => {
  if (!config.headers) config.headers = {};

  // Always send TokenCybersoft
  config.headers["TokenCybersoft"] = CYBERSOFT_TOKEN;

  // Send Authorization Bearer token for protected endpoints (DatVe, ThongTinTaiKhoan, etc.)
  const accessToken = localStorage.getItem(ACCESS_TOKEN_KEY);
  if (accessToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
  }

  return config;
});

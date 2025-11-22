// src/api/auth.ts
import { api } from "./client";
import { ACCESS_TOKEN_KEY, USER_INFO_KEY } from "./client";

export interface LoginCredentials {
  taiKhoan: string;
  matKhau: string;
}

export interface UserInfo {
  taiKhoan: string;
  hoTen: string;          // 👈 we’ll show this
  email: string;
  soDT: string;
  maLoaiNguoiDung: string;
  maNhom: string;
  accessToken: string;
}

// POST /QuanLyNguoiDung/DangNhap
export const login = async (credentials: LoginCredentials): Promise<UserInfo> => {
  const res = await api.post("/QuanLyNguoiDung/DangNhap", credentials);

  const user = res.data.content as UserInfo;

  // save for later
  localStorage.setItem(ACCESS_TOKEN_KEY, user.accessToken);
  localStorage.setItem(USER_INFO_KEY, JSON.stringify(user));

  return user;
};

export const logout = () => {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(USER_INFO_KEY);
};

import { api, USER_INFO_KEY } from "./client";
import type { Movie, MovieDetail } from "../features/movies/movieTypes";

// ---- MOVIES ----
export const getMovies = async (): Promise<Movie[]> => {
  const res = await api.get("/QuanLyPhim/LayDanhSachPhim", {
    params: { maNhom: "GP01" },
  });
  return res.data.content as Movie[];
};

export const getMovieDetail = async (movieId: number): Promise<MovieDetail> => {
  const res = await api.get("/QuanLyRap/LayThongTinLichChieuPhim", {
    params: { MaPhim: movieId },
  });
  return res.data.content as MovieDetail;
};

// ---- SEAT MAP ----
export interface Seat {
  maGhe: number;
  tenGhe: string;
  giaVe: number;
  loaiGhe: string;
  daDat: boolean;
  taiKhoanNguoiDat?: string | null;
}

export interface SeatMap {
  thongTinPhim: {
    maLichChieu: number;
    tenCumRap: string;
    tenRap: string;
    diaChi: string;
    tenPhim: string;
    ngayChieu: string;
    gioChieu: string;
    hinhAnh: string;
  };
  danhSachGhe: Seat[];
}

export const getSeatMap = async (showtimeId: number): Promise<SeatMap> => {
  const res = await api.get("/QuanLyDatVe/LayDanhSachPhongVe", {
    params: { MaLichChieu: showtimeId },
  });
  return res.data.content as SeatMap;
};

// ---- BOOKING ----
export interface BookingPayload {
  maLichChieu: number;
  danhSachVe: { maGhe: number; giaVe: number }[];
}

export const bookTickets = async (payload: BookingPayload) => {
  // taiKhoanNguoiDung usually comes from login response
  const userStr = localStorage.getItem(USER_INFO_KEY);
  const user = userStr ? JSON.parse(userStr) : null;
  const taiKhoanNguoiDung = user?.taiKhoan;

  if (!taiKhoanNguoiDung) {
    throw new Error("User not logged in (no taiKhoanNguoiDung found).");
  }

  const body = {
    ...payload,
    taiKhoanNguoiDung,
  };

  const res = await api.post("/QuanLyDatVe/DatVe", body);
  return res.data; // contains booking result
};

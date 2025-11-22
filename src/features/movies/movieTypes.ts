// src/features/movies/movieTypes.ts

export interface Movie {
  maPhim: number;
  tenPhim: string;
  biDanh: string;
  trailer: string;
  hinhAnh: string;
  moTa: string;
  ngayKhoiChieu: string;
  danhGia: number;
}

export interface Showtime {
  maLichChieu: number;
  maRap: string;
  tenRap: string;
  maCumRap: string;
  tenCumRap: string;
  maHeThongRap: string;
  tenHeThongRap: string;
  ngayChieuGioChieu: string;
  giaVe: number;
}

export interface MovieDetail extends Movie {
  heThongRapChieu: {
    maHeThongRap: string;
    tenHeThongRap: string;
    logo: string;
    cumRapChieu: {
      maCumRap: string;
      tenCumRap: string;
      diaChi: string;
      lichChieuPhim: Showtime[];
    }[];
  }[];
}

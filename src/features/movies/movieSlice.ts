// src/features/movies/movieSlice.ts
import { createSlice, createAsyncThunk, type PayloadAction } from "@reduxjs/toolkit";
import { api } from "../../api/client";
import type { Movie, MovieDetail } from "./movieTypes";

interface MoviesState {
  list: Movie[];
  loadingList: boolean;
  errorList: string | null;

  detail: MovieDetail | null;
  loadingDetail: boolean;
  errorDetail: string | null;
}

const initialState: MoviesState = {
  list: [],
  loadingList: false,
  errorList: null,

  detail: null,
  loadingDetail: false,
  errorDetail: null,
};

// GET /api/QuanLyPhim/LayDanhSachPhim?maNhom=GP01
export const fetchMovies = createAsyncThunk<Movie[]>(
  "movies/fetchMovies",
  async (_, { rejectWithValue }) => {
    try {
      const res = await api.get(
        "/QuanLyPhim/LayDanhSachPhim",
        { params: { maNhom: "GP01" } }
      );
      return res.data.content as Movie[];
    } catch (error: any) {
      const message =
        error.response?.data?.content || error.message || "Unknown error";
      return rejectWithValue(message);
    }
  }
);

// GET /api/QuanLyPhim/LayThongTinLichChieuPhim?MaPhim=xxx
export const fetchMovieDetail = createAsyncThunk<MovieDetail, number>(
  "movies/fetchMovieDetail",
  async (movieId, { rejectWithValue }) => {
    try {
      const res = await api.get("/QuanLyPhim/LayThongTinLichChieuPhim", {
        params: { MaPhim: movieId },
      });
      return res.data.content as MovieDetail;
    } catch (error: any) {
      const message =
        error.response?.data?.content || error.message || "Unknown error";
      return rejectWithValue(message);
    }
  }
);

const moviesSlice = createSlice({
  name: "movies",
  initialState,
  reducers: {
    clearDetail(state) {
      state.detail = null;
      state.errorDetail = null;
      state.loadingDetail = false;
    },
  },
  extraReducers: (builder) => {
    // List
    builder
      .addCase(fetchMovies.pending, (state) => {
        state.loadingList = true;
        state.errorList = null;
      })
      .addCase(
        fetchMovies.fulfilled,
        (state, action: PayloadAction<Movie[]>) => {
          state.loadingList = false;
          state.list = action.payload;
        }
      )
      .addCase(fetchMovies.rejected, (state, action) => {
        state.loadingList = false;
        state.errorList = action.payload as string;
      });

    // Detail
    builder
      .addCase(fetchMovieDetail.pending, (state) => {
        state.loadingDetail = true;
        state.errorDetail = null;
      })
      .addCase(
        fetchMovieDetail.fulfilled,
        (state, action: PayloadAction<MovieDetail>) => {
          state.loadingDetail = false;
          state.detail = action.payload;
        }
      )
      .addCase(fetchMovieDetail.rejected, (state, action) => {
        state.loadingDetail = false;
        state.errorDetail = action.payload as string;
      });
  },
});

export const { clearDetail } = moviesSlice.actions;
export default moviesSlice.reducer;

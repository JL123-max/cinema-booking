// src/components/MovieList.tsx
import { useEffect } from "react";
import { fetchMovies, fetchMovieDetail } from "../store/moviesSlice";
import { useAppDispatch, useAppSelector } from "../hooks/reduxHooks";
import type { Movie } from "../types/movie";

const MovieList = () => {
  const dispatch = useAppDispatch();
  const { list, loadingList, error } = useAppSelector((state) => state.movies);

  useEffect(() => {
    dispatch(fetchMovies());
  }, [dispatch]);

  const handleSelectMovie = (movie: Movie) => {
    dispatch(fetchMovieDetail(movie.maPhim));
  };

  if (loadingList) return <p>Loading movies...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Movie List</h2>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))",
          gap: "16px",
        }}
      >
        {list.map((movie) => (
          <div
            key={movie.maPhim}
            style={{
              border: "1px solid #ccc",
              borderRadius: "8px",
              padding: "8px",
              cursor: "pointer",
            }}
            onClick={() => handleSelectMovie(movie)}
          >
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              style={{ width: "100%", height: "250px", objectFit: "cover" }}
              onError={(e) => {
                (e.currentTarget as HTMLImageElement).src =
                  "https://via.placeholder.com/300x450?text=No+Image";
              }}
            />
            <h3 style={{ fontSize: "1rem", marginTop: "8px" }}>
              {movie.tenPhim}
            </h3>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieList;

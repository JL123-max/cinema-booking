import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovies } from "../api/movies";

const MovieListPage = () => {
  const { data: movies, isLoading, error } = useQuery({
    queryKey: ["movies"],
    queryFn: getMovies,
  });

  if (isLoading) return <div className="p-4">Loading movies...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error: {(error as Error).message}
      </div>
    );

  if (!movies || movies.length === 0)
    return <div className="p-4">No movies.</div>;

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Now Showing</h1>
      <div className="grid gap-4 grid-cols-2 md:grid-cols-4">
        {movies.map((movie) => (
          <Link
            key={movie.maPhim}
            to={`/movies/${movie.maPhim}`}
            className="border rounded overflow-hidden shadow hover:shadow-lg transition"
          >
            <img
              src={movie.hinhAnh}
              alt={movie.tenPhim}
              className="w-full h-60 object-cover"
            />
            <div className="p-2">
              <h2 className="font-semibold text-sm line-clamp-2">
                {movie.tenPhim}
              </h2>
              <p className="text-xs mt-1">Rating: {movie.danhGia}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MovieListPage;

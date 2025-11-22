import type { Movie } from "../features/movies/movieTypes";

interface MovieCardProps {
  movie: Movie;
}

const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  return (
    <div className="movie-card">
      <img
        src={movie.hinhAnh}
        alt={movie.tenPhim}
        className="movie-card__image"
      />
      <div className="movie-card__body">
        <h3 className="movie-card__title">{movie.tenPhim}</h3>
        <p className="movie-card__description">
          {movie.moTa?.slice(0, 120)}...
        </p>
      </div>
    </div>
  );
};

export default MovieCard;

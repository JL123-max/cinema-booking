// src/components/MovieDetail.tsx
import { useAppSelector } from "../hooks/reduxHooks";

const MovieDetail = () => {
  const { selectedMovie, loadingDetail } = useAppSelector(
    (state) => state.movies
  );

  if (loadingDetail) return <p>Loading detail...</p>;
  if (!selectedMovie)
    return <p>Select a movie from the list to see the details.</p>;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <h2>{selectedMovie.tenPhim}</h2>
      <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
        <img
          src={selectedMovie.hinhAnh}
          alt={selectedMovie.tenPhim}
          style={{ width: "250px", objectFit: "cover" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        <div>
          <p>
            <strong>Description:</strong> {selectedMovie.moTa}
          </p>
          <p>
            <strong>Release date:</strong>{" "}
            {new Date(selectedMovie.ngayKhoiChieu).toLocaleDateString()}
          </p>
          <p>
            <strong>Rating:</strong> {selectedMovie.danhGia}/10
          </p>
          <p>
            <strong>Trailer:</strong>{" "}
            <a href={selectedMovie.trailer} target="_blank" rel="noreferrer">
              Watch trailer
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

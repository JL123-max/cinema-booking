// src/components/MovieDetail.tsx

import { useAppSelector } from "../hooks";


const MovieDetail = () => {
  const { detail, loadingDetail } = useAppSelector(
    (state) => state.movies
  );

  if (loadingDetail) return <p>Loading detail...</p>;
  if (!detail)
    return <p>Select a movie from the list to see the details.</p>;

  return (
    <div
      style={{
        border: "1px solid #ddd",
        borderRadius: "8px",
        padding: "16px",
      }}
    >
      <h2>{detail.tenPhim}</h2>
      <div style={{ display: "flex", gap: "16px", marginTop: "12px" }}>
        <img
          src={detail.hinhAnh}
          alt={detail.tenPhim}
          style={{ width: "250px", objectFit: "cover" }}
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).src =
              "https://via.placeholder.com/300x450?text=No+Image";
          }}
        />
        <div>
          <p>
            <strong>Description:</strong> {detail.moTa}
          </p>
          <p>
            <strong>Release date:</strong>{" "}
            {new Date(detail.ngayKhoiChieu).toLocaleDateString()}
          </p>
          <p>
            <strong>Rating:</strong> {detail.danhGia}/10
          </p>
          <p>
            <strong>Trailer:</strong>{" "}
            <a href={detail.trailer} target="_blank" rel="noreferrer">
              Watch trailer
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default MovieDetail;

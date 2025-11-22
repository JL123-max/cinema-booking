import { Link, useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { getMovieDetail } from "../api/movies";

const MovieDetailPage = () => {
  const { movieId } = useParams<{ movieId: string }>();

  const {
    data: detail,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["movieDetail", movieId],
    queryFn: () => getMovieDetail(Number(movieId)),
    enabled: !!movieId,
  });

  if (isLoading) return <div className="p-4">Loading movie detail...</div>;
  if (error)
    return (
      <div className="p-4 text-red-500">
        Error: {(error as Error).message}
      </div>
    );
  if (!detail) return <div className="p-4">No detail available.</div>;

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <Link to="/" className="text-blue-500 mb-4 inline-block">
        ← Back to list
      </Link>

      <div className="flex flex-col md:flex-row gap-4">
        <img
          src={detail.hinhAnh}
          alt={detail.tenPhim}
          className="w-full md:w-1/3 object-cover rounded"
        />
        <div className="flex-1">
          <h1 className="text-2xl font-bold mb-2">{detail.tenPhim}</h1>
          <p className="text-sm text-gray-600 mb-2">
            Release: {new Date(detail.ngayKhoiChieu).toLocaleDateString()}
          </p>
          <p className="mb-4">{detail.moTa}</p>
          <p className="font-semibold mb-1">Rating: {detail.danhGia}</p>
          {detail.trailer && (
            <a
              href={detail.trailer}
              target="_blank"
              rel="noreferrer"
              className="text-blue-500 underline text-sm"
            >
              Watch trailer
            </a>
          )}
        </div>
      </div>

      {/* Showtimes + link to booking page */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">Showtimes</h2>
        {detail.heThongRapChieu.length === 0 && (
          <p>No schedules available.</p>
        )}

        {detail.heThongRapChieu.map((cinemaSystem) => (
          <div key={cinemaSystem.maHeThongRap} className="mb-4 border rounded p-3">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <img
                src={cinemaSystem.logo}
                alt={cinemaSystem.tenHeThongRap}
                className="w-8 h-8"
              />
              {cinemaSystem.tenHeThongRap}
            </h3>
            {cinemaSystem.cumRapChieu.map((cluster) => (
              <div key={cluster.maCumRap} className="mb-2">
                <p className="font-medium">{cluster.tenCumRap}</p>
                <p className="text-xs text-gray-600 mb-1">{cluster.diaChi}</p>
                <div className="flex flex-wrap gap-2">
                  {cluster.lichChieuPhim.map((show) => (
                    <Link
                      key={show.maLichChieu}
                      to={`/booking/${show.maLichChieu}`}
                      className="px-2 py-1 text-xs border rounded hover:bg-gray-100"
                    >
                      {new Date(show.ngayChieuGioChieu).toLocaleString()} –{" "}
                      {show.giaVe.toLocaleString("vi-VN")}đ
                    </Link>
                  ))}
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default MovieDetailPage;

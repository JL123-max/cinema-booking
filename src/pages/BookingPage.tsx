// src/pages/BookingPage.tsx
import { useState, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getSeatMap, bookTickets, type Seat } from "../api/movies";
import { USER_INFO_KEY } from "../api/client";


const BookingPage = () => {
    const userStr = typeof window !== "undefined" ? localStorage.getItem(USER_INFO_KEY) : null;
    const isLoggedIn = !!userStr;

    if (!isLoggedIn) {
        return (
            <div className="p-4">
                <p className="mb-2">You need to log in to book tickets.</p>
                <Link
                    to="/login"
                    className="text-blue-600 underline"
                >
                    Go to login
                </Link>
            </div>
        );
    }


    const { showtimeId } = useParams<{ showtimeId: string }>();
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    const maLichChieu = Number(showtimeId);

    const { data, isLoading, error } = useQuery({
        queryKey: ["seatMap", maLichChieu],
        queryFn: () => getSeatMap(maLichChieu),
        enabled: !!maLichChieu,
    });

    const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);

    const toggleSeat = (seat: Seat) => {
        if (seat.daDat) return; // cannot select booked seat
        setSelectedSeats((prev) => {
            const exists = prev.some((s) => s.maGhe === seat.maGhe);
            if (exists) {
                return prev.filter((s) => s.maGhe !== seat.maGhe);
            }
            return [...prev, seat];
        });
    };

    const totalPrice = useMemo(
        () => selectedSeats.reduce((sum, seat) => sum + seat.giaVe, 0),
        [selectedSeats]
    );

    const bookingMutation = useMutation({
        mutationFn: () =>
            bookTickets({
                maLichChieu,
                danhSachVe: selectedSeats.map((seat) => ({
                    maGhe: seat.maGhe,
                    giaVe: seat.giaVe,
                })),
            }),
        onSuccess: () => {
            // Refresh seat map to show new booked seats
            queryClient.invalidateQueries({ queryKey: ["seatMap", maLichChieu] });
            alert("Booking successful!");
            setSelectedSeats([]);
            navigate("/"); // or navigate to a confirmation page
        },
        onError: (err: any) => {
            alert(`Booking failed: ${err?.message || "Unknown error"}`);
        },
    });

    const handleBook = () => {
        if (selectedSeats.length === 0) {
            alert("Please select at least one seat.");
            return;
        }
        bookingMutation.mutate();
    };

    if (isLoading) return <div className="p-4">Loading seats...</div>;
    if (error)
        return (
            <div className="p-4 text-red-500">
                Error: {(error as Error).message}
            </div>
        );
    if (!data) return <div className="p-4">No seat data.</div>;

    const { thongTinPhim, danhSachGhe } = data;

    return (
        <div className="p-4 max-w-5xl mx-auto">
            <Link to={-1 as any} className="text-blue-500 mb-4 inline-block">
                ← Back
            </Link>

            {/* Movie & showtime info */}
            <div className="mb-4 border rounded p-3">
                <h1 className="text-xl font-bold mb-1">{thongTinPhim.tenPhim}</h1>
                <p className="text-sm text-gray-700">
                    {thongTinPhim.tenCumRap} – {thongTinPhim.tenRap}
                </p>
                <p className="text-sm text-gray-700">
                    {thongTinPhim.ngayChieu} {thongTinPhim.gioChieu}
                </p>
                <p className="text-xs text-gray-500">{thongTinPhim.diaChi}</p>
            </div>

            {/* Screen indicator */}
            <div className="mb-2 text-center text-xs text-gray-500">
                SCREEN
                <div className="h-1 bg-gray-400 mt-1 mb-4 mx-auto max-w-md"></div>
            </div>

            {/* Seats grid */}
            <div className="mb-4 grid grid-cols-10 gap-1 justify-items-center">
                {danhSachGhe.map((seat) => {
                    const isSelected = selectedSeats.some((s) => s.maGhe === seat.maGhe);
                    const isBooked = seat.daDat;

                    const baseClasses =
                        "w-8 h-8 text-xs flex items-center justify-center rounded cursor-pointer border";
                    const bookedClasses = "bg-gray-400 text-white cursor-not-allowed";
                    const selectedClasses = "bg-green-500 text-white";
                    const normalClasses = "bg-white hover:bg-blue-100";

                    return (
                        <button
                            key={seat.maGhe}
                            type="button"
                            className={[
                                baseClasses,
                                isBooked
                                    ? bookedClasses
                                    : isSelected
                                        ? selectedClasses
                                        : normalClasses,
                            ].join(" ")}
                            onClick={() => toggleSeat(seat)}
                            disabled={isBooked}
                            title={seat.loaiGhe}
                        >
                            {seat.tenGhe}
                        </button>
                    );
                })}
            </div>

            {/* Legend */}
            <div className="flex items-center gap-4 mb-4 text-xs">
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-white border" /> Available
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-green-500" /> Selected
                </div>
                <div className="flex items-center gap-1">
                    <div className="w-4 h-4 bg-gray-400" /> Booked
                </div>
            </div>

            {/* Summary & book button */}
            <div className="border rounded p-3 flex flex-col md:flex-row md:items-center md:justify-between gap-2">
                <div>
                    <p className="text-sm">
                        Selected seats:{" "}
                        {selectedSeats.length === 0
                            ? "None"
                            : selectedSeats.map((s) => s.tenGhe).join(", ")}
                    </p>
                    <p className="text-sm font-semibold">
                        Total: {totalPrice.toLocaleString("vi-VN")}đ
                    </p>
                </div>
                <button
                    type="button"
                    onClick={handleBook}
                    disabled={bookingMutation.isPending || selectedSeats.length === 0}
                    className="px-4 py-2 bg-blue-600 text-white rounded disabled:bg-gray-400"
                >
                    {bookingMutation.isPending ? "Booking..." : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
};

export default BookingPage;

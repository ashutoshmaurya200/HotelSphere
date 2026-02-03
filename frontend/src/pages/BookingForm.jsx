import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const BookingForm = () => {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [dates, setDates] = useState({
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
  });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await api.get(`/rooms/${roomId}`);
        setRoom(res.data);
        setLoading(false);
      } catch (err) {
        setError("Could not fetch room details.");
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const handleBooking = async (e) => {
    e.preventDefault();
    setError("");
    const userId = localStorage.getItem("userId");

    if (!userId) {
      alert("Please login to book a room.");
      navigate("/login");
      return;
    }

    try {
      const bookingData = {
        userId: userId,
        roomId: roomId,
        checkInDate: dates.checkIn,
        checkOutDate: dates.checkOut,
        //  This sends PENDING, but your Backend MUST accept it!
        bookingStatus: "PENDING",
      };

      await api.post("/bookings/create", bookingData);

      alert("Booking Initiated! Please go to 'My Bookings' to Pay.");
      navigate("/my-bookings");
    } catch (err) {
      console.error("Booking Error:", err);
      setError(err.response?.data?.message || "Booking failed.");
    }
  };

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="row justify-content-center">
          <div className="col-md-6">
            <div className="card shadow border-0">
              <div className="card-header bg-primary text-white">
                <h4 className="mb-0">Book Room {room?.roomNumber}</h4>
              </div>
              <div className="card-body p-4">
                <div className="mb-4">
                  <h5>{room?.roomType?.name}</h5>
                  <span className="badge bg-success fs-6">
                    ₹{room?.roomType?.basePricePerNight} / night
                  </span>
                </div>

                {error && <div className="alert alert-danger">{error}</div>}

                <form onSubmit={handleBooking}>
                  <div className="mb-3">
                    <label className="form-label fw-bold">Check-In Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dates.checkIn}
                      onChange={(e) =>
                        setDates({ ...dates, checkIn: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-3">
                    <label className="form-label fw-bold">Check-Out Date</label>
                    <input
                      type="date"
                      className="form-control"
                      value={dates.checkOut}
                      onChange={(e) =>
                        setDates({ ...dates, checkOut: e.target.value })
                      }
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="btn btn-primary w-100 py-2 fw-bold"
                  >
                    Confirm & Proceed to Pay
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default BookingForm;

import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios"; // or "../services/api"
import Navbar from "../components/Navbar";

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);

  useEffect(() => {
    api
      .get(`/rooms/${id}`)
      .then((res) => setRoom(res.data))
      .catch((err) => console.error(err));
  }, [id]);

  if (!room)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  const handleBookNow = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book a room");
      navigate("/login");
      return;
    }
    navigate(`/book/${room.roomId}`);
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <div className="card shadow-lg border-0 overflow-hidden">
          <div className="row g-0">
            {/* Left Side: Image */}
            <div className="col-md-6">
              <img
                src="https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800"
                className="img-fluid h-100"
                alt="Room"
                style={{ objectFit: "cover", minHeight: "400px" }}
              />
            </div>

            {/* Right Side: Details */}
            <div className="col-md-6 d-flex align-items-center">
              <div className="card-body p-5">
                <h6 className="text-primary text-uppercase fw-bold mb-2">
                  Luxury Stay
                </h6>
                <h2 className="card-title fw-bold mb-3">
                  {room.roomType?.name || `Room ${room.roomNumber}`}
                </h2>
                <p className="card-text text-muted mb-4">
                  {room.roomType?.description ||
                    "Enjoy a relaxing stay in this beautifully appointed room, featuring modern amenities and breathtaking views."}
                </p>

                <div className="row mb-4">
                  <div className="col-6">
                    <span className="fw-bold d-block">Price</span>
                    <span className="text-success h4">
                      ${room.roomType?.basePricePerNight || 150}
                    </span>{" "}
                    / night
                  </div>
                  <div className="col-6">
                    <span className="fw-bold d-block">Floor</span>
                    <span>{room.floor}th Floor</span>
                  </div>
                </div>

                <div className="d-grid">
                  <button
                    onClick={handleBookNow}
                    className="btn btn-primary btn-lg"
                    disabled={room.status !== "AVAILABLE"}
                  >
                    {room.status === "AVAILABLE"
                      ? "Book This Room Now"
                      : "Currently Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default RoomDetails;

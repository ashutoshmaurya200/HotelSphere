import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

// 1. New Image Mapping Object
const roomTypeImages = {
  "Single Standard":
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800",
  "Double Deluxe":
    "https://images.unsplash.com/photo-1590490360182-c33d57733427?q=80&w=800",
  "Twin Superior":
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800",
  "Hollywood Twin":
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800",
  "Double-Double Family":
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800",
  "Triple Guest Room":
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800",
  "Quad Group Room":
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?q=80&w=800",
  "Standard Room":
    "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?q=80&w=800",
  "Deluxe View Room":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800",
  "Studio Kitchenette":
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800",
  "Junior Suite":
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800",
  "Executive Suite":
    "https://images.unsplash.com/photo-1591088398332-8a7791972843?q=80&w=800",
  "Luxury Suite":
    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?q=80&w=800",
  "Presidential Suite":
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800",
  "Penthouse Suite":
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800",
  "Standard Twin":
    "https://images.unsplash.com/photo-1544124499-58912cbddaad?q=80&w=800",
  "Deluxe Studio":
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800",
};

// Fallback image if name doesn't match
const defaultImage =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800";

const Rooms = () => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  // 1. Fetch Rooms (Either All or Available)
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        const checkIn = searchParams.get("checkIn");
        const checkOut = searchParams.get("checkOut");
        const type = searchParams.get("type");

        let res;

        if (checkIn && checkOut) {
          console.log("Searching for available rooms...");
          res = await api.get(
            `/rooms/available?checkIn=${checkIn}&checkOut=${checkOut}&roomType=${type || ""}`,
          );
        } else {
          console.log("Fetching all rooms...");
          res = await api.get("/rooms");
        }

        setRooms(res.data);
      } catch (error) {
        console.error("Error fetching rooms:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [searchParams]);

  // 2. Handle "View Details" Click
  const handleBookNow = (roomId) => {
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    let targetUrl = `/book/${roomId}`;
    if (checkIn && checkOut) {
      targetUrl += `?checkIn=${checkIn}&checkOut=${checkOut}`;
    }
    navigate(targetUrl);
  };

  return (
    <>
      <Navbar />

      <div className="container mt-5">
        <div className="text-center mb-5">
          <h2 className="fw-bold">Our Accommodations</h2>
          <p className="text-muted">
            {searchParams.get("checkIn")
              ? `Showing available rooms from ${searchParams.get("checkIn")} to ${searchParams.get("checkOut")}`
              : "Select from our wide range of premium rooms"}
          </p>
        </div>

        {loading ? (
          <div className="text-center mt-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : rooms.length === 0 ? (
          <div className="text-center mt-5">
            <div className="alert alert-warning d-inline-block px-5">
              <h4>No rooms available.</h4>
              <p className="mb-0">Try changing your dates or room type.</p>
            </div>
          </div>
        ) : (
          <div className="row">
            {rooms.map((room) => (
              <div className="col-md-4 mb-4" key={room.roomId}>
                <div className="card shadow border-0 h-100 transition-hover">
                  {/* 🔥 3. USING THE NEW MAPPER HERE */}
                  <img
                    src={
                      room.roomType
                        ? roomTypeImages[room.roomType.name] || defaultImage
                        : defaultImage
                    }
                    className="card-img-top"
                    alt={room.roomType?.name || "Room"}
                    style={{ height: "250px", objectFit: "cover" }}
                  />

                  <div className="card-body d-flex flex-column">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h5 className="card-title fw-bold mb-0">
                        {room.roomType
                          ? room.roomType.name
                          : `Room ${room.roomNumber}`}
                      </h5>
                      <span className="badge bg-primary px-3 py-2">
                        ₹{room.roomType?.basePricePerNight || "0"} / night
                      </span>
                    </div>

                    <p className="text-muted small mb-2">
                      Room No: {room.roomNumber} • Floor: {room.floor}
                    </p>

                    <p className="card-text text-secondary">
                      {room.roomType?.description ||
                        "Experience luxury and comfort."}
                    </p>

                    <button
                      onClick={() => handleBookNow(room.roomId)}
                      className="btn btn-outline-primary w-100 mt-auto"
                    >
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default Rooms;

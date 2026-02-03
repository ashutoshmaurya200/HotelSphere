import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

// --- RELIABLE IMAGE MAPPING ---
const defaultImage =
  "https://images.unsplash.com/photo-1611892440504-42a792e24d32?q=80&w=800";

const roomTypeImages = {
  "Single Standard":
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800",
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

// --- SPECIFIC GALLERY MAPPING (Bathrooms/Views) ---
const roomGallery = {
  "Single Standard": [
    "https://images.unsplash.com/photo-1584621730504-78ec31c0e01d?q=80&w=800", // Bathroom
    "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800", // Interior
    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800", // Desk
  ],
  "Double Deluxe": [
    "https://images.unsplash.com/photo-1620626012053-1c1f85f6904d?q=80&w=800", // Bathroom
    "https://images.unsplash.com/photo-1582719508461-905c673771fd?q=80&w=800", // Seating
    "https://images.unsplash.com/photo-1512918760383-eda2723ad13e?q=80&w=800", // View
  ],
  "Standard Room": [
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800", // Bath
    "https://images.unsplash.com/photo-1551516594-56cb78394645?q=80&w=800", // Interior
    "https://images.unsplash.com/photo-1560185127-6ed189bf02f4?q=80&w=800", // Window
  ],
  "Deluxe View Room": [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800", // Balcony
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", // Interior
    "https://images.unsplash.com/photo-1620626012053-1c1f85f6904d?q=80&w=800", // Bath
  ],
  "Junior Suite": [
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?q=80&w=800", // Living
    "https://images.unsplash.com/photo-1543489822-c49534f3271f?q=80&w=800", // Bathtub
    "https://images.unsplash.com/photo-1497366216548-37526070297c?q=80&w=800", // Workspace
  ],
  "Executive Suite": [
    "https://images.unsplash.com/photo-1615873968403-89e068629265?q=80&w=800", // Living
    "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?q=80&w=800", // Bath
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800", // Bed
  ],
  "Luxury Suite": [
    "https://images.unsplash.com/photo-1533759413974-9e15f3b745ac?q=80&w=800", // Jacuzzi
    "https://images.unsplash.com/photo-1616594039964-40891a909d99?q=80&w=800", // Dining
    "https://images.unsplash.com/photo-1444201983204-c43cbd584d93?q=80&w=800", // Ocean
  ],
  "Presidential Suite": [
    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?q=80&w=800", // Grand
    "https://images.unsplash.com/photo-1584621730504-78ec31c0e01d?q=80&w=800", // Master Bath
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?q=80&w=800", // Hall
  ],
  "Studio Kitchenette": [
    "https://images.unsplash.com/photo-1556910103-1c02745a30bf?q=80&w=800", // Kitchen
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?q=80&w=800", // Dining
    "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?q=80&w=800", // Room
  ],
  "Double-Double Family": [
    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?q=80&w=800", // Kids
    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?q=80&w=800", // Beds
    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?q=80&w=800", // Space
  ],
};

const defaultGallery = [
  "https://images.unsplash.com/photo-1584621730504-78ec31c0e01d?q=80&w=800",
  "https://images.unsplash.com/photo-1554995207-c18c203602cb?q=80&w=800",
  "https://images.unsplash.com/photo-1618773928121-c32242e63f39?q=80&w=800",
];

const RoomDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [room, setRoom] = useState(null);

  const [displayImage, setDisplayImage] = useState(defaultImage);

  useEffect(() => {
    api
      .get(`/rooms/${id}`)
      .then((res) => {
        setRoom(res.data);
        const initialImg = res.data.roomType
          ? roomTypeImages[res.data.roomType.name] || defaultImage
          : defaultImage;
        setDisplayImage(initialImg);
      })
      .catch((err) => console.error(err));
  }, [id]);

  const getAmenities = (roomType) => {
    const base = [
      "🚀 Free Wi-Fi",
      "❄️ Air Conditioning",
      "📺 HD TV",
      "🧹 Daily Housekeeping",
    ];
    const type = roomType?.toLowerCase() || "";
    if (type.includes("suite") || type.includes("presidential"))
      return [
        ...base,
        "🛋️ Living Area",
        "🍾 Champagne Service",
        "🛁 Bathtub",
        "🌊 View",
      ];
    if (
      type.includes("double") ||
      type.includes("deluxe") ||
      type.includes("studio")
    )
      return [
        ...base,
        "🥂 Mini Bar",
        "☕ Coffee Maker",
        "🛏️ Queen Bed",
        "🍳 Kitchenette",
      ];
    return [...base, "💻 Work Desk", "🛏️ Comfortable Bed", "🚿 Hot Shower"];
  };

  const handleProceedToBook = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      alert("Please login to book a room");
      navigate("/login");
      return;
    }
    const checkIn = searchParams.get("checkIn");
    const checkOut = searchParams.get("checkOut");
    let target = `/book/${room.roomId}`;
    if (checkIn && checkOut)
      target += `?checkIn=${checkIn}&checkOut=${checkOut}`;
    navigate(target);
  };

  // 🔥 ERROR HANDLER: If any image fails, swap it for the default
  const handleImageError = (e) => {
    e.target.src = defaultImage;
  };

  if (!room)
    return (
      <div className="text-center mt-5">
        <div className="spinner-border text-primary"></div>
      </div>
    );

  const amenities = getAmenities(room.roomType?.name);

  // Safe Gallery Access
  const gallery = room.roomType
    ? roomGallery[room.roomType.name] || defaultGallery
    : defaultGallery;

  const mainImage = room.roomType
    ? roomTypeImages[room.roomType.name] || defaultImage
    : defaultImage;

  return (
    <>
      <Navbar />
      <div className="container mt-5 mb-5">
        <div className="card shadow-lg border-0 overflow-hidden">
          <div className="row g-0">
            {/* LEFT SIDE: IMAGE GALLERY */}
            <div className="col-md-7 bg-light">
              {/* Large Display Image */}
              <div
                style={{
                  height: "450px",
                  overflow: "hidden",
                  position: "relative",
                }}
              >
                <img
                  src={displayImage}
                  onError={handleImageError} // 🔥 Fixes broken main image
                  className="img-fluid w-100 h-100"
                  alt="Main Room"
                  style={{ objectFit: "cover", transition: "0.3s" }}
                />
              </div>

              {/* Thumbnails Row */}
              <div className="d-flex p-3 gap-2 justify-content-center bg-white border-top flex-wrap">
                {/* 1. Main Cover Image */}
                <img
                  src={mainImage}
                  onError={handleImageError} // 🔥 Fixes broken thumbnail
                  className="img-thumbnail shadow-sm"
                  style={{
                    width: "90px",
                    height: "70px",
                    objectFit: "cover",
                    cursor: "pointer",
                    border:
                      displayImage === mainImage
                        ? "3px solid #0d6efd"
                        : "1px solid #ddd",
                    opacity: displayImage === mainImage ? 1 : 0.7,
                  }}
                  onClick={() => setDisplayImage(mainImage)}
                  alt="Main View"
                />

                {/* 2. Extra Gallery Images */}
                {gallery.map((imgUrl, index) => (
                  <img
                    key={index}
                    src={imgUrl}
                    onError={handleImageError} // 🔥 Fixes broken gallery item
                    className="img-thumbnail shadow-sm"
                    style={{
                      width: "90px",
                      height: "70px",
                      objectFit: "cover",
                      cursor: "pointer",
                      border:
                        displayImage === imgUrl
                          ? "3px solid #0d6efd"
                          : "1px solid #ddd",
                      opacity: displayImage === imgUrl ? 1 : 0.7,
                    }}
                    onClick={() => setDisplayImage(imgUrl)}
                    alt={`Detail ${index}`}
                  />
                ))}
              </div>
            </div>

            {/* RIGHT SIDE: DETAILS */}
            <div className="col-md-5">
              <div className="card-body p-4 p-lg-5">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h6 className="text-primary text-uppercase fw-bold mb-0">
                    {room.roomType?.name?.includes("Suite")
                      ? "Premium Suite"
                      : "Luxury Stay"}
                  </h6>
                  <span className="badge bg-success fs-5">
                    ₹{room.roomType?.basePricePerNight} / night
                  </span>
                </div>

                <h2 className="card-title fw-bold mb-3">
                  {room.roomType?.name || `Room ${room.roomNumber}`}
                </h2>

                <p className="card-text text-muted mb-4">
                  {room.roomType?.description ||
                    "Experience comfort and elegance in our carefully designed rooms, featuring modern amenities and breathtaking views."}
                </p>

                <div className="row mb-4">
                  <div className="col-6">
                    <span className="fw-bold d-block text-dark">Floor</span>
                    <span className="text-muted">{room.floor}th Floor</span>
                  </div>
                  <div className="col-6">
                    <span className="fw-bold d-block text-dark">Capacity</span>
                    <span className="text-muted">2 Adults, 1 Child</span>
                  </div>
                </div>

                <hr className="my-4" />

                <h5 className="fw-bold mb-3">✨ Amenities & Services</h5>
                <div className="row mb-4">
                  {amenities.map((item, index) => (
                    <div className="col-6 mb-2" key={index}>
                      <small className="text-secondary d-flex align-items-center">
                        <i className="bi bi-check-circle-fill text-primary me-2"></i>
                        {item}
                      </small>
                    </div>
                  ))}
                </div>

                <div className="d-grid gap-2">
                  <button
                    onClick={handleProceedToBook}
                    className="btn btn-primary btn-lg fw-bold shadow-sm"
                    disabled={room.status !== "AVAILABLE"}
                  >
                    {room.status === "AVAILABLE"
                      ? "📅 Proceed to Book"
                      : "🚫 Currently Unavailable"}
                  </button>
                  <button
                    onClick={() => navigate(-1)}
                    className="btn btn-outline-secondary"
                  >
                    ← Back to Rooms
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

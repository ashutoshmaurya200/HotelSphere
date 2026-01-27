import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // Helper to assign images based on room type
  const getImage = (type) => {
    if (type?.toLowerCase().includes("suite"))
      return "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?w=500&auto=format&fit=crop";
    if (type?.toLowerCase().includes("deluxe"))
      return "https://images.unsplash.com/photo-1611892440504-42a792e24d32?w=500&auto=format&fit=crop";
    return "https://images.unsplash.com/photo-1590490360182-c33d57733427?w=500&auto=format&fit=crop";
  };

  return (
    <div className="col-md-4 mb-4">
      <div className="card h-100 shadow-sm border-0">
        <img
          src={getImage(room.roomType?.name)}
          className="card-img-top"
          alt="Room"
          style={{ height: "200px", objectFit: "cover" }}
        />
        <div className="card-body">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="card-title mb-0">
              {room.roomType?.name || "Standard Room"}
            </h5>
            <span className="badge bg-primary">
              ${room.roomType?.basePricePerNight || 100} / night
            </span>
          </div>

          <p className="text-muted small mb-1">
            Room No: {room.roomNumber} • Floor: {room.floor}
          </p>
          <p className="card-text text-truncate">
            {room.roomType?.description || "Experience luxury and comfort."}
          </p>

          <div className="d-grid">
            <button
              className="btn btn-outline-primary"
              onClick={() => navigate(`/rooms/${room.roomId}`)}
            >
              View Details
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;

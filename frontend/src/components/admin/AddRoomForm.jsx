import React, { useState } from "react";
import api from "../../api/axios";

const AddRoomForm = ({ roomTypes, onSuccess }) => {
  const [newRoom, setNewRoom] = useState({
    roomNumber: "",
    floor: "",
    roomTypeId: "",
    status: "AVAILABLE",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/rooms", newRoom);
      alert("Room Added!");
      setNewRoom({
        roomNumber: "",
        floor: "",
        roomTypeId: "",
        status: "AVAILABLE",
      });
      onSuccess(); // Tell parent to refresh data
    } catch (error) {
      alert("Failed to add room.");
    }
  };

  return (
    <div className="card shadow-sm border-0" style={{ maxWidth: "500px" }}>
      <div className="card-body">
        <h5 className="mb-3">Add Physical Room</h5>
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Number</label>
            <input
              type="text"
              className="form-control"
              value={newRoom.roomNumber}
              onChange={(e) =>
                setNewRoom({ ...newRoom, roomNumber: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Floor</label>
            <input
              type="text"
              className="form-control"
              value={newRoom.floor}
              onChange={(e) =>
                setNewRoom({ ...newRoom, floor: e.target.value })
              }
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Type</label>
            <select
              className="form-select"
              value={newRoom.roomTypeId}
              onChange={(e) =>
                setNewRoom({ ...newRoom, roomTypeId: e.target.value })
              }
              required
            >
              <option value="">-- Select --</option>
              {roomTypes.map((t) => (
                <option key={t.roomTypeId} value={t.roomTypeId}>
                  {t.name} - ₹{t.basePricePerNight}
                </option>
              ))}
            </select>
          </div>
          <button type="submit" className="btn btn-success w-100">
            Add Room
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddRoomForm;

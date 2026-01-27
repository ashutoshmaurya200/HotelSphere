import React, { useState } from "react";
import api from "../../api/axios";

const AddTypeForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    name: "",
    basePricePerNight: "",
    maxOccupancy: "",
    description: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("/room-types", formData);
      alert("Room Type Added Successfully!");
      setFormData({
        name: "",
        basePricePerNight: "",
        maxOccupancy: "",
        description: "",
      });
      onSuccess(); // Refresh the list
    } catch (error) {
      console.error("Error adding room type", error);
    }
  };

  return (
    <div className="card shadow-sm p-4">
      <h4 className="mb-4">Create New Room Type</h4>
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input
            type="text"
            className="form-control"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
        </div>

        <div className="row">
          <div className="col-md-6 mb-3">
            <label className="form-label">Price (₹)</label>
            <input
              type="number"
              className="form-control"
              value={formData.basePricePerNight}
              onChange={(e) =>
                setFormData({ ...formData, basePricePerNight: e.target.value })
              }
              required
            />
          </div>
          <div className="col-md-6 mb-3">
            <label className="form-label">Max Occupancy</label>
            <input
              type="number"
              className="form-control"
              value={formData.maxOccupancy}
              onChange={(e) =>
                setFormData({ ...formData, maxOccupancy: e.target.value })
              }
              required
            />
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Description</label>
          <textarea
            className="form-control"
            rows="3"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
            placeholder="e.g. King size bed, Sea view, Free Wi-Fi..."
          ></textarea>
        </div>

        <button type="submit" className="btn btn-primary w-100">
          Save Room Type
        </button>
      </form>
    </div>
  );
};

export default AddTypeForm;

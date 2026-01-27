import React, { useState, useEffect } from "react";
import api from "../api/axios";

const AddServiceModal = ({ bookingId, onClose, onSuccess }) => {
  const [availableServices, setAvailableServices] = useState([]);
  const [selectedServiceId, setSelectedServiceId] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [currentPrice, setCurrentPrice] = useState(0);
  const [loading, setLoading] = useState(true);

  // 1. Fetch Services from DB
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const res = await api.get("/services");
        setAvailableServices(res.data);

        if (res.data && res.data.length > 0) {
          const first = res.data[0];
          setSelectedServiceId(first.serviceId || first.id);
          setCurrentPrice(first.price);
        }
        setLoading(false);
      } catch (error) {
        console.error("Error fetching services:", error);
        setLoading(false);
      }
    };
    fetchServices();
  }, []);

  // 2. Handle Selection
  const handleServiceChange = (e) => {
    const newId = e.target.value;
    setSelectedServiceId(newId);

    const service = availableServices.find(
      (s) => (s.serviceId || s.id).toString() === newId.toString(),
    );

    if (service) {
      setCurrentPrice(service.price);
    }
  };

  // 3. Submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Send as Query Params to match Java Backend
      await api.post("/services/add-to-booking", null, {
        params: {
          bookingId: bookingId,
          serviceId: selectedServiceId,
          quantity: quantity,
        },
      });
      onSuccess();
    } catch (error) {
      alert("Failed to add service. Check Backend.");
    }
  };

  return (
    <div
      className="modal show d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header">
            <h5 className="modal-title">Order Room Service</h5>
            <button
              type="button"
              className="btn-close"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            {loading ? (
              <p className="text-center">Loading Menu...</p>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="mb-3">
                  <label className="form-label">Select Service</label>
                  <select
                    className="form-select"
                    value={selectedServiceId}
                    onChange={handleServiceChange}
                  >
                    {availableServices.map((s) => (
                      <option
                        key={s.serviceId || s.id}
                        value={s.serviceId || s.id}
                      >
                        {s.name} - ₹{s.price}
                      </option>
                    ))}
                  </select>
                </div>

                <div className="mb-3">
                  <label className="form-label">Quantity</label>
                  <input
                    type="number"
                    className="form-control"
                    min="1"
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label fw-bold">Total Cost</label>
                  <input
                    type="text"
                    className="form-control bg-light"
                    value={`₹ ${currentPrice * quantity}`}
                    disabled
                  />
                </div>

                <div className="d-flex justify-content-end gap-2">
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={onClose}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary">
                    Place Order
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddServiceModal;

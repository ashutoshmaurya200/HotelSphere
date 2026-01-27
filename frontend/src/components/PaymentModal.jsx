import React, { useState } from "react";
import api from "../api/axios";

const PaymentModal = ({ booking, onClose, onSuccess }) => {
  const [method, setMethod] = useState("Credit Card");
  const [processing, setProcessing] = useState(false);

  const handlePayment = async (e) => {
    e.preventDefault();
    setProcessing(true);

    try {
      // 1. Simulate Network Delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      // 2. Call Backend API
      await api.post("/payments/pay", {
        bookingId: booking.bookingId,
        amount: booking.totalAmount,
        paymentMethod: method,
      });

      alert("Payment Successful! 💳");
      onSuccess(); // Refresh parent list
      onClose(); // Close modal
    } catch (error) {
      console.error(error);
      alert("Payment Failed. Try again.");
      setProcessing(false);
    }
  };

  return (
    <div
      className="modal d-block"
      style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
    >
      <div className="modal-dialog">
        <div className="modal-content">
          <div className="modal-header bg-success text-white">
            <h5 className="modal-title">Secure Payment</h5>
            <button
              type="button"
              className="btn-close btn-close-white"
              onClick={onClose}
            ></button>
          </div>
          <div className="modal-body">
            <div className="alert alert-info d-flex justify-content-between">
              <span>Total Amount:</span>
              <strong>₹{booking?.totalAmount}</strong>
            </div>

            <form onSubmit={handlePayment}>
              {/* Payment Method Selector */}
              <div className="mb-3">
                <label className="form-label">Payment Method</label>
                <select
                  className="form-select"
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                >
                  <option value="Credit Card">Credit / Debit Card</option>
                  <option value="UPI">UPI / GPay / PhonePe</option>
                  <option value="Net Banking">Net Banking</option>
                </select>
              </div>

              {/* Fake Inputs based on Method */}
              {method === "Credit Card" && (
                <>
                  <div className="mb-3">
                    <label className="form-label">Card Number</label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="XXXX-XXXX-XXXX-XXXX"
                      required
                    />
                  </div>
                  <div className="row">
                    <div className="col">
                      <input
                        type="text"
                        className="form-control"
                        placeholder="MM/YY"
                        required
                      />
                    </div>
                    <div className="col">
                      <input
                        type="password"
                        className="form-control"
                        placeholder="CVV"
                        required
                      />
                    </div>
                  </div>
                </>
              )}

              {method === "UPI" && (
                <div className="mb-3">
                  <label className="form-label">UPI ID</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="username@oksbi"
                    required
                  />
                </div>
              )}

              <hr />

              <button
                type="submit"
                className="btn btn-success w-100 py-2 fw-bold"
                disabled={processing}
              >
                {processing ? "Processing..." : `Pay ₹${booking?.totalAmount}`}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;

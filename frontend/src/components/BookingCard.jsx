import React from "react";

const BookingCard = ({ booking, onPay, onOrderService, onCancel, onPrint }) => {
  // 1. Logic: Calculate Financials inside the card
  const total = booking.totalAmount || 0;
  const paid = booking.amountPaid || 0;
  const balance = total - paid;
  const isFullyPaid = balance <= 0;

  // 2. Logic: Determine Status Badge Color
  const getBadgeClass = () => {
    if (booking.bookingStatus === "CANCELLED") return "bg-danger";
    if (isFullyPaid) return "bg-success";
    return "bg-warning text-dark"; // Partial or Pending
  };

  const getStatusText = () => {
    if (booking.bookingStatus === "CANCELLED") return "CANCELLED";
    if (isFullyPaid) return "FULLY PAID";
    return "BALANCE DUE";
  };

  return (
    <div className="col-md-6 mb-4">
      <div className="card shadow-sm h-100">
        {/* Header */}
        <div className="card-header d-flex justify-content-between align-items-center">
          <h5 className="mb-0">Room {booking.room?.roomNumber}</h5>
          <span className={`badge ${getBadgeClass()}`}>{getStatusText()}</span>
        </div>

        {/* Body */}
        <div className="card-body">
          <p className="mb-1">
            <strong>Check-In:</strong> {booking.checkInDate}
          </p>
          <p className="mb-3">
            <strong>Check-Out:</strong> {booking.checkOutDate}
          </p>

          {/* Financial Summary Box */}
          <div className="bg-light p-3 rounded mb-3">
            <div className="d-flex justify-content-between">
              <span>Total Cost:</span>
              <strong>₹{total}</strong>
            </div>
            <div className="d-flex justify-content-between text-success">
              <span>Amount Paid:</span>
              <strong>- ₹{paid}</strong>
            </div>
            <hr className="my-2" />
            <div className="d-flex justify-content-between text-danger fw-bold">
              <span>Due Balance:</span>
              <span>₹{balance > 0 ? balance : 0}</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="d-grid gap-2">
            {booking.bookingStatus !== "CANCELLED" && (
              <>
                {/* Order Service */}
                <button
                  className="btn btn-warning fw-bold"
                  onClick={() => onOrderService(booking.bookingId)}
                >
                  🍔 Order Food / Services
                </button>

                {/* Pay OR Print Logic */}
                {balance > 0 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => onPay(booking, balance)}
                  >
                    💳 Pay Balance (₹{balance})
                  </button>
                ) : (
                  <button
                    className="btn btn-secondary"
                    onClick={() => onPrint(booking)}
                  >
                    🖨️ Print Invoice
                  </button>
                )}

                {/* Cancel */}
                <button
                  className="btn btn-outline-danger mt-1"
                  onClick={() => onCancel(booking.bookingId)}
                >
                  Cancel Booking
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingCard;

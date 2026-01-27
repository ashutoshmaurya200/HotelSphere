import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import AddServiceModal from "../components/AddServiceModal";

// Helper to load Razorpay Script
const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  const fetchMyBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await api.get(`/bookings/user/${userId}`);
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel?")) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      alert("Booking Cancelled");
      fetchMyBookings();
    } catch (error) {
      console.error(error);
      alert("Failed to cancel");
    }
  };

  const handlePayClick = async (booking) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) return alert("Razorpay SDK failed to load.");

    try {
      // Use totalAmount if available (includes services), else base price
      const amountToPay =
        booking.totalAmount || booking.room.roomType.basePricePerNight;

      const orderRes = await api.post("/payments/create-order", {
        amount: amountToPay,
      });

      const options = {
        key: "rzp_test_BLuYvjyR58WQhz", // Replace with your Key
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "HotelSphere",
        description: `Payment for Room ${booking.room.roomNumber}`,
        order_id: orderRes.data.id,

        handler: async (response) => {
          try {
            await api.post("/payments/pay", {
              bookingId: booking.bookingId,
              amount: amountToPay,
              paymentMethod: "RAZORPAY",
              transactionId: response.razorpay_payment_id,
            });
            alert("Payment Successful!");
            fetchMyBookings();
          } catch (err) {
            console.error("Verification Error:", err);
            alert("Payment succeeded but backend verification failed.");
          }
        },
        theme: { color: "#3399cc" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment Init Error:", error);
      alert("Payment initiation failed.");
    }
  };

  const handleOrderService = (bookingId) => {
    setSelectedBookingId(bookingId);
    setShowServiceModal(true);
  };

  const getStatusBadge = (status) => {
    if (status === "CONFIRMED") return "bg-success";
    if (status === "PENDING") return "bg-warning text-dark";
    if (status === "CANCELLED") return "bg-danger";
    return "bg-secondary";
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4">My Bookings</h2>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="row">
            {bookings.map((b) => (
              <div className="col-md-6 mb-4" key={b.bookingId}>
                <div className="card shadow-sm">
                  <div className="card-header d-flex justify-content-between align-items-center">
                    <h5 className="mb-0">Room {b.room?.roomNumber}</h5>
                    <span
                      className={`badge ${getStatusBadge(b.bookingStatus)}`}
                    >
                      {b.bookingStatus}
                    </span>
                  </div>
                  <div className="card-body">
                    <p>
                      <strong>Check-In:</strong> {b.checkInDate}
                    </p>
                    <p>
                      <strong>Check-Out:</strong> {b.checkOutDate}
                    </p>

                    {/* Display Total Amount */}
                    <h4 className="mt-2 text-primary">
                      Total: ₹
                      {b.totalAmount || b.room?.roomType?.basePricePerNight}
                    </h4>

                    <div className="d-grid gap-2 mt-3">
                      {/* 🔥 1. ORDER SERVICES (Always visible unless cancelled) */}
                      {b.bookingStatus !== "CANCELLED" && (
                        <button
                          className="btn btn-warning fw-bold"
                          onClick={() => handleOrderService(b.bookingId)}
                        >
                          🍔 Order Food / Services
                        </button>
                      )}

                      {/* 🔥 2. PAY NOW (Visible for PENDING *AND* CONFIRMED) */}
                      {(b.bookingStatus === "PENDING" ||
                        b.bookingStatus === "CONFIRMED") && (
                        <div className="d-flex gap-2">
                          <button
                            className="btn btn-primary flex-grow-1"
                            onClick={() => handlePayClick(b)}
                          >
                            {b.bookingStatus === "PENDING"
                              ? "Pay Now"
                              : "Pay Bill / Extra"}
                          </button>
                        </div>
                      )}

                      {/* 3. CANCEL BOOKING */}
                      {b.bookingStatus !== "CANCELLED" && (
                        <button
                          className="btn btn-outline-danger mt-2"
                          onClick={() => handleCancel(b.bookingId)}
                        >
                          Cancel Booking
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* SERVICE MODAL */}
        {showServiceModal && (
          <AddServiceModal
            bookingId={selectedBookingId}
            onClose={() => setShowServiceModal(false)}
            onSuccess={() => {
              alert("Service Added! Total Updated.");
              setShowServiceModal(false);
              fetchMyBookings(); // Refresh to see new Total
            }}
          />
        )}
      </div>
    </>
  );
};

export default MyBookings;

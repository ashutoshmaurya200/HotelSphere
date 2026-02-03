import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from "react-to-print";
import api from "../api/axios";
import Navbar from "../components/Navbar";
import AddServiceModal from "../components/AddServiceModal";
import BookingCard from "../components/BookingCard";

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

  const [showServiceModal, setShowServiceModal] = useState(false);
  const [selectedBookingId, setSelectedBookingId] = useState(null);

  // Print State
  const [printBooking, setPrintBooking] = useState(null);
  const printRef = useRef(null); // Initialize as null

  const handlePrint = useReactToPrint({
    contentRef: printRef, // Use contentRef instead of content
    documentTitle: `Invoice-${printBooking?.bookingId}`,
    onAfterPrint: () => setPrintBooking(null),
  });

  // Trigger print only when printBooking is set and DOM is ready
  useEffect(() => {
    if (printBooking) {
      handlePrint();
    }
  }, [printBooking, handlePrint]);

  const fetchMyBookings = async () => {
    try {
      const userId = localStorage.getItem("userId");
      const res = await api.get(`/bookings/user/${userId}`);
      setBookings(res.data);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handlePayClick = async (booking, amountToPay) => {
    const isLoaded = await loadRazorpayScript();
    if (!isLoaded) return alert("Razorpay SDK failed to load.");

    try {
      const orderRes = await api.post("/payments/create-order", {
        amount: amountToPay,
      });

      const options = {
        key: "rzp_test_BLuYvjyR58WQhz",
        amount: orderRes.data.amount,
        currency: orderRes.data.currency,
        name: "HotelSphere",
        description: `Payment for Booking #${booking.bookingId}`,
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
            alert("Payment verification failed.");
          }
        },
        theme: { color: "#3399cc" },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      alert("Payment initiation failed.");
    }
  };

  const handleCancel = async (bookingId) => {
    if (!window.confirm("Cancel this booking?")) return;
    try {
      await api.delete(`/bookings/${bookingId}`);
      alert("Booking Cancelled");
      fetchMyBookings();
    } catch (error) {
      alert("Failed to cancel");
    }
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
            {bookings.map((booking) => (
              <BookingCard
                key={booking.bookingId}
                booking={booking}
                onPay={handlePayClick}
                onOrderService={(id) => {
                  setSelectedBookingId(id);
                  setShowServiceModal(true);
                }}
                onCancel={handleCancel}
                onPrint={(b) => setPrintBooking(b)}
              />
            ))}
          </div>
        )}

        {showServiceModal && (
          <AddServiceModal
            bookingId={selectedBookingId}
            onClose={() => setShowServiceModal(false)}
            onSuccess={() => {
              alert("Service Added!");
              setShowServiceModal(false);
              fetchMyBookings();
            }}
          />
        )}

        <div
          style={{ position: "absolute", top: "-10000px", left: "-10000px" }}
        >
          <div
            ref={printRef}
            className="p-5"
            style={{ width: "100%", minWidth: "800px" }}
          >
            {printBooking && (
              <div className="container border p-5">
                <div className="text-center mb-4">
                  <h2 className="fw-bold text-primary">HotelSphere</h2>
                  <p className="text-muted">
                    123 Luxury Lane, Paradise City, Pune
                  </p>
                  <hr />
                </div>

                <h3 className="mb-4 text-center">OFFICIAL INVOICE</h3>

                <div className="row mb-4">
                  <div className="col-6">
                    <h5 className="fw-bold">Billed To:</h5>
                    <p className="mb-1">{printBooking.user?.fullName}</p>
                    <p className="mb-1">{printBooking.user?.email}</p>
                    <p className="mb-1">
                      <strong>Booking ID:</strong> #{printBooking.bookingId}
                    </p>
                  </div>
                  <div className="col-6 text-end">
                    <h5 className="fw-bold">Stay Details:</h5>
                    <p className="mb-1">
                      <strong>Room:</strong> {printBooking.room?.roomNumber} (
                      {printBooking.room?.roomType?.name})
                    </p>
                    <p className="mb-1">
                      <strong>Check-In:</strong> {printBooking.checkInDate}
                    </p>
                    <p className="mb-1">
                      <strong>Check-Out:</strong> {printBooking.checkOutDate}
                    </p>
                  </div>
                </div>

                <table className="table table-bordered mt-4">
                  <thead className="table-light">
                    <tr>
                      <th>Description</th>
                      <th className="text-end">Amount</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>Room Charges</td>
                      <td className="text-end">Included</td>
                    </tr>

                    <tr className="fw-bold border-top">
                      <td>TOTAL AMOUNT</td>
                      <td className="text-end">₹{printBooking.totalAmount}</td>
                    </tr>
                    <tr className="text-success fw-bold">
                      <td>PAID AMOUNT</td>
                      <td className="text-end">₹{printBooking.amountPaid}</td>
                    </tr>
                    <tr className="text-danger fw-bold">
                      <td>BALANCE DUE</td>
                      <td className="text-end">
                        ₹{printBooking.totalAmount - printBooking.amountPaid}
                      </td>
                    </tr>
                  </tbody>
                </table>

                <div className="text-center mt-5 pt-4">
                  <p className="text-muted small">
                    Thank you for choosing HotelSphere!
                  </p>
                  <p className="text-muted small">
                    This is a computer-generated invoice and requires no
                    signature.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyBookings;

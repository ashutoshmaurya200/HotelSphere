import React from "react";

const AdminBookings = ({ bookings }) => {
  const getStatusBadge = (status) => {
    switch (status) {
      case "CONFIRMED":
        return "bg-success";
      case "PAID":
        return "bg-primary";
      case "CANCELLED":
        return "bg-danger";
      default:
        return "bg-secondary";
    }
  };

  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="mb-3">All Bookings</h5>
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>ID</th>
              <th>User</th>
              <th>Room</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((b) => (
              <tr key={b.bookingId}>
                <td>#{b.bookingId}</td>
                <td>{b.user?.fullName}</td>
                <td>{b.room?.roomNumber}</td>
                <td>
                  <span className={`badge ${getStatusBadge(b.bookingStatus)}`}>
                    {b.bookingStatus}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminBookings;

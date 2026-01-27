import React from "react";

const AdminRoomList = ({ rooms, onDelete }) => {
  return (
    <div className="card shadow-sm border-0">
      <div className="card-body">
        <h5 className="mb-3">Manage Rooms</h5>
        <table className="table table-hover align-middle">
          <thead className="table-dark">
            <tr>
              <th>Room No</th>
              <th>Type</th>
              <th>Price</th>
              <th>Floor</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {rooms.map((r) => (
              <tr key={r.roomId}>
                <td className="fw-bold">{r.roomNumber}</td>
                <td>{r.roomType?.name}</td>
                <td>₹{r.roomType?.basePricePerNight}</td>
                <td>{r.floor}</td>
                <td>
                  <button
                    onClick={() => onDelete(r.roomId)}
                    className="btn btn-danger btn-sm"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoomList;

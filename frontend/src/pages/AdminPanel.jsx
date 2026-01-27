import React, { useEffect, useState } from "react";
import api from "../api/axios";
import Navbar from "../components/Navbar";

// Import your existing components
import AdminBookings from "../components/admin/AdminBookings";
import AdminRoomList from "../components/admin/AdminRoomList";
import AddRoomForm from "../components/admin/AddRoomForm";
import AddTypeForm from "../components/admin/AddTypeForm";

const AdminPanel = () => {
  // 🔥 Default to 'dashboard' tab now
  const [activeTab, setActiveTab] = useState("dashboard");

  // Data States
  const [stats, setStats] = useState({
    totalBookings: 0,
    totalRevenue: 0,
    activeBookings: 0,
    availableRooms: 0,
  });
  const [bookings, setBookings] = useState([]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  // 1. Fetch All Data
  const fetchData = async () => {
    try {
      const [statsRes, bookingRes, typeRes, roomRes] = await Promise.all([
        api.get("/dashboard/stats"), // 🔥 New API Call
        api.get("/bookings/all"),
        api.get("/room-types"),
        api.get("/rooms"),
      ]);

      setStats(statsRes.data);
      setBookings(bookingRes.data);
      setRoomTypes(typeRes.data);
      setRooms(roomRes.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Delete Handler
  const handleDeleteRoom = async (roomId) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      await api.delete(`/rooms/${roomId}`);
      fetchData();
    } catch (error) {
      alert("Could not delete room.");
    }
  };

  return (
    <>
      <Navbar />
      <div className="container mt-5">
        <h2 className="mb-4 fw-bold">Admin Dashboard</h2>

        {/* TABS Navigation */}
        <ul className="nav nav-tabs mb-4">
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "dashboard" ? "active fw-bold" : ""}`}
              onClick={() => setActiveTab("dashboard")}
            >
              📊 Overview
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "bookings" ? "active" : ""}`}
              onClick={() => setActiveTab("bookings")}
            >
              All Bookings
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "rooms" ? "active" : ""}`}
              onClick={() => setActiveTab("rooms")}
            >
              Manage Rooms
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "addType" ? "active" : ""}`}
              onClick={() => setActiveTab("addType")}
            >
              Add Type
            </button>
          </li>
          <li className="nav-item">
            <button
              className={`nav-link ${activeTab === "addRoom" ? "active" : ""}`}
              onClick={() => setActiveTab("addRoom")}
            >
              Add Room
            </button>
          </li>
        </ul>

        {/* CONTENT AREA */}
        {loading ? (
          <p>Loading...</p>
        ) : (
          <>
            {/* 🔥 NEW DASHBOARD TAB */}
            {activeTab === "dashboard" && (
              <div>
                {/* Stats Cards */}
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="card text-white bg-primary mb-3 shadow">
                      <div className="card-body">
                        <h5 className="card-title">Total Revenue</h5>
                        <h2 className="card-text">₹{stats.totalRevenue}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-white bg-success mb-3 shadow">
                      <div className="card-body">
                        <h5 className="card-title">Active Bookings</h5>
                        <h2 className="card-text">{stats.activeBookings}</h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-white bg-warning mb-3 shadow">
                      <div className="card-body">
                        <h5 className="card-title text-dark">Total Bookings</h5>
                        <h2 className="card-text text-dark">
                          {stats.totalBookings}
                        </h2>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-3">
                    <div className="card text-white bg-info mb-3 shadow">
                      <div className="card-body">
                        <h5 className="card-title">Available Rooms</h5>
                        <h2 className="card-text">{stats.availableRooms}</h2>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Recent Activity (Reusing your Bookings Component logic, just showing top 5) */}
                <h4 className="mb-3">Recent Activity</h4>
                <AdminBookings bookings={bookings.slice(0, 5)} />
              </div>
            )}

            {/* Existing Tabs */}
            {activeTab === "bookings" && <AdminBookings bookings={bookings} />}
            {activeTab === "rooms" && (
              <AdminRoomList rooms={rooms} onDelete={handleDeleteRoom} />
            )}
            {activeTab === "addType" && <AddTypeForm onSuccess={fetchData} />}
            {activeTab === "addRoom" && (
              <AddRoomForm roomTypes={roomTypes} onSuccess={fetchData} />
            )}
          </>
        )}
      </div>
    </>
  );
};

export default AdminPanel;

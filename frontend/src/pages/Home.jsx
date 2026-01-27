import React, { useState } from "react";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom"; // Import Hook

const Home = () => {
  const navigate = useNavigate();

  // 1. State to hold search inputs
  const [search, setSearch] = useState({
    checkIn: "",
    checkOut: "",
    roomType: "", // Optional
  });

  // 2. Handle Search Submit
  const handleSearch = (e) => {
    e.preventDefault();

    // Basic Validation
    if (!search.checkIn || !search.checkOut) {
      alert("Please select both Check-in and Check-out dates.");
      return;
    }

    // Redirect to Rooms page with Query Parameters
    navigate(
      `/rooms?checkIn=${search.checkIn}&checkOut=${search.checkOut}&type=${search.roomType}`,
    );
  };

  return (
    <>
      <Navbar />

      {/* Hero Section */}
      <div
        className="d-flex align-items-center justify-content-center text-white text-center"
        style={{
          minHeight: "100vh",
          background:
            "linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="container">
          <h1 className="display-3 fw-bold mb-4">Find Your Perfect Stay</h1>
          <p className="lead mb-5">
            Experience luxury, comfort, and seamless booking with HotelSphere.
          </p>

          {/* Search Bar (Now Functional) */}
          <div className="bg-white p-4 rounded shadow-lg d-inline-block text-dark">
            <form onSubmit={handleSearch}>
              <div className="d-flex flex-wrap gap-3 align-items-end">
                {/* Check-In */}
                <div className="text-start">
                  <label className="form-label fw-bold">Check-in</label>
                  <input
                    type="date"
                    className="form-control"
                    value={search.checkIn}
                    onChange={(e) =>
                      setSearch({ ...search, checkIn: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Check-Out */}
                <div className="text-start">
                  <label className="form-label fw-bold">Check-out</label>
                  <input
                    type="date"
                    className="form-control"
                    value={search.checkOut}
                    onChange={(e) =>
                      setSearch({ ...search, checkOut: e.target.value })
                    }
                    required
                  />
                </div>

                {/* Room Type (Optional) */}
                <div className="text-start">
                  <label className="form-label fw-bold">Type</label>
                  <select
                    className="form-control"
                    style={{ width: "150px" }}
                    value={search.roomType}
                    onChange={(e) =>
                      setSearch({ ...search, roomType: e.target.value })
                    }
                  >
                    <option value="">All Types</option>
                    <option value="Deluxe">Deluxe</option>
                    <option value="Standard">Standard</option>
                    <option value="Suite">Suite</option>
                  </select>
                </div>

                {/* Search Button */}
                <div>
                  <button type="submit" className="btn btn-primary px-4">
                    Search Rooms
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;

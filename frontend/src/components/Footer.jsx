import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-dark text-white pt-5 pb-3 ">
      <div className="container">
        <div className="row">
          <div className="col-md-4 mb-4">
            <h4 className="fw-bold text-warning">HotelSphere</h4>
            <p className="small text-secondary">
              Experience luxury and comfort at affordable rates. Your perfect
              stay is just a click away.
            </p>
          </div>

          {/* Column 2: Quick Links */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Quick Links</h5>
            <ul className="list-unstyled">
              <li>
                <Link
                  to="/"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  to="/rooms"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  Browse Rooms
                </Link>
              </li>
              <li>
                <Link
                  to="/my-bookings"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  My Bookings
                </Link>
              </li>
              <li>
                <Link
                  to="/admin"
                  className="text-white-50 text-decoration-none hover-white"
                >
                  Admin Login
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3: Contact Info */}
          <div className="col-md-4 mb-4">
            <h5 className="fw-bold mb-3">Contact Us</h5>
            <p className="small text-secondary mb-1">
              📍 123 Luxury Lane, Paradise City,Pune
            </p>
            <p className="small text-secondary mb-1">📞 +91 1234567899</p>
            <p className="small text-secondary">✉️ support@hotelsphere.com</p>
          </div>
        </div>

        <hr className="border-secondary" />

        {/* Copyright Section */}
        <div className="text-center text-secondary small">
          <p className="mb-0">
            &copy; {new Date().getFullYear()} HotelSphere. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

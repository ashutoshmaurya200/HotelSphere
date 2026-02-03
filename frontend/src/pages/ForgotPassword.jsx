import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const ForgotPassword = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    secretAnswer: "",
    newPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setMessage("");

    // Simple validation
    if (formData.newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/forgot-password", formData);
      setMessage("Password Reset Successful! Redirecting to login...");
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(
        err.response?.data || "Failed to reset password. Check your details.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div className="card shadow border-0 p-4" style={{ width: "400px" }}>
          <h3 className="text-center fw-bold mb-4">Reset Password</h3>

          {error && (
            <div className="alert alert-danger text-center small">{error}</div>
          )}
          {message && (
            <div className="alert alert-success text-center small">
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                name="email"
                className="form-control"
                placeholder="Enter registered email"
                onChange={handleChange}
                required
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Secret Answer</label>
              <input
                type="text"
                name="secretAnswer"
                className="form-control"
                placeholder="Answer to your secret question"
                onChange={handleChange}
                required
              />
              <div className="form-text text-muted">
                (For this demo, assume question is: "What is your favorite
                color?")
              </div>
            </div>

            <div className="mb-4">
              <label className="form-label">New Password</label>
              <input
                type="password"
                name="newPassword"
                className="form-control"
                placeholder="Enter new password"
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-warning w-100 fw-bold"
              disabled={loading}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>
          </form>

          <div className="text-center mt-3">
            <Link to="/login" className="text-decoration-none text-secondary">
              ← Back to Login
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default ForgotPassword;

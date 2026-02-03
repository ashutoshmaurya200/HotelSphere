import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await api.post("/auth/login", { email, password });

      // Store token
      localStorage.setItem("token", res.data.token);

      // Store userId
      localStorage.setItem("userId", res.data.user?.userId || res.data.userId);

      localStorage.setItem("role", res.data.user?.role || res.data.role);

      navigate("/");
    } catch (err) {
      setError("Invalid email or password");
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
        <div className="card shadow p-4" style={{ width: "400px" }}>
          <div className="card-body">
            <h3 className="text-center mb-4">Welcome Back</h3>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleLogin}>
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  className="form-control"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="btn btn-primary w-100">
                Login
              </button>
            </form>

            <div className="text-center mt-3">
              <p className="text-muted">
                Don't have an account?{" "}
                <Link to="/register" className="text-decoration-none">
                  Sign up
                </Link>
              </p>
            </div>

            <div className="text-end mb-3">
              <Link
                to="/forgot-password"
                style={{ fontSize: "0.9rem", textDecoration: "none" }}
              >
                Forgot Password?
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import Navbar from "../components/Navbar";

const Register = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    phone: "",
    role: "USER",

    secretQuestion: "What is your favorite color?",
    secretAnswer: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (error) setError("");
  };

  const validateForm = () => {
    const { phone, password, secretAnswer } = formData;

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(phone)) {
      setError("Phone number must be exactly 10 digits.");
      return false;
    }

    const strictPasswordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;
    if (!strictPasswordRegex.test(password)) {
      setError(
        "Password must be 8+ chars, with Upper, Lower, Number & Special Char.",
      );
      return false;
    }

    //  Check Secret Answer
    if (secretAnswer.length < 2) {
      setError("Please provide a valid secret answer.");
      return false;
    }

    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      await api.post("/auth/register", formData);
      alert("Registration Successful! Please Login.");
      navigate("/login");
    } catch (err) {
      setError(err.response?.data || "Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
        <div
          className="card shadow border-0 p-4"
          style={{ width: "450px", marginTop: "80px", marginBottom: "40px" }}
        >
          <div className="card-body">
            <h3 className="text-center fw-bold mb-4">Create Account</h3>
            {error && (
              <div className="alert alert-danger text-center small">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  className="form-control"
                  placeholder="Vivek  or  Ashutosh"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  name="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Phone Number</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-control"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="mb-3">
                <label className="form-label">Password</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Pass@123"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
              </div>

              {/*  Secret Question Selection */}
              <div className="mb-3">
                <label className="form-label">Security Question</label>
                <select
                  name="secretQuestion"
                  className="form-select"
                  value={formData.secretQuestion}
                  onChange={handleChange}
                >
                  <option value="What is your favorite color?">
                    What is your favorite color?
                  </option>
                  <option value="What is your pet's name?">
                    What is your pet's name?
                  </option>

                  <option value="What city were you born in?">
                    What city were you born in?
                  </option>
                </select>
              </div>

              {/* Secret Answer Input */}
              <div className="mb-4">
                <label className="form-label">Security Answer</label>
                <input
                  type="text"
                  name="secretAnswer"
                  className="form-control"
                  placeholder="Your Answer"
                  value={formData.secretAnswer}
                  onChange={handleChange}
                  required
                />
                <div className="form-text small">
                  You will need this to reset your password.
                </div>
              </div>

              <div className="d-grid">
                <button
                  type="submit"
                  className="btn btn-primary btn-lg"
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Register"}
                </button>
              </div>
            </form>

            <div className="text-center mt-3">
              <p className="text-muted">
                Already have an account? <Link to="/login">Login here</Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;

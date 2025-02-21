import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    flatCode: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Handle input change
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // ✅ Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    console.log("📤 Submitting Data:", formData);

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", formData);
      console.log("✅ Response Data:", response.data);

      const { token } = response.data;
      localStorage.setItem("token", token);

      navigate("/complaints"); // ✅ Redirect to complaints page
    } catch (err) {
      console.error("🔴 Registration error:", err.response ? err.response.data : err.message);
      setError(err.response?.data?.msg || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container d-flex justify-content-center align-items-center vh-130">
      <div className="card shadow-lg p-4 w-100" style={{ maxWidth: "400px" }}>
        <h2 className="text-center text-primary mb-4">Register</h2>
        
        {/* ✅ Show error message */}
        {error && <p className="alert alert-danger text-center">{error}</p>}

        <form onSubmit={handleSubmit}>
          {/* Name Field */}
          <div className="mb-3">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your name"
              required
            />
          </div>

          {/* Email Field */}
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your email"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-3">
            <label className="form-label">Password</label>
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter a strong password"
              required
            />
          </div>

          {/* Flat Code Field */}
          <div className="mb-3">
            <label className="form-label">Flat Code</label>
            <input
              type="text"
              name="flatCode"
              value={formData.flatCode}
              onChange={handleChange}
              className="form-control"
              placeholder="Enter your flat code"
              required
            />
          </div>

          {/* Submit Button */}
          <button type="submit" className="btn btn-primary w-100" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="mt-3 text-center">
          Already have an account?{" "}
          <span className="text-primary text-decoration-none" role="button" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;

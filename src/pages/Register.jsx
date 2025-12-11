import "../styles/authPremium.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Register = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    localStorage.setItem("userInfo", JSON.stringify(user));
    navigate("/login");
  };

  return (
    <div className="premium-auth-container">
      <form className="premium-card" onSubmit={handleRegister}>
        <h2 className="premium-title">Create Account</h2>

        <div className="input-group">
          <input
            type="text"
            name="name"
            className="premium-input"
            onChange={handleChange}
            value={user.name}
            placeholder=" "
          />
          <label className="floating-label">Full Name</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            name="email"
            className="premium-input"
            onChange={handleChange}
            value={user.email}
            placeholder=" "
          />
          <label className="floating-label">Email</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            name="password"
            className="premium-input"
            onChange={handleChange}
            value={user.password}
            placeholder=" "
          />
          <label className="floating-label">Password</label>
        </div>

        <button className="premium-btn">Register</button>

        <p className="premium-bottom">
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </form>
    </div>
  );
};

export default Register;

import "../styles/authPremium.css";
import { Link, useNavigate } from "react-router-dom";
import React, { useState } from "react";

const Login = () => {
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setLoginData({ ...loginData, [e.target.name]: e.target.value });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const saved = JSON.parse(localStorage.getItem("userInfo"));

    if (saved && saved.email === loginData.email && saved.password === loginData.password) {
      navigate("/dashboard");
    } else {
      alert("Invalid Credentials");
    }
  };

  return (
    <div className="premium-auth-container">
      <form className="premium-card" onSubmit={handleLogin}>
        <h2 className="premium-title">Welcome Back</h2>

        <div className="input-group">
          <input
            type="email"
            name="email"
            className="premium-input"
            onChange={handleChange}
            value={loginData.email}
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
            value={loginData.password}
            placeholder=" "
          />
          <label className="floating-label">Password</label>
        </div>

        <button className="premium-btn">Login</button>

        <p className="premium-bottom">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;

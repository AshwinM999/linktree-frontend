import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await fetch("https://linktree-backend-1.onrender.com/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/setup-profile");
    } else {
      alert(data.error || "Registration failed");
    }
  };

  return (
  <div className="auth-container">
    <h2>Register</h2>
    <input
      placeholder="Email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
    />
    <input
      placeholder="Password"
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
    />
    <button onClick={handleRegister}>Register</button>
  </div>
);
}

export default Register;

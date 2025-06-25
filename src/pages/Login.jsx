import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";
function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("https://linktree-backend-3ekq.onrender.com/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/setup-profile");
    } else {
      alert(data.error || "Login failed");
    }
  };
    return (
  <div className="auth-container">
    <h2>Login</h2>
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
    <button onClick={handleLogin}>Login</button>
    <p>Don't have an account? <a href="/register">Register</a></p>
  </div>
);
}

export default Login;

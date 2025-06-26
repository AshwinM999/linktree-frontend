import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../css/login.css";

function Register() {
  const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const isValidEmail = (email) => email.includes("@");

  const handleRegister = async () => {
    // Basic validation
    if (!email || !password) {
      alert("Please enter both email and password.");
      return;
    }

    if (!isValidEmail(email)) {
      alert("Please enter a valid email address.");
      return;
    }

    try {
      const res = await fetch(`${BACKEND_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("token", data.token);
        navigate("/setup-profile");
      } else {
        alert(data.error || "Registration failed.");
      }
    } catch (err) {
      alert("Something went wrong. Please try again.");
      console.error("Register error:", err);
    }
  };

  return (
    <div className="auth-container">
      <h2>Register</h2>
      <input
        type="email"
        placeholder="Email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default Register;

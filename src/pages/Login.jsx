import React, { useState } from "react";
import "../css/Login.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(null);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    if (response.ok) {
      const data = await response.json();
      localStorage.setItem("token", data.token); // Store JWT in localStorage
      setModalMessage("Login successful!");
      setTimeout(() => {
        setModalMessage(null);
        navigate("/");
      }, 2000);
    } else {
      setModalMessage("Invalid email or password.");
      setTimeout(() => setModalMessage(null), 2000);
    }
  };

  return (
    <div className="login-page">
      <h2>Login</h2>
      <form onSubmit={handleLogin}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit">Login</button>
      </form>
      {modalMessage && (
        <div className="modal">
          <p>{modalMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Login;

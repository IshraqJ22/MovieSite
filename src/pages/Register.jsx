import React, { useState } from "react";
import "../css/Register.css";
import { useNavigate } from "react-router-dom";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [modalMessage, setModalMessage] = useState(null);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    const response = await fetch("http://localhost:5000/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, email, password }),
    });

    if (response.ok) {
      setModalMessage("Registration successful!");
      setTimeout(() => {
        setModalMessage(null);
        navigate("/login");
      }, 2000);
    } else {
      setModalMessage("Registration failed. Please try again.");
      setTimeout(() => setModalMessage(null), 2000);
    }
  };

  return (
    <div className="register-page">
      <h2>Register</h2>
      <form onSubmit={handleRegister}>
        <input
          type="text"
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
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
        <button type="submit">Register</button>
      </form>
      {modalMessage && (
        <div className="modal">
          <p>{modalMessage}</p>
        </div>
      )}
    </div>
  );
}

export default Register;

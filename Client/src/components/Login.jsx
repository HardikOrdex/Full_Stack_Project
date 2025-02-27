import React, { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate, useLocation } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [creds, setCreds] = useState({ mail: "demo@example.com", password: "password" });
  const { login } = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    login(creds, navigate, location);
  };
  return (
    <div>
      <h1>Login Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Mail ID"
          value={creds.mail}
          onChange={(e) => setCreds({ ...creds, mail: e.target.value })}
        />
        <input
          type="text"
          placeholder="Password"
          value={creds.password}
          onChange={(e) => setCreds({ ...creds, password: e.target.value })}
        />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;

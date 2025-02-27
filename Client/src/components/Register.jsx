import React, { useContext, useState } from "react";
import AuthContext from "../context/authContext";
import { useNavigate } from "react-router-dom";

function Register() {
  const navigate = useNavigate();
  const [creds, setCreds] = useState({ username: "", mail: "", password: "" });
  const {register} = useContext(AuthContext);
  const handleSubmit = (e) => {
    e.preventDefault();
    register(creds, navigate);
  };
  return (
    <div>
      <h1>Register Form</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="User name"
          value={creds.username}
          onChange={(e) => setCreds({ ...creds, username: e.target.value })}
        />
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
        <button type="submit">Register</button>
      </form>
    </div>
  );
}

export default Register;

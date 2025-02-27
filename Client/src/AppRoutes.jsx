import { Route, Routes } from "react-router-dom";
import React from "react";
import Home from "./components/Home";
import Login from "./components/Login";
import PrivateRoute from "./middleware/PrivateRoute";
import Dashboard from "./components/Dashboard";
import Register from "./components/Register";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />
    </Routes>
  );
}

export default AppRoutes;

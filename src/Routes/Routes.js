import React from "react";
import { Route, Routes, Navigate, useNavigate } from "react-router-dom";
import Login from "../Account functions/Login";
import HomePage from "../HomePage";
import Register from "../Account functions/Register";
import AddPolicy from "../Policies/AddPolicy";
import ProtectedRoute from "./ProtectedRoute";
import NotFound from "./NotFound";
import PolicyProfile from "../Policies/PolicyProfile";

function RoutesMap() {
  const loggedIn = sessionStorage.getItem("loggedIn");
  const navigate = useNavigate();
  const loginRedir = () => {
    navigate("/home");
  };
  return (
    <Routes>
      <Route path="/" element={<Navigate replace to="/home" />} />
      <Route path="/login" element={<Login refresh={loginRedir} />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute loggedIn={loggedIn}>
            <HomePage />
          </ProtectedRoute>
        }
      >
        <Route
          path="add-policy"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <AddPolicy />
            </ProtectedRoute>
          }
        />
        <Route
          path=":id"
          element={
            <ProtectedRoute loggedIn={loggedIn}>
              <PolicyProfile />
            </ProtectedRoute>
          }
        />
      </Route>
      <Route path="/register" element={<Register />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}

export default RoutesMap;

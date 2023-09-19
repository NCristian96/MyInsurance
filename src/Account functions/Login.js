import React, { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilShieldAlt } from "@coreui/icons";
import { CButton, CForm, CFormInput, CAlert } from "@coreui/react";
import { auth } from "../firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import ResetPassword from "./ResetPassword";

function Login({ refresh }) {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const submitForm = async e => {
    e?.preventDefault();
    try {
      const userData = await signInWithEmailAndPassword(auth, email, password);
      if (userData?.user?.uid) {
        sessionStorage.setItem("userId", userData?.user?.uid);
        sessionStorage.setItem("loggedIn", true);
        sessionStorage.setItem("email", userData?.user.email);
        setError(null);
        refresh();
      }
    } catch (err) {
      setError(null);
      switch (err?.code) {
        case "auth/user-not-found":
          setError("User not found");
          break;
        case "auth/wrong-password":
          setError("Password is incorrect");
          break;
        case "auth/too-many-requests":
          setError("Too many requests, try again later");
          break;
        case "auth/missing-password":
          setError("Missing password");
          break;
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        case "auth/invalid-login-credentials":
          setError("Invalid login credentials");
          break;
        default:
          setError("Something went wrong. Try again later.");
      }
    }
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div className="text-white d-block">
        <CIcon icon={cilShieldAlt} />
        <h4 className="fw-bold">MyInsurance</h4>
      </div>
      <div className="col-7 col-sm-3">
        <CForm className="container" onSubmit={submitForm}>
          <div className="row">
            <CFormInput
              value={email}
              onChange={e => {
                setEmail(e?.target?.value);
                setError(null);
              }}
              type="email"
              id="emailInput"
              placeholder="name@example.com"
              className="mb-3"
            />
          </div>
          <div className="row">
            <CFormInput
              value={password}
              onChange={e => {
                setPassword(e?.target?.value);
                setError(null);
              }}
              type="password"
              id="passwordInput"
              placeholder="password"
              className="mb-3"
            />
          </div>
          <div className="row">
            <div className="d-flex justify-content-between">
              <CButton type="submit" color="light" variant="outline">
                Log In
              </CButton>
              <CButton color="dark" onClick={() => navigate("/register")}>
                Register
              </CButton>
            </div>
            <a
              onClick={e => {
                e.preventDefault();
                setVisible(true);
              }}
              className="text-center text-white mt-2"
            >
              Forgot password?
            </a>
          </div>
        </CForm>
        <CAlert hidden={!error} color="danger" className="mx-auto text-center mt-3 col-sm-7">
          {error}
        </CAlert>
      </div>
      <ResetPassword visible={visible} setVisible={setVisible}></ResetPassword>
    </div>
  );
}

export default Login;

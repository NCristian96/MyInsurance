import {
  CModal,
  CModalHeader,
  CModalBody,
  CFormInput,
  CButton,
  CModalTitle,
  CModalFooter,
  CToast,
  CToastBody,
  CToaster,
  CToastHeader
} from "@coreui/react";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import React, { useRef, useState } from "react";
import { useNavigate } from "react-router-dom";

function ResetPassword({ visible, setVisible }) {
  const [toast, addToast] = useState(0);
  const toaster = useRef();
  const [email, setEmail] = useState("");
  const [error, setError] = useState(null);
  const successToast = (
    <CToast>
      <CToastHeader closeButton>
        <div className="fw-bold me-auto">Email sent!</div>
      </CToastHeader>
      <CToastBody>Please check your spam/junk too.</CToastBody>
    </CToast>
  );
  const navigate = useNavigate();
  const resetPassword = async () => {
    const auth = getAuth();
    try {
      await sendPasswordResetEmail(auth, email);
      navigate("/login");
      setVisible(false);
      addToast(successToast);
      setEmail("");
    } catch (err) {
      setError(null);
      switch (err?.code) {
        case "auth/invalid-email":
          setError("Invalid email");
          break;
        case "auth/user-not-found":
          setError("No user with this email address found.");
          break;
        default:
          setError("Something went wrong. Try agian later.");
      }
    }
  };
  return (
    <>
      <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
        <CModalHeader onClose={() => setVisible(false)}>
          <CModalTitle>Reset password</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <p className="text-center">A reset email will be sent to your account's email address.</p>
        </CModalBody>
        <p className="text-center">Type in your email to proceed</p>
        <div className="container col-8 col-sm-6 mb-1">
          <CFormInput
            onKeyDown={key => {
              if (key.code === "Enter") {
                resetPassword();
              }
            }}
            onChange={e => {
              setEmail(e.target.value);
              setError("");
            }}
            value={email}
            type="email"
            placeholder="example@email.com"
          />
        </div>
        <p hidden={!error} className="mx-auto text-center mt-3 col-sm-7 text-danger">
          {error}
        </p>
        <CModalFooter>
          <CButton onClick={() => setVisible(false)} color="dark">
            Close
          </CButton>
          <CButton disabled={!email} onClick={resetPassword} color="success">
            Send email
          </CButton>
        </CModalFooter>
      </CModal>
      <CToaster ref={toaster} push={toast} placement="top-end" />
    </>
  );
}

export default ResetPassword;

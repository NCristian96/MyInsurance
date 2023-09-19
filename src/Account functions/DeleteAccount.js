import { CModal, CModalHeader, CModalTitle, CModalBody, CModalFooter, CButton, CFormInput } from "@coreui/react";
import { getAuth, deleteUser, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";

function DeleteAccount({ visible, setVisible }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const deleteAccount = async () => {
    const id = sessionStorage.getItem("userId");
    const email = sessionStorage.getItem("email");
    const auth = getAuth();
    try {
      const user = auth.currentUser;
      await signInWithEmailAndPassword(auth, email, password);
      await deleteUser(user);
      await deleteDoc(doc(db, "users", id));
      sessionStorage.clear();
      navigate("/login");
    } catch (err) {
      setError(null);
      switch (err?.code) {
        case "auth/wrong-password":
          setError("Incorrect password");
          break;
        case "auth/invalid-login-credentials":
          setError("Incorrect password");
          break;
        default:
          setError("Something went wrong. Try again later.");
      }
    }
  };
  return (
    <CModal alignment="center" visible={visible} onClose={() => setVisible(false)}>
      <CModalHeader onClose={() => setVisible(false)}>
        <CModalTitle>Delete account</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Are you sure you want to delete your account? All information will be permanently lost.</p>
      </CModalBody>
      <p className="text-center">Type in your password to proceed</p>
      <div className="container col-7 col-sm-5 mb-1">
        <CFormInput
          onChange={e => {
            setPassword(e.target.value);
            setError("");
          }}
          value={password}
          type="password"
          placeholder="password"
        />
      </div>
      <p hidden={!error} className="mx-auto text-center mt-3 col-sm-7 text-danger">
        {error}
      </p>
      <CModalFooter>
        <CButton onClick={() => setVisible(false)} color="secondary">
          Close
        </CButton>
        <CButton disabled={!password} onClick={deleteAccount} color="danger">
          Delete account
        </CButton>
      </CModalFooter>
    </CModal>
  );
}

export default DeleteAccount;

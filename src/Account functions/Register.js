import React, { useState } from "react";
import CIcon from "@coreui/icons-react";
import { cilShieldAlt } from "@coreui/icons";
import { CButton, CForm, CFormInput, CAlert, CSpinner } from "@coreui/react";
import { auth } from "../firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../firebase";
import { useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import { registerSchema } from "../schemas";

function Login() {
  const onSubmit = () => {
    submitForm();
  };
  const formik = useFormik({
    initialValues: {
      email: "",
      password: ""
    },
    validationSchema: registerSchema,
    onSubmit
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const navigate = useNavigate();
  const submitForm = async () => {
    try {
      const userData = await createUserWithEmailAndPassword(auth, formik.values.email, formik.values.password);
      await setDoc(doc(db, "users", `${userData?.user?.uid}`), {
        policies: []
      });
      if (userData?.user?.uid) {
        setError(null);
        setSuccess(true);
        formik.resetForm();
        setTimeout(() => navigate("/login"), 4000);
      }
    } catch (err) {
      setError(null);
      setSuccess(null);
      switch (err?.code) {
        case "auth/email-already-in-use":
          setError("This email is already used.");
          setTimeout(() => setError(null), 3000);
          break;
      }
    }
  };
  return (
    <div className="d-flex flex-column justify-content-center align-items-center vh-100">
      <div onClick={() => navigate("/login")} role="button" className="text-white d-block">
        <CIcon icon={cilShieldAlt} />
        <h4 className="fw-bold">MyInsurance</h4>
      </div>
      <div className="col-7 col-sm-3">
        <CForm className="container" onSubmit={formik.handleSubmit}>
          <div className="row">
            <CFormInput
              value={formik.values.email}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="email"
              id="email"
              placeholder="name@example.com"
              className={` ${formik.errors.email && formik.touched.email ? "border-danger mb-2" : "mb-4"}`}
            />
          </div>
          <div className="row">
            {formik.errors.email && formik.touched.email && (
              <p className="fw-bold text-center text-danger font-italic">{formik.errors.email}</p>
            )}
          </div>
          <div className="row">
            <CFormInput
              value={formik.values.password}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="password"
              id="password"
              placeholder="password"
              className={` ${formik.errors.password && formik.touched.password ? "border-danger mb-2" : "mb-4"}`}
              onKeyDown={key => {
                if (key.code === "Enter") {
                  formik.handleSubmit();
                }
              }}
            />
          </div>
          <div className="row">
            {formik.errors.password && formik.touched.password && (
              <p className="fw-bold text-center text-danger">{formik.errors.password}</p>
            )}
          </div>
          <div className="row">
            <div className="d-flex justify-content-center">
              <CButton type="submit" color="dark">
                Register
              </CButton>
            </div>
          </div>
        </CForm>
        <CAlert hidden={!error} color="danger" className="mx-auto text-center mt-3 col-sm-7">
          {error}
        </CAlert>
        <CAlert className="mx-auto text-center mt-3 " color="success" hidden={!success}>
          The account has been created. You will be redirected to the login page.
        </CAlert>
        <div className="d-flex justify-content-center">
          <CSpinner hidden={!success}></CSpinner>
        </div>
      </div>
    </div>
  );
}

export default Login;

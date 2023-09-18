import { CForm, CFormInput, CButton, CAlert, CFormSelect } from "@coreui/react";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
import React, { useState } from "react";
import { db } from "../firebase";
import { useNavigate, useOutletContext } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import { useFormik } from "formik";
import { policySchema } from "../schemas";

function AddPolicy() {
  const onSubmit = () => {
    submitForm();
  };
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      birthDate: "",
      policyType: "",
      carMake: "",
      manufacturingYear: "",
      registrationNumber: "",
      VIN: "",
      kilometers: ""
    },
    validationSchema: policySchema,
    onSubmit
  });
  const navigate = useNavigate();
  const { update } = useOutletContext();
  const userId = sessionStorage.getItem("userId");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const submitForm = async () => {
    const policyNumber = () => {
      const randomInteger = Math.floor(100 + Math.random() * 900);
      const randomDecimal = Math.floor(10 + Math.random() * 90);
      const randomNumber = `${String(randomInteger).padStart(3, "0")}.${String(randomDecimal).padStart(2, "0")}`;
      return randomNumber;
    };
    let newPolicy = {
      policyNumber: Number(policyNumber()).toFixed(2),
      id: uuidv4(),
      name: `${formik.values.lastName} ${formik.values.firstName}`,
      birthDate: formik.values.birthDate,
      policyType: formik.values.policyType
    };
    if (formik.values.policyType === "RCA") {
      newPolicy = {
        ...newPolicy,
        carMake: formik.values.carMake,
        manufacturingYear: formik.values.manufacturingYear,
        registrationNumber: formik.values.registrationNumber
      };
    } else if (formik.values.policyType === "CASCO") {
      newPolicy = { ...newPolicy, VIN: formik.values.VIN, kilometers: formik.values.kilometers };
    }
    try {
      const userRef = doc(db, "users", `${userId}`);
      await updateDoc(userRef, {
        policies: arrayUnion(newPolicy)
      });
      setSuccess("Policy added");
      setTimeout(() => setSuccess(null), 3000);
      formik.resetForm();
      setError(null);
      update();
    } catch (err) {
      setError(err.message);
    }
  };
  return (
    <div className="h-50 container position-relative col-sm-8 ms-1 mt-4 d-sm-flex bg-light rounded shadow justify-content-center align-items-center">
      <CForm className="container col-sm-6 col-lg-5 my-3" onSubmit={formik.handleSubmit}>
        <h3 className="text-center">Generate Insurance Policy</h3>
        <div className="row">
          <CFormInput
            value={formik.values.firstName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            id="firstName"
            placeholder="First Name (optional)"
            className="mb-3"
          />
        </div>
        <div className="row">
          <CFormInput
            value={formik.values.lastName}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="text"
            id="lastName"
            placeholder="Last Name"
            className={` ${formik.errors.lastName && formik.touched.lastName ? "border-danger mb-1" : "mb-3"}`}
          />
        </div>
        <div className="row">
          {formik.errors.lastName && formik.touched.lastName && (
            <p className="fw-bold text-center text-danger font-italic">{formik.errors.lastName}</p>
          )}
        </div>
        <div className="row">
          <span>Birth date:</span>
          <CFormInput
            value={formik.values.birthDate}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            type="date"
            id="birthDate"
            className={` ${formik.errors.birthDate && formik.touched.birthDate ? "border-danger mb-1" : "mb-3"}`}
            min="1900-01-01"
            max={new Date().toISOString().split("T")[0]}
          />
        </div>
        <div className="row">
          {formik.errors.birthDate && formik.touched.birthDate && (
            <p className="fw-bold text-center text-danger font-italic">{formik.errors.birthDate}</p>
          )}
        </div>
        <div className="row">
          <CFormSelect
            className={` ${formik.errors.policyType && formik.touched.policyType ? "border-danger mb-1" : "mb-3"}`}
            id="policyType"
            value={formik.values.policyType}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option>Select Policy Type</option>
            <option value="RCA">RCA</option>
            <option value="CASCO">CASCO</option>
          </CFormSelect>
        </div>
        <div className="row">
          {formik.errors.policyType && formik.touched.policyType && (
            <p className="fw-bold text-center text-danger font-italic">{formik.errors.policyType}</p>
          )}
        </div>
        <div hidden={formik.values.policyType === "RCA" ? false : true}>
          <div className="row">
            <CFormInput
              value={formik.values.carMake}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              id="carMake"
              placeholder="Car Make"
              className={` ${formik.errors.carMake && formik.touched.carMake ? "border-danger mb-1" : "mb-3"}`}
            />
          </div>
          <div className="row">
            {formik.errors.carMake && formik.touched.carMake && (
              <p className="fw-bold text-center text-danger font-italic">{formik.errors.carMake}</p>
            )}
          </div>
          <div className="row">
            <span>Manufacturing year:</span>
            <CFormInput
              value={formik.values.manufacturingYear}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="date"
              id="manufacturingYear"
              className={` ${formik.errors.manufacturingYear && formik.touched.manufacturingYear ? "border-danger mb-1" : "mb-3"}`}
              min="1900-01-01"
              max={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="row">
            {formik.errors.manufacturingYear && formik.touched.manufacturingYear && (
              <p className="fw-bold text-center text-danger font-italic">{formik.errors.manufacturingYear}</p>
            )}
          </div>
          <div className="row">
            <CFormInput
              value={formik.values.registrationNumber}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              id="registrationNumber"
              placeholder="Registration number"
              className={` ${formik.errors.registrationNumber && formik.touched.registrationNumber ? "border-danger mb-1" : "mb-3"}`}
            />
          </div>
          <div className="row">
            {formik.errors.registrationNumber && formik.touched.registrationNumber && (
              <p className="fw-bold text-center text-danger font-italic">{formik.errors.registrationNumber}</p>
            )}
          </div>
        </div>
        <div hidden={formik.values.policyType === "CASCO" ? false : true}>
          <div className="row">
            <CFormInput
              value={formik.values.VIN}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="text"
              id="VIN"
              placeholder="VIN"
              className={` ${formik.errors.VIN && formik.touched.VIN ? "border-danger mb-1" : "mb-3"}`}
            />
          </div>
          <div className="row">
            {formik.errors.VIN && formik.touched.VIN && <p className="fw-bold text-center text-danger font-italic">{formik.errors.VIN}</p>}
          </div>
          <div className="row">
            <CFormInput
              value={formik.values.kilometers}
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              type="number"
              id="kilometers"
              placeholder="Kilometers"
              className={` ${formik.errors.kilometers && formik.touched.kilometers ? "border-danger mb-1" : "mb-3"}`}
            />
          </div>
          <div className="row">
            {formik.errors.kilometers && formik.touched.kilometers && (
              <p className="fw-bold text-center text-danger font-italic">{formik.errors.kilometers}</p>
            )}
          </div>
        </div>
        <div className="row">
          <div className="d-flex justify-content-between">
            <CButton type="submit" color="success" className="me-2">
              Generate policy
            </CButton>
            <CButton onClick={() => navigate("/home")} color="dark">
              Close
            </CButton>
          </div>
        </div>
        <CAlert hidden={!error} color="danger" className="mx-auto text-center mt-3 col-sm-9">
          {error}
        </CAlert>
        <CAlert hidden={!success} color="success" className="mx-auto text-center mt-3 col-sm-9">
          {success}
        </CAlert>
      </CForm>
    </div>
  );
}

export default AddPolicy;

import { CButton } from "@coreui/react";
import React from "react";
import { useLocation, useNavigate, useOutletContext } from "react-router-dom";

const PolicyProfile = () => {
  const navigate = useNavigate();
  const { policies, deletePolicy } = useOutletContext();
  const { state: policy } = useLocation();
  const policyIndex = policies?.findIndex(c => c.id === policy.id);
  const onDelete = () => {
    deletePolicy(policyIndex);
  };
  return (
    <div className="d-flex flex-column container position-relative col-sm-6 ms-1 mt-4 bg-light rounded shadow position-relative">
      <div className="ms-auto mt-2">
        <CButton onClick={onDelete} className="me-2" color="danger">
          Delete
        </CButton>
        <CButton onClick={() => navigate("/home")} color="dark">
          X
        </CButton>
      </div>
      <div className="fw-bold">
        <h3 className="mt-4 mb-2 text-center">{`${policy.policyType} ${policy.policyNumber}`}</h3>
        <hr />
        <p className="text-center">Name: {policy.name}</p>
        <p className="text-center">Birth date: {policy.birthDate}</p>
        <p className="text-center">Policy type: {policy.policyType}</p>
        <div hidden={policy.policyType === "CASCO"}>
          <p className="text-center">Car make: {policy.carMake}</p>
          <p className="text-center">Manufacturing date: {policy.manufacturingYear}</p>
          <p className="text-center">Registration number: {policy.registrationNumber}</p>
        </div>
        <div hidden={policy.policyType === "RCA"}>
          <p className="text-center">VIN: {policy.VIN}</p>
          <p className="text-center">Kilometers: {policy.kilometers}</p>
        </div>
      </div>
    </div>
  );
};

export default PolicyProfile;

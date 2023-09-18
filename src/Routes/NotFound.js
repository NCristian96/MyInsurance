import { CButton, CCard, CCardBody } from "@coreui/react";
import React from "react";
import { useNavigate } from "react-router-dom";
function NotFound() {
  const navigate = useNavigate();
  return (
    <div className="container col-8 vh-100 d-flex justify-content-center align-items-center">
      <CCard>
        <CCardBody className="text-center">
          <h2>Page not found!</h2>
          <CButton color="success" className="mt-2" onClick={() => navigate("/home")}>
            Take me home
          </CButton>
        </CCardBody>
      </CCard>
    </div>
  );
}

export default NotFound;

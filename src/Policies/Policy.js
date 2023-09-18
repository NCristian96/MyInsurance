import { cilChevronRight } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import { CCard, CCardBody } from "@coreui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Policy = ({ policy }) => {
  const [active, setActive] = useState(null);
  const navigate = useNavigate();

  return (
    <CCard onMouseLeave={() => setActive("inactive")} onMouseEnter={() => setActive("active-policy")} className="mt-1" id={active}>
      <CCardBody onClick={() => navigate(`/home/${policy.id}`, { state: { ...policy } })} className="d-flex justify-content-between">
        {`${policy.policyType} ${policy.policyNumber}`}
        <CIcon style={{ width: "10%" }} icon={cilChevronRight} />
      </CCardBody>
    </CCard>
  );
};

export default Policy;

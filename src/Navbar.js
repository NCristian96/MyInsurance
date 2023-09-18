import { cilShieldAlt } from "@coreui/icons";
import CIcon from "@coreui/icons-react";
import {
  CNavbar,
  CContainer,
  CNavbarBrand,
  CButton,
  CDropdown,
  CDropdownMenu,
  CDropdownToggle,
  CDropdownItem,
  CDropdownDivider
} from "@coreui/react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import DeleteAccount from "./Account functions/DeleteAccount";

const Navbar = () => {
  const email = sessionStorage.getItem("email");
  const [visible, setVisible] = useState(false);
  const navigate = useNavigate();
  const logOut = () => {
    sessionStorage.clear();
    navigate("/login");
  };
  return (
    <>
      <CNavbar colorScheme="light" className="bg-light shadow">
        <CContainer fluid>
          <CNavbarBrand>
            <div className="d-flex align-items-center">
              MyInsurance
              <CIcon style={{ width: "30px" }} icon={cilShieldAlt} />
            </div>
          </CNavbarBrand>
          <div>
            <CDropdown className="d-block d-sm-none">
              <CDropdownToggle color="success">Menu</CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem onClick={logOut}>Logout</CDropdownItem>
                <CDropdownDivider />
                <CDropdownItem onClick={() => setVisible(true)}>Delete account</CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </div>
          <div className="d-none d-sm-flex align-items-center">
            <span className="me-1">Welcome, {email}!</span>
            <CButton onClick={logOut} color="dark">
              Logout
            </CButton>
            <CButton onClick={() => setVisible(true)} className="ms-1" color="danger">
              Delete account
            </CButton>
          </div>
        </CContainer>
      </CNavbar>
      <DeleteAccount visible={visible} setVisible={setVisible}></DeleteAccount>
    </>
  );
};

export default Navbar;

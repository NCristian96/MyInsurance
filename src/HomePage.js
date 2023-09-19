import { CForm, CButton } from "@coreui/react";
import { arrayRemove, doc, getDoc, updateDoc } from "firebase/firestore";
import React, { useEffect, useState } from "react";
import { db } from "./firebase";
import { useNavigate } from "react-router-dom";
import { Outlet } from "react-router-dom";
import Policy from "./Policies/Policy";
import Navbar from "./Navbar";

function HomePage() {
  const userId = sessionStorage.getItem("userId");
  const [policies, setPolicies] = useState(null);
  const [counter, setCounter] = useState(0);
  const navigate = useNavigate();
  const update = () => {
    setCounter(prev => prev + 1);
  };
  const docRef = doc(db, "users", `${userId}`);
  const userPolicies = async () => {
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      setPolicies(docSnap.data());
    } else {
      setPolicies("Error");
    }
  };
  useEffect(() => {
    userPolicies();
  }, [counter]);
  const policiesList = policies?.policies?.map(policy => {
    return <Policy key={policy.id} policy={policy} />;
  });
  const deletePolicy = async policyIndex => {
    let nextPolicy;
    const getPolicy = policies?.policies?.forEach(policy => {
      if (policy.id === policies.policies[policyIndex].id) {
        nextPolicy = policies?.policies?.[policies?.policies?.indexOf(policy) + 1];
      }
    });
    await updateDoc(docRef, {
      policies: arrayRemove(policies.policies[policyIndex])
    });
    setCounter(c => c + 1);
    if (nextPolicy?.id) {
      navigate(`/home/${nextPolicy?.id}`, { state: { ...nextPolicy } });
    } else {
      navigate("/home");
    }
  };
  return (
    <>
      <Navbar></Navbar>
      <div className="d-flex flex-sm-row-reverse flex-column mx-2 overflow-hidden pb-2">
        <Outlet context={{ update, deletePolicy, ...policies }} />
        <div className="vh-100 container col-10 col-sm-3 mt-4 d-flex bg-light rounded shadow justify-content-center">
          <div className="p-3">
            <CForm className="d-flex align-items-center justify-content-center"></CForm>
            <div className="text-center mt-2 mb-2">
              <p>Your policies:{policies?.policies?.length}</p>
              <CButton color="success" onClick={() => navigate("/home/add-policy")}>
                +New Policy
              </CButton>
            </div>
            <div className="overflow-auto" style={{ height: "80%" }}>
              <div hidden={policies?.policies.length >= 1} className="text-center">
                Your policies list is empty
              </div>
              {policies?.policies.length >= 1 && policies?.policies?.length < 1 ? (
                <p className="text-center">No policies found</p>
              ) : (
                policiesList
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;

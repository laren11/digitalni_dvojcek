import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../../context/userContext";

function Home(props) {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();

  //Navigacija, glede na vrednost v UserContext
  useEffect(() => {
    if (userData.user) {
      navigate("/");
    }
  }, [userData]);

  return (
    /*     <>
      <div>
        {userData.user ? (
          <h1>Welcome {userData.user.displayName}</h1>
        ) : (
          <>
            <h2>You are not logged in</h2>
            <Link to="/login">Login</Link>
          </>
        )}
      </div>
    </> */
    <div className="background">
      <h1 className="title">Hot Picks</h1>
      <div style={{ color: "white" }}>Create table here</div>
      <div style={{ height: "200px" }}></div>
      <div style={{ color: "white" }}>
        Create navbar for 3 different exchanges
      </div>
    </div>
  );
}
export default Home;

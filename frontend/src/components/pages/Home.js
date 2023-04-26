import React, { useEffect, useContext } from "react";
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
    if (!userData.user) {
      navigate("/login");
    }
  }, [userData]);

  return (
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
  );
}
export default Home;

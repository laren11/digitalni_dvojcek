import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";
import { Button } from "react-bootstrap";
function AuthOptions() {
  const { userData, setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const register = () => navigate("/register");
  const login = () => navigate("/login");
  const logout = () => {
    setUserData({
      token: undefined,
      user: undefined,
    });
    localStorage.setItem("auth-token", "");
  };
  return (
    <nav className="p-3">
      {userData?.user ? (
        <Button
          className="btn btn-danger mr-2"
          style={{ margin: "3px" }}
          onClick={logout}
        >
          Logout
        </Button>
      ) : (
        <>
          <Button
            className="btn btn-warning mr-2"
            style={{ margin: "3px" }}
            onClick={register}
          >
            Sign Up
          </Button>
          <Button
            className="btn btn-warning mr-2"
            style={{ margin: "3px" }}
            onClick={login}
          >
            Login
          </Button>
        </>
      )}
    </nav>
  );
}
export default AuthOptions;

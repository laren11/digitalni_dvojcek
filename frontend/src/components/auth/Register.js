import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import UserContext from "../../context/userContext";
import ErrorNotice from "../../components/misc/ErrorNotice";
function Register() {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [passwordCheck, setPasswordCheck] = useState();
  const [displayName, setDisplayName] = useState();
  const [error, setError] = useState();
  const { setUserData } = useContext(UserContext);
  const navigate = useNavigate();
  const submit = async (e) => {
    e.preventDefault();
    try {
      const newUser = { email, password, passwordCheck, displayName };
      await axios.post("http://localhost:3001/users/register", newUser);
      const loginResponse = await axios.post(
        "http://localhost:3001/users/login",
        {
          email,
          password,
        }
      );
      setUserData({
        token: loginResponse.data.token,
        user: loginResponse.data.user,
      });
      localStorage.setItem("auth-token", loginResponse.data.token);
      navigate("/");
    } catch (err) {
      err.response.data.msg && setError(err.response.data.msg);
    }
  };
  return (
    <div
      className="d-flex align-items-center justify-content-center"
      style={{ height: "90vh" }}
    >
      <div className="card p-3 w-50">
        <h2>Register</h2>
        {error && (
          <ErrorNotice message={error} clearError={() => setError(undefined)} />
        )}
        <form onSubmit={submit}>
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input
              type="email"
              className="form-control"
              id="email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              type="password"
              className="form-control"
              id="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="passwordCheck">Confirm password:</label>
            <input
              type="password"
              className="form-control"
              id="passwordCheck"
              onChange={(e) => setPasswordCheck(e.target.value)}
            />
          </div>
          <div className="form-group">
            <label htmlFor="displayName">Display name:</label>
            <input
              type="text"
              className="form-control"
              id="displayName"
              onChange={(e) => setDisplayName(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-primary w-100 mt-4">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}
export default Register;

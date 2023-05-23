import React, { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import axios from "axios";
import Header from "./components/layout/Header";
import Home from "./components/pages/Home";
import Register from "./components/auth/Register";
import Login from "./components/auth/Login";
import UserContext from "./context/userContext";
import "./App.css";
import Values from "./components/pages/Values";
import Profile from "./components/pages/Profile";
import Map from "./components/pages/Map";
import Graph from "./components/pages/Graph";

function App() {
  // UserContext initial state
  const [userData, setUserData] = useState({
    token: undefined,
    user: undefined,
  });

  // UseEffect ob prvem renderju strani - Pogleda ali je v localStorage shranjen JWT. Če ja ga validira in pridobi podatke userja vezanega na ta token
  useEffect(() => {
    const checkLoggedIn = async () => {
      let token = localStorage.getItem("auth-token");
      if (token === null) {
        localStorage.setItem("auth-token", "");
        token = "";
      }
      const tokenResponse = await axios.post(
        "http://localhost:3001/users/tokenIsValid",
        null,
        { headers: { "x-auth-token": token } }
      );
      if (tokenResponse.data) {
        const userRes = await axios.get("http://localhost:3001/users/", {
          headers: { "x-auth-token": token },
        });
        setUserData({
          token,
          user: userRes.data,
        });
      }
    };
    checkLoggedIn();
  }, []);
  return (
    <BrowserRouter>
      <UserContext.Provider value={{ userData, setUserData }}>
        <Header />
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/values" element={<Values />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/map" element={<Map />} />
          <Route path="/graph" element={<Graph />} />
        </Routes>
      </UserContext.Provider>
    </BrowserRouter>
  );
}
export default App;

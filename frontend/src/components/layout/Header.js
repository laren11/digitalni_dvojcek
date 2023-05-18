import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../auth/AuthOptions";

// Header komponenta/navigacijska vrstica
function Header() {
  return (
    <header
      className="bg-dark"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <div style={{ display: "flex" }}>
        <Link to="/" style={{ textDecoration: "none", color: "orange" }}>
          <h1 className="p-2">Profityraj</h1>
        </Link>
        <div style={{ margin: "auto", marginLeft: "10%", display: "flex" }}>
          <Link
            to="/values"
            style={{
              textDecoration: "none",
              color: "orange",
            }}
          >
            <h5>Values</h5>
          </Link>
          <Link
            to="/sockets"
            style={{
              textDecoration: "none",
              color: "orange",
              paddingLeft: "10%",
            }}
          >
            <h5>Sockets</h5>
          </Link>
          <Link
            to="/profile"
            style={{
              textDecoration: "none",
              color: "orange",
              paddingLeft: "10%",
            }}
          >
            <h5>Profile</h5>
          </Link>
        </div>
      </div>

      <AuthOptions />
    </header>
  );
}

export default Header;

import React, { Component } from "react";
import { Link } from "react-router-dom";
import AuthOptions from "../auth/AuthOptions";
function Header() {
  return (
    <header
      className="bg-dark"
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Link to="/" style={{ textDecoration: "none", color: "orange" }}>
        <h1 className="p-2">Profityraj</h1>
      </Link>
      <AuthOptions />
    </header>
  );
}

export default Header;

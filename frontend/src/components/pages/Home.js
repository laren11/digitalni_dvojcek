import React, { useEffect, useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import UserContext from "../../context/userContext";
import {
  MDBBadge,
  MDBBtn,
  MDBTable,
  MDBTableHead,
  MDBTableBody,
} from "mdb-react-ui-kit";
import BasicTable from "../tables/BasicTable";
import { COLUMNS, VALUECOLUMNS } from "../../constants/Columns";

function Home(props) {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [cryptoData, setCryptoData] = useState(null);
  const [exchangeData, setExchangeData] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState("Coinbase");

  const fetchExchangeData = () => {
    fetch("http://localhost:3001/exchanges/")
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA: ", data);
        setExchangeData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const fetchCryptoData = () => {
    fetch("http://localhost:3001/prices/")
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA: ", data);
        setCryptoData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  const handleDropdownChange = (event) => {
    setSelectedExchange(event.target.value);
  };

  //Navigacija, glede na vrednost v UserContext
  useEffect(() => {
    if (userData.user) {
      navigate("/");
    }
  }, [userData]);

  useEffect(() => {
    fetchCryptoData();
    fetchExchangeData();
  }, []);

  useEffect(() => {
    console.log("EXCHANGE DATA: ", exchangeData);
    console.log("CRYPTO DATA: ", cryptoData);
  }, [exchangeData, cryptoData]);

  // Workflow test

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
      <div style={{ color: "white" }}></div>
      <div style={{ height: "200px" }}></div>
      <div>
        <select value={selectedExchange} onChange={handleDropdownChange}>
          <option value="Coinbase">Coinbase</option>
          <option value="Pexpay">Pexpay</option>
          <option value="Bithumb">Bithumb</option>
        </select>
        <BasicTable exchangeName={selectedExchange} columns={COLUMNS} />
      </div>
    </div>
  );
}
export default Home;

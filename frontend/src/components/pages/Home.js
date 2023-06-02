import React, { useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";
import BasicTable from "../tables/BasicTable";
import { COLUMNS, VALUECOLUMNS } from "../../constants/Columns";
import TableNoExchange from "../tables/TableNoExchange";
import { socket } from "../../socket.js";

function Home(props) {
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [cryptoData, setCryptoData] = useState(null);
  const [exchangeData, setExchangeData] = useState(null);
  const [selectedExchange, setSelectedExchange] = useState("Coinbase");
  const [topFiveData, setTopFiveData] = useState(null);

  useEffect(() => {
    socket.on("topFivePrices", (data) => {
      setTopFiveData(data);
    });

    socket.on("byExchange", (data) => {
      setExchangeData(data);
    });

    // Unsubscribe from the event when the component unmounts
    return () => {
      socket.off("topFivePrices");
      socket.off("byExchange");
    };
  }, []);

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
    // Call getTopFive to fetch the top five data
    socket.emit("getTopFive");
  }, []);

  useEffect(() => {
    socket.emit("getByExchange", selectedExchange); // Emit selectedExchange value to the socket
  }, [selectedExchange]);

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
      <TableNoExchange columns={VALUECOLUMNS} data={topFiveData} />
      <div style={{ height: "50px" }}></div>
      <div>
        <h1 className="title">All Exchanges</h1>
        <select
          value={selectedExchange}
          onChange={handleDropdownChange}
          style={{ marginLeft: "4.6vw" }}
        >
          <option value="Coinbase">Coinbase</option>
          <option value="Pexpay">Pexpay</option>
          <option value="Bithumb">Bithumb</option>
        </select>
        <BasicTable
          exchangeName={selectedExchange}
          columns={COLUMNS}
          data={exchangeData}
        />
      </div>
    </div>
  );
}
export default Home;

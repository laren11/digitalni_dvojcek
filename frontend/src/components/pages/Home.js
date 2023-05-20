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
      <div style={{ color: "white" }}>
        {/*         <MDBTable align="middle">
          <MDBTableHead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Title</th>
              <th scope="col">Status</th>
              <th scope="col">Position</th>
              <th scope="col">Actions</th>
            </tr>
          </MDBTableHead>
          <MDBTableBody>
            <tr>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src="https://mdbootstrap.com/img/new/avatars/8.jpg"
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">John Doe</p>
                    <p className="text-muted mb-0">john.doe@gmail.com</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">Software engineer</p>
                <p className="text-muted mb-0">IT department</p>
              </td>
              <td>
                <MDBBadge color="success" pill>
                  Active
                </MDBBadge>
              </td>
              <td>Senior</td>
              <td>
                <MDBBtn color="link" rounded size="sm">
                  Edit
                </MDBBtn>
              </td>
            </tr>
            <tr>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src="https://mdbootstrap.com/img/new/avatars/6.jpg"
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">Alex Ray</p>
                    <p className="text-muted mb-0">alex.ray@gmail.com</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">Consultant</p>
                <p className="text-muted mb-0">Finance</p>
              </td>
              <td>
                <MDBBadge color="primary" pill>
                  Onboarding
                </MDBBadge>
              </td>
              <td>Junior</td>
              <td>
                <MDBBtn color="link" rounded size="sm">
                  Edit
                </MDBBtn>
              </td>
            </tr>
            <tr>
              <td>
                <div className="d-flex align-items-center">
                  <img
                    src="https://mdbootstrap.com/img/new/avatars/7.jpg"
                    alt=""
                    style={{ width: "45px", height: "45px" }}
                    className="rounded-circle"
                  />
                  <div className="ms-3">
                    <p className="fw-bold mb-1">Kate Hunington</p>
                    <p className="text-muted mb-0">kate.hunington@gmail.com</p>
                  </div>
                </div>
              </td>
              <td>
                <p className="fw-normal mb-1">Designer</p>
                <p className="text-muted mb-0">UI/UX</p>
              </td>
              <td>
                <MDBBadge color="warning" pill>
                  Awaiting
                </MDBBadge>
              </td>
              <td>Senior</td>
              <td>
                <MDBBtn color="link" rounded size="sm">
                  Edit
                </MDBBtn>
              </td>
            </tr>
          </MDBTableBody>
        </MDBTable> */}
      </div>
      <div style={{ height: "200px" }}></div>
      <div>
        <select value={selectedExchange} onChange={handleDropdownChange}>
          <option value="Coinbase">Coinbase</option>
          <option value="Pexpay">Pexpay</option>
          <option value="Bithumb">Bithumb</option>
        </select>
        <BasicTable exchangeName={selectedExchange} />
      </div>
    </div>
  );
}
export default Home;

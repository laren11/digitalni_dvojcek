import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import placeholder from "../../photos/placeholder.png";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const Map = () => {
  const [ATMData, setATMData] = useState();

  const pin = new L.Icon({
    iconUrl: placeholder,
    iconRetinaUrl: placeholder,
    iconAnchor: [12.5, 20],
    popupAnchor: [0, -41],
    iconSize: [25, 25],
  });

  const fetcATMData = () => {
    fetch("http://localhost:3001/atms/")
      .then((response) => response.json())
      .then((data) => {
        console.log("DATA: ", data);
        setATMData(data);
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };

  useEffect(() => {
    fetcATMData();
  }, []);

  useEffect(() => {}, [ATMData]);

  return (
    <div>
      <div style={{ marginBottom: "10vh" }}>
        <h1 className="title">Where can you find crypto ATMs?</h1>
        <MapContainer
          center={[46.052228, 14.994386]}
          zoom={9}
          style={{ height: "800px", width: "100%", display: "flex" }}
          className="map"
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          {ATMData &&
            ATMData.map((atm) => (
              <Marker
                key={atm._id}
                position={[
                  atm.geolocation.coordinates[0],
                  atm.geolocation.coordinates[1],
                ]}
                icon={pin}
              >
                <Popup>{atm.address}</Popup>
              </Marker>
            ))}
        </MapContainer>
      </div>
    </div>
  );
};

export default Map;

import React, { useContext } from "react";
import UserContext from "../../context/userContext";

const Profile = () => {
  const { userData } = useContext(UserContext);
  console.log("USERDATA: ", userData);
  return (
    <div>
      {" "}
      <div className="background">
        <h1 className="title">Your profile</h1>
        <div style={{ color: "white", margin: "3%" }}>
          Display Name:{" "}
          {userData?.user?.displayName && userData?.user?.displayName}
        </div>
        <div style={{ height: "200px" }}></div>
      </div>
    </div>
  );
};

export default Profile;

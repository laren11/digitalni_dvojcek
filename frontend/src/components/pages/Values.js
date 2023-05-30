import React, { useEffect, useContext, useState } from "react";
import TableNoExchange from "../tables/TableNoExchange";
import { VALUECOLUMNS } from "../../constants/Columns";
import UserContext from "../../context/userContext";
import { socket } from "../../socket.js";

const Values = () => {
  const { userData } = useContext(UserContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    if (userData?.user?.id) {
      socket.on("userCryptos", (data) => {
        setData(data);
      });

      socket.emit("getUserCryptos", userData.user.id);
    }

    // Unsubscribe from the event when the component unmounts
    return () => {
      socket.off("userCryptos");
    };
  }, [userData?.user?.id]);

  if (!userData?.user?.id) {
    return null;
  }

  return (
    <div className="background">
      <h1 className="title">Your values</h1>
      {data.length > 0 ? (
        <TableNoExchange columns={VALUECOLUMNS} data={data} />
      ) : (
        <p style={{ color: "white" }}>You don't have any values selected.</p>
      )}
      <div style={{ height: "200px" }}></div>
    </div>
  );
};

export default Values;

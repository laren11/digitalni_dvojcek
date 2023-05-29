import React, { useEffect, useContext, useState } from "react";
import TableNoExchange from "../tables/TableNoExchange";
import { VALUECOLUMNS } from "../../constants/Columns";
import UserContext from "../../context/userContext";
import { socket } from "../../socket.js";

const Values = () => {
  const { userData } = useContext(UserContext);
  const [data, setData] = useState([]);

  useEffect(() => {
    socket.on("userCryptos", (data) => {
      setData(data);
    });

    // Unsubscribe from the event when the component unmounts
    return () => {
      socket.off("userCryptos");
    };
  }, []);

  useEffect(() => {
    socket.emit("getUserCryptos", userData?.user.id);
  }, []);

  return (
    <div className="background">
      <h1 className="title">Your values</h1>
      {userData?.user?.id && (
        <TableNoExchange columns={VALUECOLUMNS} data={data} />
      )}

      <div style={{ height: "200px" }}></div>
    </div>
  );
};

export default Values;

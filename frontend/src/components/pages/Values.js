import React, { useEffect, useContext, useState } from "react";
import TableNoExchange from "../tables/TableNoExchange";
import { VALUECOLUMNS } from "../../constants/Columns";
import UserContext from "../../context/userContext";

const Values = () => {
  const { userData } = useContext(UserContext);

  return (
    <div className="background">
      <h1 className="title">Your values</h1>
      {userData?.user?.id && (
        <TableNoExchange
          columns={VALUECOLUMNS}
          request={` http://localhost:3001/prices/getUserPrices/${userData?.user.id}`}
        />
      )}

      <div style={{ height: "200px" }}></div>
    </div>
  );
};

export default Values;

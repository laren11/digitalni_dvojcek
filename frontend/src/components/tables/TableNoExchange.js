import React, { useMemo, useState, useEffect, useContext } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import "../../styles/table.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";
import StarBorderPurple500OutlinedIcon from "@mui/icons-material/StarBorderPurple500Outlined";
import StarIcon from "@mui/icons-material/Star";

function TableNoExchange(props) {
  const [data, setData] = useState([]);
  //const [data, setData] = useState(props.topFiveData || []);
  const { userData } = useContext(UserContext);
  const navigate = useNavigate();
  const [savedPairs, setSavedPairs] = useState([]);

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch(props.request)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
    console.log(data);
  }, []);

  useEffect(() => {
    if (userData?.user) {
      getSavedCryptoPairs();
    }
  }, [userData]);

  useEffect(() => {
    console.log("SAVED PAIRS: ", savedPairs);
  }, [savedPairs]);

  function getSavedCryptoPairs() {
    fetch("http://localhost:3001/users/getSaved", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID: userData?.user?.id }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response data
        setSavedPairs(data);
      })
      .catch((error) => {
        // Handle any errors
        console.error(error);
      });
  }

  /* useEffect(() => {
    // Update the data state when topFiveData prop changes
    setData(props.topFiveData || []);
  }, [props.topFiveData]); */

  const viewGraph = (row, event) => {
    // Check if the click event came from the "Add" button
    if (
      event.target.classList.contains("addCrypto") ||
      event.target.closest(".addCrypto")
    ) {
      return;
    }

    const value = row.values.cryptocurrency;
    const exchange = row.values.exchange;
    navigate("/graph?value=" + value + "&exchange=" + exchange);
  };

  const addUserCrypto = (cryptoName, exchangeName) => {
    // Make a POST request to the server
    fetch("http://localhost:3001/users/addUserCrypto", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        cryptoName,
        exchangeName,
        user: userData?.user,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        // Handle the response from the server
        console.log("Add User Crypto Response:", data);
        getSavedCryptoPairs();
        // Perform any additional actions or update the UI as needed
      })
      .catch((error) => console.error(error));
  };

  function checkIfCryptoSaved(row) {
    const isExchangeIdPresent = savedPairs?.some(
      (cryptoPair) =>
        cryptoPair.cryptoId.name === row.values.cryptocurrency &&
        cryptoPair.exchangeId.name === row.values.exchange
    );

    return isExchangeIdPresent;
  }

  const tableInstance = useTable(
    {
      columns: useMemo(() => {
        const ColumnFilter = ({ column }) => {
          const { filterValue, setFilter } = column;

          return (
            <input
              value={filterValue || ""}
              onChange={(e) => setFilter(e.target.value)}
              placeholder="Search..."
            />
          );
        };

        const NumberRangeColumnFilter = ({ column }) => {
          const { filterValue = [], setFilter } = column;

          const handleChangeMin = (e) => {
            const value =
              e.target.value === "" ? undefined : parseFloat(e.target.value);
            setFilter((prev) => [
              value !== 0 ? value : 0,
              prev ? prev[1] : undefined,
            ]);
          };

          const handleChangeMax = (e) => {
            const value =
              e.target.value === "" ? undefined : parseFloat(e.target.value);
            setFilter((prev) => [
              prev ? prev[0] : undefined,
              value !== 0 ? value : 0,
            ]);
          };

          return (
            <div>
              <input
                type="number"
                value={filterValue[0] || ""}
                onChange={handleChangeMin}
                placeholder="Min"
              />
              <input
                type="number"
                value={filterValue[1] || ""}
                onChange={handleChangeMax}
                placeholder="Max"
              />
            </div>
          );
        };

        return props.columns.map((column) => {
          if (
            column.accessor === "cryptocurrency" ||
            column.accessor === "exchange"
          ) {
            return {
              ...column,
              Filter: ColumnFilter, // Use ColumnFilter component for cryptocurrency column
            };
          } else {
            return {
              ...column,
              Filter: NumberRangeColumnFilter, // Use NumberRangeColumnFilter component for other columns
              filter: "numberRange",
            };
          }
        });
      }, []),
      data,
      filterTypes: {
        text: (rows, id, filterValue) => {
          return rows.filter((row) => {
            const rowValue = row.values[id];
            return rowValue !== undefined
              ? String(rowValue)
                  .toLowerCase()
                  .startsWith(String(filterValue).toLowerCase())
              : true;
          });
        },
        numberRange: (rows, id, filterValue) => {
          const [min, max] = filterValue;

          return rows.filter((row) => {
            const rowValue = parseFloat(row.values[id]);
            if (isNaN(rowValue)) {
              return false; // Skip rows with non-numeric values
            }
            if (min !== undefined && rowValue < min) {
              return false; // Skip rows with values less than the minimum
            }
            if (max !== undefined && rowValue > max) {
              return false; // Skip rows with values greater than the maximum
            }
            return true;
          });
        },
      },
    },
    useFilters,
    useSortBy
  );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    <table {...getTableProps()} style={{ width: "90vw", margin: "auto" }}>
      {/* Table Header */}
      <thead>
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()}>
            {headerGroup.headers.map((column) => (
              <th>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <span
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                  >
                    {column.render("Header")}
                  </span>
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <img
                        draggable="false"
                        role="img"
                        className="emoji"
                        alt="🔽"
                        src="https://s.w.org/images/core/emoji/14.0.0/svg/1f53d.svg"
                        style={{ marginLeft: "0.25rem" }}
                      />
                    ) : (
                      <img
                        draggable="false"
                        role="img"
                        className="emoji"
                        alt="🔼"
                        src="https://s.w.org/images/core/emoji/14.0.0/svg/1f53c.svg"
                        style={{ marginLeft: "0.25rem" }}
                      />
                    )
                  ) : null}
                  <div>{column.canFilter ? column.render("Filter") : null}</div>
                </div>
              </th>
            ))}
          </tr>
        ))}
      </thead>

      {/* Table Body */}
      <tbody {...getTableBodyProps()}>
        {rows.map((row) => {
          prepareRow(row);
          return (
            <tr
              {...row.getRowProps()}
              onClick={(event) => viewGraph(row, event)}
            >
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()}>
                    {cell.column.id === "cryptocurrency" && userData?.user ? (
                      <>
                        <span>{cell.render("Cell")}</span>
                        <a
                          onClick={(e) => {
                            e.preventDefault();
                            addUserCrypto(
                              row.original.cryptocurrency,
                              row.values.exchange
                            );
                          }}
                          className="addCrypto"
                        >
                          {checkIfCryptoSaved(row) ? (
                            <StarIcon />
                          ) : (
                            <StarBorderPurple500OutlinedIcon />
                          )}
                        </a>
                      </>
                    ) : cell.column.id === "change" ? (
                      cell.row.values["change"] !== null &&
                      cell.row.values["change"] !== undefined ? (
                        <span
                          style={{
                            color:
                              parseFloat(cell.row.values["change"]) > 0
                                ? "green"
                                : parseFloat(cell.row.values["change"]) < 0
                                ? "red"
                                : "inherit",
                          }}
                        >
                          &euro;{cell.render("Cell")}
                          {parseFloat(cell.row.values["change"]) < 0 && (
                            <i className="bi bi-arrow-down-right" />
                          )}
                          {parseFloat(cell.row.values["change"]) > 0 && (
                            <i className="bi bi-arrow-up-right" />
                          )}
                        </span>
                      ) : (
                        <span>No previous price data</span>
                      )
                    ) : cell.column.id === "changePercentage" ? (
                      cell.row.values["changePercentage"] !== null &&
                      cell.row.values["changePercentage"] !== undefined ? (
                        <span
                          style={{
                            color:
                              parseFloat(cell.row.values["changePercentage"]) >
                              0
                                ? "green"
                                : parseFloat(
                                    cell.row.values["changePercentage"]
                                  ) < 0
                                ? "red"
                                : "inherit",
                          }}
                        >
                          {cell.render("Cell")}%
                          {parseFloat(cell.row.values["changePercentage"]) <
                            0 && <i className="bi bi-arrow-down-right" />}
                          {parseFloat(cell.row.values["changePercentage"]) >
                            0 && <i className="bi bi-arrow-up-right" />}
                        </span>
                      ) : (
                        <span>No previous price data</span>
                      )
                    ) : (
                      cell.render("Cell")
                    )}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default TableNoExchange;

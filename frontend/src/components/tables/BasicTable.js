import React, { useMemo, useState, useEffect, useContext } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import "../../styles/table.css";
import { useNavigate } from "react-router-dom";
import UserContext from "../../context/userContext";

function BasicTable(props) {
  const [data, setData] = useState([]);
  const { userData } = useContext(UserContext);
  const exchange = props.exchangeName;
  const navigate = useNavigate();

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch(`http://localhost:3001/prices/getLatestPrices/${exchange}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
    console.log(data);
  }, [exchange]);

  const viewGraph = (row, event) => {
    // Check if the click event came from the "Add" button
    if (
      event.target.classList.contains("addCrypto") ||
      event.target.closest(".addCrypto")
    ) {
      return;
    }

    const value = row.values.cryptocurrency;
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
        // Perform any additional actions or update the UI as needed
      })
      .catch((error) => console.error(error));
  };

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
          if (column.accessor === "cryptocurrency") {
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
    <table {...getTableProps()}>
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
                          href="#"
                          onClick={(e) => {
                            e.preventDefault();
                            addUserCrypto(
                              row.original.cryptocurrency,
                              exchange
                            );
                          }}
                          className="addCrypto"
                        >
                          <i
                            className="bi bi-plus-circle clickable"
                            title="Add"
                          ></i>
                        </a>
                      </>
                    ) : cell.column.id === "price" ? (
                      <span>&euro;{cell.render("Cell")}</span>
                    ) : cell.column.id === "change" ? (
                      cell.row.values["change"] !== null &&
                      cell.row.values["change"] !== undefined ? (
                        <span>&euro;{cell.render("Cell")}</span>
                      ) : (
                        <span>No previous price data</span>
                      )
                    ) : cell.column.id === "changePercentage" ? (
                      cell.row.values["changePercentage"] !== null &&
                      cell.row.values["changePercentage"] !== undefined ? (
                        <span>{cell.render("Cell")}%</span>
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

export default BasicTable;

import React, { useMemo, useState, useEffect } from "react";
import { useTable, useSortBy, useFilters } from "react-table";
import { COLUMNS } from "../../constants/Columns";
import "../../styles/table.css";

function BasicTable(props) {
  const [data, setData] = useState([]);
  const exchange = props.exchangeName;

  useEffect(() => {
    // Fetch data from the API endpoint
    fetch(`http://localhost:3001/prices/${exchange}`)
      .then((response) => response.json())
      .then((data) => setData(data))
      .catch((error) => console.error(error));
  }, [exchange]);

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
            setFilter((prev) => [value, prev ? prev[1] : undefined]);
          };

          const handleChangeMax = (e) => {
            const value =
              e.target.value === "" ? undefined : parseFloat(e.target.value);
            setFilter((prev) => [prev ? prev[0] : undefined, value]);
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

        return COLUMNS.map((column) => {
          if (column.accessor === "cryptocurrency") {
            return {
              ...column,
              Filter: ColumnFilter, // Use ColumnFilter component for cryptocurrency column
            };
          } else {
            return {
              ...column,
              Filter: NumberRangeColumnFilter, // Use NumberRangeColumnFilter component for other columns
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
            <tr {...row.getRowProps()}>
              {row.cells.map((cell) => {
                return <td {...cell.getCellProps()}>{cell.render("Cell")}</td>;
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
}

export default BasicTable;

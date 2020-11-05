import React from "react";
import { useTable, useSortBy, Column } from "react-table";
import { FaSort, FaSortUp, FaSortDown } from "react-icons/fa";

interface Props {
  columns: Column<{}>[];
  data: {}[];
  caption: string;
}
export const Table: React.FC<Props> = ({ columns, data, caption }) => {
  // Use the state and functions returned from useTable to build your UI
  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    rows,
    prepareRow,
  } = useTable(
    {
      columns,
      data,
    },
    useSortBy
  );

  // Render the UI for your table
  return (
    <table
      {...getTableProps()}
      className="au-table au-table--striped metric-table"
    >
      <caption className="au-table__caption font-weight-500">{caption}</caption>
      <thead className="au-table__head">
        {headerGroups.map((headerGroup) => (
          <tr {...headerGroup.getHeaderGroupProps()} className="au-table__row">
            {headerGroup.headers.map((column) => (
              // Add the sorting props to control sorting. For this example
              // we can add them into the header props
              <th
                {...column.getHeaderProps(column.getSortByToggleProps())}
                className={`au-table__header`}
              >
                <span className="align-right">
                  {column.isSorted ? (
                    column.isSortedDesc ? (
                      <FaSortDown />
                    ) : (
                      <FaSortUp />
                    )
                  ) : !column.disableSortBy ? (
                    <span>
                      <FaSort />
                    </span>
                  ) : (
                    ""
                  )}
                </span>
                <>{column.render("Header")}</>

                {/* Add a sort direction indicator */}
              </th>
            ))}
          </tr>
        ))}
      </thead>
      <tbody {...getTableBodyProps()} className="au-table__body">
        {rows.map((row, i) => {
          prepareRow(row);
          return (
            <tr {...row.getRowProps()} className="au-table__row">
              {row.cells.map((cell) => {
                return (
                  <td {...cell.getCellProps()} className="au-table__cell">
                    {cell.render("Cell")}
                  </td>
                );
              })}
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};

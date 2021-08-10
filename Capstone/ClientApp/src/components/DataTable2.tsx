import React, { useMemo } from "react";
import {
  Column,
  PluginHook,
  TableOptions,
  useFlexLayout,
  useTable,
} from "react-table";
import style from "../stylesheets/DataTable2.module.css";

interface IProp {
  columns: Column<any>[];
  data: any[];
  plugins?: PluginHook<object>[];
}

const DataTable2 = (props: IProp) => {
  const internalData = useMemo(() => props.data, [props.data]);
  const internalColumns = useMemo(() => props.columns, [props.columns]);
  const internalPlugins =
    props.plugins && props.plugins.filter((x) => Object.keys(x).length > 0);

  // const columns = React.useMemo<Column<{ col1: string; col2: string }>[]>(
  //   () => [
  //     {
  //       Header: "Column 1",
  //       accessor: "col1", // accessor is the "key" in the data
  //     },
  //     {
  //       Header: "Column 2",
  //       accessor: "col2",
  //     },
  //   ],
  //   []
  // );
  console.log(props.plugins);

  const args: [TableOptions<{}>, any] = [
    {
      columns: internalColumns,
      data: internalData,
    },
    useFlexLayout,
  ];

  if (internalPlugins && internalPlugins.length > 0) {
    internalPlugins.forEach((i) => args.push(i));
  }

  const tableInstance = useTable.apply(this, args);

  // const tableInstance = useTable(
  //   {
  //     columns: internalColumns,
  //     data: internalData,
  //   },
  //   useFlexLayout,
  //   ...plugins
  // );

  const { getTableProps, getTableBodyProps, headerGroups, rows, prepareRow } =
    tableInstance;

  return (
    // apply the table props
    <div className={[style.container, "block", "max-w-full"].join(" ")}>
      <table
        className={["border-collapse", "w-full"].join(" ")}
        {...getTableProps()}
      >
        <thead>
          {
            // Loop over the header rows
            headerGroups.map((headerGroup) => (
              // Apply the header row props
              <tr {...headerGroup.getHeaderGroupProps()}>
                {
                  // Loop over the headers in each row
                  headerGroup.headers.map((column) => (
                    // Apply the header cell props
                    <th {...column.getHeaderProps()}>
                      {
                        // Render the header
                        column.render("Header")
                      }
                    </th>
                  ))
                }
              </tr>
            ))
          }
        </thead>
        {/* Apply the table body props */}
        <tbody {...getTableBodyProps()}>
          {
            // Loop over the table rows
            rows.map((row) => {
              // Prepare the row for display
              prepareRow(row);
              return (
                // Apply the row props
                <tr {...row.getRowProps()}>
                  {
                    // Loop over the rows cells
                    row.cells.map((cell) => {
                      // Apply the cell props
                      return (
                        <td {...cell.getCellProps()}>
                          {
                            // Render the cell contents
                            cell.render("Cell")
                          }
                        </td>
                      );
                    })
                  }
                </tr>
              );
            })
          }
        </tbody>
      </table>
    </div>
  );
};

export default DataTable2;

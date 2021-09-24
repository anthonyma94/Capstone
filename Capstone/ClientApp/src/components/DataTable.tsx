// https://github.com/jbetancur/react-data-table-component

import React, { MouseEventHandler, useEffect, useMemo, useState } from "react";
import Table, { Direction, TableProps } from "react-data-table-component";
import "../stylesheets/DataTable.css";

const DataTable = (props: TableProps) => {
  const [internalProps, setInternalProps] = useState<TableProps>({
    columns: [],
    data: [],
  });

  const column = useMemo(
    () =>
      props.columns.map((column) => {
        let col = column;
        if (column.selector && typeof column.selector === "string") {
          let selector = column.selector;
          col = {
            ...col,
            selector: (row) => row[selector],
          };
        }
        if (column.sortable === undefined) {
          col = {
            ...col,
            sortable: true,
          };
        }
        return col;
      }),
    [props.columns]
  );

  const data = useMemo(() => props.data, [props.data]);

  const validateProps = () => {
    const tmp = Object.assign({}, props);

    if (!tmp.pagination) tmp.pagination = Boolean(tmp.data.length > 10);

    setInternalProps(tmp);
  };

  useEffect(validateProps, [props]);

  return <Table {...internalProps} columns={column} data={data} />;
};

export default DataTable;

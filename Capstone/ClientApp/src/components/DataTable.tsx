// https://github.com/jbetancur/react-data-table-component

import React, { useState } from "react";
import Table, {
  RowRecord,
  TableColumn,
  TableProps,
} from "react-data-table-component";

const DataTable = (props: TableProps) => {
  const [internalProps, setInternalProps] = useState<TableProps>(props);
  // setInternalProps({ ...internalProps, pagination: true });
  function selectorColumns(columns: TableColumn<RowRecord>[]) {
    return columns.map((column) => {
      let col = column;
      if (column.selector && typeof column.selector === "string") {
        let selector = column.selector;
        col = {
          ...col,
          selector: (row) => row[selector],
        };
      }
      return col;
    });
  }
  return (
    <Table pagination {...props} columns={selectorColumns(props.columns)} />
  );
};

export default DataTable;

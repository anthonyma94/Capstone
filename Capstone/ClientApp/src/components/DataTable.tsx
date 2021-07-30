// https://github.com/jbetancur/react-data-table-component

import React, { MouseEventHandler, useEffect, useState } from "react";
import Table, { TableProps } from "react-data-table-component";

const DataTable = (props: TableProps) => {
  const [internalProps, setInternalProps] = useState<TableProps>(props);

  const validateProps = () => {
    const tmp = Object.assign({}, props);

    tmp.columns = tmp.columns.map((column) => {
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
    });

    if (!tmp.pagination) tmp.pagination = Boolean(tmp.data.length > 10);

    setInternalProps(tmp);
  };

  useEffect(validateProps, [props]);

  const SelectedComponent = React.forwardRef(
    ({ onClick, ...rest }: { onClick: MouseEventHandler }, ref) => {
      return (
        <>
          <label
            onClick={(e) => {
              console.log(e);
              onClick(e);
            }}
          >
            Hello
          </label>
        </>
      );
    }
  );

  return <Table {...internalProps} />;
};

export default DataTable;

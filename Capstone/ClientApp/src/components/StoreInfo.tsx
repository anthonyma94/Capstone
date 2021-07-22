import React from "react";
import DataTable from "./DataTable";
import Layout from "./Layout";

const StoreInfo = () => {
  const ruleColumns = [
    {
      name: "Day/Date",
      selector: "day",
    },
    {
      name: "Start",
      selector: "start",
    },
    {
      name: "End",
      selector: "end",
    },
    {
      name: "Employees",
      selector: "employees",
    },
    {
      name: "Total Billed Hours",
      selector: "totalHours",
    },
  ];

  const titleColumns = [
    {
      name: "Role",
      selector: "role",
    },
    {
      name: "Number of Employees",
      selector: "numOfEmps",
    },
  ];

  const titleData = [
    { role: "Stock", numOfEmps: 5 },
    { role: "Sales", numOfEmps: 10 },
  ];

  return (
    <Layout>
      <>
        <h1>Store Hours</h1>
        <hr />
        <h1>Job Titles</h1>
        <DataTable columns={titleColumns} data={titleData} />
      </>
    </Layout>
  );
};

export default StoreInfo;

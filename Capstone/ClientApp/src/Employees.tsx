import { Button } from "react-bootstrap";
import Layout from "./components/Layout";
import Table from "./components/DataTable";
import "./stylesheets/Employees.scss";
import { RowRecord, TableColumn } from "react-data-table-component";

interface Data {
  firstName: string;
  lastName: string;
  role: string;
  jobTitle: string;
  availability: string;
  maxHours: number;
}

const columns: TableColumn<RowRecord>[] = [
  {
    name: "First Name",
    selector: "firstName",
  },
  {
    name: "Last Name",
    selector: "lastName",
  },
  {
    name: "Role",
    selector: "role",
  },
  {
    name: "Job Title",
    selector: "jobTitle",
  },
  {
    name: "Availability",
    selector: "availability",
  },
  {
    name: "Max Hours",
    selector: "maxHours",
  },
];

const data = [
  {
    firstName: "Jack",
    lastName: "Dorsey",
    role: "FT",
    jobTitle: "dev",
    availability: "always",
    maxHours: 40,
    key: 1,
  },
];

const Employees = () => {
  return (
    <Layout>
      <>
        <div className="d-flex justify-content-between">
          <h1>Employees</h1>
          <Button href="/newEmployee">Create New</Button>
        </div>
        <Table columns={columns} data={data} />
      </>
    </Layout>
  );
};

export default Employees;

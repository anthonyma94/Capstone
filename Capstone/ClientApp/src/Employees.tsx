import Layout from "./components/Layout";
import Table from "./components/DataTable";
import axios from "./services/axios";
import { RowRecord, TableColumn } from "react-data-table-component";
import IPerson from "./interfaces/Person";
import { useEffect, useState } from "react";
import IJobTitle from "./interfaces/JobTitle";
import Button from "./components/Button";

// interface Data {
//   firstName: string;
//   lastName: string;
//   role: string;
//   jobTitle: string;
//   availability: string;
//   maxHours: number;
// }

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
    selector: "maxWeeklyHours",
  },
];

const Employees = () => {
  const [data, setData] = useState<IPerson[]>([]);
  useEffect(() => {
    let mounted = true;

    axios
      .get("/people")
      .then((res) => {
        if (mounted) {
          const data = (res.data as IPerson[]).map((person) => {
            let job = person.jobTitle;
            if (typeof job !== "string") {
              job = (person.jobTitle as IJobTitle).name;
            }
            return {
              ...person,
              jobTitle: job,
            };
          });

          setData(data);
        }
      })
      .catch((err) => console.error(err));

    return () => {
      mounted = false;
    };
  }, []);
  return (
    <Layout>
      <div className="flex justify-between">
        <h1>Employees</h1>
        <Button href="/newEmployee">Create New</Button>
      </div>
      <Table
        selectableRows
        selectableRowsNoSelectAll
        selectableRowsHighlight
        columns={columns}
        data={data}
      />
    </Layout>
  );
};

export default Employees;

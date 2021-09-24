import Layout from "../components/Layout";
import Table from "../components/DataTable";
import axios from "../services/axios";
import { RowRecord, TableColumn } from "react-data-table-component";
import IPerson, { fetchPeople, selectPeople } from "../models/person";
import { useEffect, useState, forwardRef, MouseEventHandler } from "react";
import IJobTitle from "../models/jobTitle";
import Button from "../components/Button";
import { useDispatch, useSelector } from "../services/hooks";
import DataTable2 from "../components/DataTable2";
import { usePagination } from "react-table";
import React from "react";

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

  // Initialize redux states
  const dispatch = useDispatch();
  const people = useSelector(selectPeople);

  const SelectedButton = React.forwardRef(
    (
      { onClick, ...rest }: { onClick: MouseEventHandler },
      ref: React.ForwardedRef<any>
    ) => {
      return (
        <>
          <Button
            onClick={(e) => {
              onClick(e);
            }}
          >
            Details
          </Button>
        </>
      );
    }
  );

  // Populate data from API
  useEffect(() => {
    if (people.status === "idle") dispatch(fetchPeople());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return (
    <Layout>
      <div className="flex justify-between">
        <h1>Employees</h1>
        <Button href="/newEmployee">Create New</Button>
      </div>
      <Table
        columns={columns}
        data={people.data.map((person) => {
          return {
            ...person,
            jobTitle: person.jobTitle.name,
          };
        })}
        onSelectedRowsChange={(selected) =>
          (window.location.href = `/employee/${selected.selectedRows[0].id}`)
        }
        selectableRows
        selectableRowsComponent={SelectedButton}
        selectableRowsNoSelectAll
      />
    </Layout>
  );
};

export default Employees;

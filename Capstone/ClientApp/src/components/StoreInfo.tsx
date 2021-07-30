import { AxiosRequestConfig } from "axios";
import React, { useEffect, useState } from "react";
import IJobTitle from "../interfaces/JobTitle";
import IPerson from "../interfaces/Person";
import IStore from "../interfaces/Store";
import axios from "../services/axios";
import Button from "./Button";
import DataTable from "./DataTable";
import Input from "./Input";
import Layout from "./Layout";

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

interface IJobTitleData {
  id: string;
  role: string;
  numOfEmps: number;
}
const StoreInfo = () => {
  const [jobTitleData, setJobTitleData] = useState<IJobTitleData[]>([]);
  const [storeName, setStoreName] = useState("");
  const [store, setStore] = useState<IStore>();

  const asyncOpts: () => AxiosRequestConfig = () => {
    const data: any = {
      name: storeName,
    };
    if (store) {
      data.id = store.id;
    }
    return {
      url: `/stores${store ? "/" + store.id : ""}`,
      method: store ? "put" : "post",
      data,
    };
  };

  useEffect(() => {
    if (store) {
      setStoreName(store.name);
    }
  }, [store]);

  useEffect(() => {
    let mounted = true;

    axios.get("/stores").then((res) => {
      if (res.data && res.data.length > 0) {
        setStore(res.data[0]);
      }
    });

    axios
      .get("/jobtitle")
      .then((res) => {
        const titles = res.data as IJobTitle[];
        axios
          .get("/people")
          .then((resp) => {
            const people = resp.data as IPerson[];
            const data: IJobTitleData[] = titles.map((item) => {
              return {
                id: item.id,
                role: item.name,
                numOfEmps: people.filter(
                  (person) => (person.jobTitle as IJobTitle).id === item.id
                ).length,
              };
            });
            setJobTitleData(data);
          })
          .catch((err) => console.error(err));
      })
      .catch((err) => console.error(err));

    return () => {
      mounted = false;
    };
  }, []);

  // const titleData = [
  //   { role: "Stock", numOfEmps: 5 },
  //   { role: "Sales", numOfEmps: 10 },
  // ];

  return (
    <Layout>
      <div className="flex justify-around gap-4">
        <div className=" w-64">
          <h1>Store Name</h1>
          <div className="flex justify-start max-w-lg gap-3">
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <Button
              asyncOpts={asyncOpts()}
              asyncCallback={(res) => setStore(res.data)}
            >
              Save
            </Button>
          </div>
        </div>
        <div>
          <div className="flex justify-around">
            <h1>Store Hours</h1>
            <Button>Save</Button>
          </div>
          <table className="table-fixed w-full max-w-sm">
            <thead>
              <tr>
                <th>Open</th>
                <th>Close</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <th>Sunday</th>
                <td>
                  {/* <Input placeholder="9:00 AM" showLabel={false} /> */}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      <hr />
      <h1>Job Titles</h1>
      <DataTable
        defaultSortFieldId={"role"}
        columns={titleColumns}
        data={jobTitleData}
      />
    </Layout>
  );
};

export default StoreInfo;

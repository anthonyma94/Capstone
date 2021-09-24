import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "../services/hooks";
import {
  changeHours,
  changeStoreName,
  fetchStore,
  selectStore,
} from "../models/store";
import Button from "../components/Button";
import DataTable from "../components/DataTable";
import Input from "../components/Input";
import Layout from "../components/Layout";
import {
  addJobTitle,
  fetchJobTitles,
  selectJobTitles,
} from "../models/jobTitle";
import { fetchPeople, selectPeople } from "../models/person";
import DataTableMenu from "../components/DataTableMenu";
import notify from "../services/notify";
import DataTable2 from "../components/DataTable2";

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

const initialStoreHours = [
  {
    start: "",
    end: "",
  },
  {
    start: "",
    end: "",
  },
  {
    start: "",
    end: "",
  },
  {
    start: "",
    end: "",
  },
  {
    start: "",
    end: "",
  },
  {
    start: "",
    end: "",
  },
  {
    start: "",
    end: "",
  },
];

const dayNames = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

const StoreInfo = () => {
  // Initialize page states
  const [storeName, setStoreName] = useState("");
  const [storeHours, setStoreHours] =
    useState<{ start: string; end: string }[]>(initialStoreHours);
  const [initialLoad, setInitialLoad] = useState(true);
  const [validStoreHours, setValidStoreHours] = useState(true);
  const [newJobTitle, setNewJobTitle] = useState("");

  // Initialize redux states
  const dispatch = useDispatch();
  const store = useSelector(selectStore);
  const jobTitles = useSelector(selectJobTitles);
  const people = useSelector(selectPeople);

  // Methods section

  // Checks if index exists in array and sets hours
  // Creates empty items if index doesn't exist
  const changeStoreHours = (
    type: "start" | "end",
    index: number,
    value: string
  ) => {
    const tmp = storeHours;
    if (!tmp[index]) {
      const lastIndex = tmp.length - 1;
      for (let i = 0; i < index - lastIndex; i++)
        tmp.push({ start: "", end: "" });
    }
    tmp[index][type] = value;
    setStoreHours(tmp);
  };

  // Checks each store hour for validity, submits to API if all valid
  const submitStoreHours = () => {
    let valid = true;
    for (const item of storeHours) {
      if (
        (item.start && !item.end) ||
        (item.end && !item.start) ||
        (item.start && item.end && item.start >= item.end)
      ) {
        valid = false;
        break;
      }
    }

    if (valid) {
      dispatch(changeHours({ storeId: store.data.id, data: storeHours }));
    }
    setValidStoreHours(valid);
  };

  // useEffect section

  // Populate data from API
  useEffect(() => {
    if (store.status === "idle") dispatch(fetchStore());
    if (jobTitles.status === "idle") dispatch(fetchJobTitles());
    if (people.status === "idle") dispatch(fetchPeople());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Set load status when API is successful
  useEffect(() => {
    if (
      store.status === "success" &&
      jobTitles.status === "success" &&
      people.status === "success"
    )
      setInitialLoad(false);
  }, [store.status, jobTitles.status, people.status]);

  // Sets store name if redux state changes
  useEffect(() => {
    setStoreName(store.data.name);
  }, [store.data.name]);

  // Sets store hours if redux state changes
  useEffect(() => {
    if (store.data.storeHours.length > 0) {
      const hours = initialStoreHours.map((item, index) => {
        const hour = store.data.storeHours.find(
          (item) => item.day.day === index
        );
        if (hour) {
          return {
            start: hour.day.start,
            end: hour.day.end,
            id: hour.day.id,
          };
        }
        return item;
      });
      setStoreHours(hours);
    }
  }, [store.data.storeHours]);

  return (
    <Layout loading={initialLoad}>
      <div className="flex justify-around gap-4">
        <div className="w-64">
          <h1>Store Name</h1>
          <div className="flex justify-start max-w-lg gap-3">
            <Input
              value={storeName}
              onChange={(e) => setStoreName(e.target.value)}
            />
            <Button
              loadingCondition={store.status === "loading"}
              onClick={() =>
                dispatch(
                  changeStoreName({ id: store.data.id, name: storeName })
                )
              }
            >
              Save
            </Button>
          </div>
        </div>
        <div>
          <div className="flex justify-around">
            <h1>Store Hours</h1>
            <Button
              loadingCondition={store.status === "loading"}
              onClick={submitStoreHours}
            >
              Save
            </Button>
          </div>
          {!validStoreHours && (
            <span className="text-red-400">
              Some of your hours are invalid. Please check and fix them.
            </span>
          )}
          <table className="table-fixed w-full max-w-sm">
            <thead>
              <tr>
                <th></th>
                <th>Open</th>
                <th>Close</th>
              </tr>
            </thead>
            <tbody>
              {dayNames.map((day, index) => {
                return (
                  <tr key={day}>
                    <th>{day}</th>
                    <td>
                      <Input
                        placeholder="9:00"
                        value={
                          (storeHours[index] && storeHours[index].start) ||
                          undefined
                        }
                        onChange={(e) =>
                          changeStoreHours("start", index, e.target.value)
                        }
                        mask={/\d{1,2}:\d{2}/}
                        showLabel={false}
                      />
                    </td>
                    <td>
                      <Input
                        placeholder="18:00"
                        value={
                          (storeHours[index] && storeHours[index].end) ||
                          undefined
                        }
                        onChange={(e) =>
                          changeStoreHours("end", index, e.target.value)
                        }
                        mask={/\d{1,2}:\d{2}/}
                        showLabel={false}
                      />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <hr />
      <h1>Shift Scheduling Rules</h1>
      <hr />
      <h1>Job Titles</h1>
      <div className="flex justify-start max-w-xs gap-3 mx-auto">
        <Input
          value={newJobTitle}
          onChange={(e) => setNewJobTitle(e.target.value)}
          placeholder="Add Job Title"
        />
        <Button
          loadingCondition={jobTitles.status === "loading"}
          onClick={() => dispatch(addJobTitle(newJobTitle))}
        >
          Save
        </Button>
      </div>
      <DataTable
        defaultSortFieldId={"role"}
        columns={titleColumns}
        data={jobTitles.data.map((item) => {
          return {
            id: item.id,
            role: item.name,
            numOfEmps: people.data.filter(
              (person) => person.jobTitle.id === item.id
            ).length,
          };
        })}
      />
    </Layout>
  );
};

export default StoreInfo;

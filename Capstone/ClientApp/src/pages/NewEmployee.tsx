import React, { useEffect, useState } from "react";
import Layout from "../components/Layout";
import Input from "../components/Input";
import Button from "../components/Button";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "../services/hooks";
import IPerson, { fetchPeople, selectPeople } from "../models/person";
import InputSelect from "../components/InputSelect";

const NewEmployee = () => {
  const { id } = useParams<{ id: string }>();
  const [data, setData] = useState({
    id: "",
    firstName: "",
    lastName: "",
    address: "",
    province: "",
    postal: "",
    job: "",
    role: "",
    pay: "",
    phone: "",
    maxWeeklyHours: "",
  });

  // Initialize redux states
  const dispatch = useDispatch();
  const people = useSelector(selectPeople);

  // Populate data from API
  useEffect(() => {
    if (people.status === "idle") dispatch(fetchPeople());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (id) {
      const person = people.data.find((x) => x.id === id);
      if (person) {
        setData((d) => {
          return {
            ...d,
            ...person,
            pay: person.pay.toLocaleString() || "",
            maxWeeklyHours: person.maxWeeklyHours.toLocaleString() || "",
          };
        });
      }
    }
  }, [id, people.data]);

  return (
    <Layout>
      <div className="flex justify-between">
        <h1>Employee Info</h1>
        <Button>Save</Button>
      </div>
      <form>
        <div className="grid gap-4 grid-cols-4">
          <Input
            className="col-span-2"
            placeholder="First Name"
            value={data.firstName}
            onChange={(e) => setData({ ...data, firstName: e.target.value })}
          />
          <Input
            className="col-span-2"
            placeholder="Last Name"
            value={data.lastName}
            onChange={(e) => setData({ ...data, lastName: e.target.value })}
          />
          <Input
            className="col-span-4"
            placeholder="Address"
            value={data.address}
            onChange={(e) => setData({ ...data, address: e.target.value })}
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="City"
            // value={data.firstName}
            // onChange={(e) => setData({ ...data, firstName: e.target.value })}
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Province"
            // value={data.firstName}
            // onChange={(e) => setData({ ...data, firstName: e.target.value })}
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Postal Code"
            // value={data.firstName}
            // onChange={(e) => setData({ ...data, firstName: e.target.value })}
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Phone Number"
            value={data.phone}
            onChange={(e) => setData({ ...data, phone: e.target.value })}
          />
          <InputSelect
            className="col-span-2 md:col-span-1"
            placeholder="Role"
            options={["FT", "PT"]}
            value={data.role}
            onChange={(e) => setData({ ...data, role: e.value })}
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Wage"
            value={data.pay}
            onChange={(e) => setData({ ...data, pay: e.target.value })}
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Job"
            value={data.job}
            onChange={(e) => setData({ ...data, job: e.target.value })}
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Hours"
            value={data.maxWeeklyHours}
            onChange={(e) =>
              setData({ ...data, maxWeeklyHours: e.target.value })
            }
          />
        </div>
      </form>
      {/* <>
              <Col xs="6" md>
                <Form.Group controlId="province">
                  <Form.Label>Province</Form.Label>
                  <Form.Control as="select" custom>
                    <option>Alberta</option>
                    <option>British Columbia</option>
                    <option>Manitoba</option>
                    <option>New Brunswick</option>
                    <option>Newfoundland</option>
                    <option>Northwest Territories</option>
                    <option>Nova Scotia</option>
                    <option>Nunavut</option>
                    <option>Ontario</option>
                    <option>Prince Edward Island</option>
                    <option>Quebec</option>
                    <option>Saskatchewan</option>
                    <option>Yukon</option>
                  </Form.Control>
                </Form.Group>
              </Col>
      </> */}
    </Layout>
  );
};

export default NewEmployee;

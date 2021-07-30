import React from "react";
import Layout from "./Layout";
import Input from "./Input";
import Button from "./Button";

const NewEmployee = () => {
  return (
    <Layout>
      <div className="flex justify-between">
        <h1>Employee Info</h1>
        <Button>Save</Button>
      </div>
      <form>
        <div className="grid gap-4 grid-cols-4">
          <Input className="col-span-2" placeholder="First Name" />
          <Input className="col-span-2" placeholder="Last Name" />
          <Input className="col-span-4" placeholder="Address" />
          <Input className="col-span-2 md:col-span-1" placeholder="City" />
          <Input className="col-span-2 md:col-span-1" placeholder="Province" />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Postal Code"
          />
          <Input
            className="col-span-2 md:col-span-1"
            placeholder="Phone Number"
          />
          <Input className="col-span-2 md:col-span-1" placeholder="Role" />
          <Input className="col-span-2 md:col-span-1" placeholder="Wage" />
          <Input className="col-span-2 md:col-span-1" placeholder="Job" />
          <Input className="col-span-2 md:col-span-1" placeholder="Hours" />
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

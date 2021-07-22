import React from "react";
import { Col, Container, Row } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Layout from "./Layout";

const NewEmployee = () => {
  return (
    <Layout>
      <>
        <h1>Employee Info</h1>
        <Container fluid>
          <Form>
            <Row>
              <Col>
                <Form.Group controlId="firstName">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter First Name" />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group controlId="lastName">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control type="text" placeholder="Enter Last Name" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Form.Group controlId="address">
                  <Form.Label>Address</Form.Label>
                  <Form.Control type="text" placeholder="Enter Address" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs="6" md>
                <Form.Group controlId="city">
                  <Form.Label>City</Form.Label>
                  <Form.Control type="text" placeholder="Enter City" />
                </Form.Group>
              </Col>
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
              <Col xs="6" md>
                <Form.Group controlId="postal">
                  <Form.Label>Postal Code</Form.Label>
                  <Form.Control type="text" placeholder="Enter Postal Code" />
                </Form.Group>
              </Col>
              <Col xs="6" md>
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="text" placeholder="Enter Phone Number" />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col xs="6" md>
                <Form.Group controlId="role">
                  <Form.Label>Role</Form.Label>
                  <Form.Control type="text" placeholder="Enter Role" />
                </Form.Group>
              </Col>
              <Col xs="6" md>
                <Form.Group controlId="wage">
                  <Form.Label>Hourly Wage</Form.Label>
                  <Form.Control type="text" placeholder="Enter Hourly Wage" />
                </Form.Group>
              </Col>
              <Col xs="6" md>
                <Form.Group controlId="job">
                  <Form.Label>Job Title</Form.Label>
                  <Form.Control type="text" placeholder="Enter Job Title" />
                </Form.Group>
              </Col>
              <Col xs="6" md>
                <Form.Group controlId="hours">
                  <Form.Label>Maximum Weekly Hours</Form.Label>
                  <Form.Control
                    type="number"
                    placeholder="Enter Maximum Weekly Hours"
                  />
                </Form.Group>
              </Col>
            </Row>
          </Form>
        </Container>
      </>
    </Layout>
  );
};

export default NewEmployee;

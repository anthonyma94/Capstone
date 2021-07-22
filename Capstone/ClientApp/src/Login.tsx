import React from "react";
import Button from "react-bootstrap/esm/Button";
import Form from "react-bootstrap/esm/Form";
import styles from "./stylesheets/Login.module.scss";

const Login = () => {
  return (
    <div className={styles.container}>
      <Form>
        <Form.Group controlId="username">
          <Form.Label>Username</Form.Label>
          <Form.Control type="text" placeholder="Enter username" />
        </Form.Group>
        <Form.Group controlId="password">
          <Form.Label>Password</Form.Label>
          <Form.Control type="password" placeholder="Enter password" />
        </Form.Group>
        {/* <Button className={styles.button} variant="primary" type="submit">
          Submit
        </Button> */}
        <Button type="submit">Submit</Button>
      </Form>
    </div>
  );
};

export default Login;

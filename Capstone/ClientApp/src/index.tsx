import React from "react";
import ReactDOM from "react-dom";
// import "mdb-react-ui-kit/dist/css/mdb.min.css";
import "./stylesheets/index.scss";
import { BrowserRouter } from "react-router-dom";
import App from "./App";

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById("root")
);

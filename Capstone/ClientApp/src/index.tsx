import React from "react";
import ReactDOM from "react-dom";
import "./stylesheets/index.css";
import "react-notifications-component/dist/theme.css";
import { BrowserRouter } from "react-router-dom";
import store from "./reduxStore";
import { Provider } from "react-redux";
import App from "./App";
import ReactNotification from "react-notifications-component";

ReactDOM.render(
  <React.StrictMode>
    <ReactNotification />
    <Provider store={store}>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </Provider>
  </React.StrictMode>,
  document.getElementById("root")
);

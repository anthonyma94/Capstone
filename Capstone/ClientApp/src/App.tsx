import React from "react";
import { Switch, Route } from "react-router-dom";
import navLinks from "./assets/navlinks";

function App() {
  return (
    <div className="App">
      <Switch>
        {navLinks.map((item) => {
          return (
            <Route key={item.link} path={item.link} component={item.page} />
          );
        })}
        {/* <Route path="/login">
          <Login />
        </Route> */}
      </Switch>
    </div>
  );
}

export default App;

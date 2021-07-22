import React from "react";
import Register from "./pages/Register";
import Admin from "./pages/Admin";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import "antd/dist/antd.css";
import "./index.css";

const App = () => {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Register />
        </Route>
        <Route exact path="/admin">
          <Admin />
        </Route>
      </Switch>
    </Router>
  );
};

export default App;

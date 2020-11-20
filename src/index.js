import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
// import { Provider } from "react-redux";
import App from "./pages/App";
import "./assets/css/app.less";

import Home from "./pages/home/Home";
import About from "./pages/about/About";

render(
  <Router>
    <Switch>
      <Route path="/" exact component={App} />
      <Route path="/index" exact component={Home} />
      <Route path="/about" exact component={About} />
    </Switch>
  </Router>,
  document.getElementById("root")
);



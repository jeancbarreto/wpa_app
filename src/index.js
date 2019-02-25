import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

//Paginas
import Home from "../src/Pages/Home";

const Root = () => {
  return (
    <Router basename="/app">
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/home" component={Home} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

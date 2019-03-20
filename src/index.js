import React from "react";
import ReactDOM from "react-dom";
import firebase from "firebase";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import * as serviceWorker from "./serviceWorker";

//Paginas
import Home from "../src/Pages/HomeLocal";
import Detail from "../src/Pages/DetailsLocal";
import Payment from "../src/Pages/Payment";
import Sadmin from "../src/Pages/SuperAdmin";
import admin from "../src/Pages/Admin";
import scanner from "../src/Pages/qrScanner";

firebase.initializeApp({
  apiKey: "AIzaSyCRTvsrNppBUNVBWePdO_4ISoWiKItupw4",
  authDomain: "newagent-e8ec8.firebaseapp.com",
  databaseURL: "https://newagent-e8ec8.firebaseio.com",
  projectId: "newagent-e8ec8",
  storageBucket: "newagent-e8ec8.appspot.com",
  messagingSenderId: "322573395813"
});

const Root = () => {
  return (
    <Router basename="/app">
      <Switch>
        <Route exact path="/" component={App} />
        <Route exact path="/home" component={Home} />
        <Route exact path="/detail/:id" component={Detail} />
        <Route exact path="/payment" component={Payment} />
        <Route exact path="/sadmin" component={Sadmin} />
        <Route exact path="/admin" component={admin} />
        <Route exact path="/scanner" component={scanner} />
      </Switch>
    </Router>
  );
};

ReactDOM.render(<Root />, document.getElementById("root"));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.register();

import React, { Component } from "react";
import logo from "./logo.svg";
import firebase from "firebase";
import "./App.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ""
    };
  }

  handleAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => this.setState({ email: result.user.email }))
      .catch(error => console.log(error.message));
  };
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p />
          <a
            className="App-link"
            href="/home"
            target="_self"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
          <button onClick={this.handleAuth}>Login con Google</button>
        </header>
      </div>
    );
  }
}

export default App;

import React, { Component } from "react";
import logo from "./bulb-curvy-flat.png";
import firebase from "firebase";
import { withStyles } from "@material-ui/core/styles";
import Fab from "@material-ui/core/Fab";
import Button from "@material-ui/core/Button";
import NavigationIcon from "@material-ui/icons/Navigation";
import Grid from "@material-ui/core/Grid";
import Cookies from "universal-cookie";
import Fade from "@material-ui/core/Fade";
import Menu from "./Components/Menu";
import Locales from "./Pages/HomeLocal";
import "./App.css";

const styles = theme => ({
  fab: {
    margin: theme.spacing.unit
  },
  extendedIcon: {
    marginRight: theme.spacing.unit
  },
  HideButton: {
    display: "none"
  },
  ShowButtom: {
    display: "block"
  },
  paperClass: {
    paddingBottom: "14%"
  },
  button: {
    margin: theme.spacing.unit
  }
});

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      user: [],
      Login: false
    };
  }

  handleAuth = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    let d = new Date();
    d.setTime(d.getTime() + 60 * 1000);

    firebase
      .auth()
      .signInWithPopup(provider)
      .then(result => this.handleChangeUser(result))
      .catch(error => console.log(error.message));
  };

  handleChangeUser = result => {
    let d = new Date();
    d.setTime(d.getTime() + 60 * 1000);

    const cookies = new Cookies();
    this.setState({ user: result.user, Login: true });
    cookies.set("user", this.state.user, { path: "/", expires: d });
  };

  render() {
    const { classes } = this.props;
    return (
      <div className="App">
        {this.state.Login ? <Menu user={this.state.user} /> : null}
        <header className="App-header">
          <Grid xs={12} className="paperClass">
            <img src={logo} className="App-logo" alt="logo" />
          </Grid>

          <Grid xs={12}>
            <Fade in={this.state.Login}>
              <div>
                <h5>Hola {this.state.user.displayName}</h5>
                <p />
                <Button
                  variant="contained"
                  color="primary"
                  className={classes.button}
                  href="/home"
                >
                  <NavigationIcon className={classes.extendedIcon} />
                  Locales
                </Button>
              </div>
            </Fade>
          </Grid>

          <Fade in={this.state.Login === false}>
            <Fab
              variant="extended"
              aria-label="Delete"
              onClick={this.handleAuth}
              className={
                this.state.Login === false
                  ? classes.ShowButtom
                  : classes.HideButton
              }
            >
              <NavigationIcon className={classes.extendedIcon} />
              Iniciar Sesión con Google
            </Fab>
          </Fade>
          <br />
          <br />
        </header>
      </div>
    );
  }
}

export default withStyles(styles)(App);

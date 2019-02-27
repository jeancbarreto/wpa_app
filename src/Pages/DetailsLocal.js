import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import axios from "axios";
import Menu from "../Components/Menu";
import Cookies from "universal-cookie";
import "../App.css";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden"
  },
  gridList: {
    width: "100%",
    height: "100%"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  }
});
const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};

class Details extends Component {
  constructor(props) {
    super(props);

    this.state = {
      id: 0
    };
  }

  render() {
    return (
      <div>
        <p>{this.props.id}</p>
      </div>
    );
  }
}

Details.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Details);

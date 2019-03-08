import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline";
import IconButton from "@material-ui/core/IconButton";
import CommentIcon from "@material-ui/icons/Comment";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import axios from "axios";
import Menu from "../Components/Menu";
import Cookies from "universal-cookie";
import "../App.css";

const styles = theme => ({
  root: {
    paddingTop: "10%",
    width: "100%",
    maxWidth: 360,
    backgroundColor: theme.palette.background.paper
  },
  inline: {
    display: "inline"
  }
});

const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};

const cookies = new Cookies();
class Payment extends Component {
  constructor(props) {
    super(props);

    this.state = {};
  }

  render() {
    const user = cookies.get("user");
    const { classes } = this.props;
    return (
      <div>
        <div>
          {user !== undefined ? (
            <Menu user={user} title="Tu Carrito de compras" type="Atras" />
          ) : null}
        </div>
        <div className={classes.root}>
          <List className={classes.root}>
            {[0, 1, 2, 3].map(value => (
              <ListItem key={value} role={undefined} dense button>
                <ListItemText primary={`Line item ${value + 1}`} />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Add">
                    <AddCircleOutline />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

Payment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Payment);

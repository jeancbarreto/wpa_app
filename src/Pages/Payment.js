import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import ImageIcon from "@material-ui/icons/Image";
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
  },
  botonSendToCar: {
    display: "block",
    width: "100%",
    position: "fixed",
    zIndex: 1000,
    bottom: 0
  },
  btnHideSendToCar: {
    display: "none"
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

    this.state = {
      cart: []
    };

    this.handleGetCart();
  }

  handleGetCart = () => {
    const userid = cookies.get("iap");

    axios
      .get("https://api-wpa.herokuapp.com/users/" + userid + "", config)
      .then(result => {
        if (result.status === 200) {
          this.setState({ cart: result.data.cart });
          console.log("cart", this.state.cart);
        } else {
          console.log("Error...");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

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
            {this.state.cart.map(value => (
              <div>
                <ListItem key={value.name} role={undefined} dense button>
                  <Avatar>
                    <ImageIcon />
                  </Avatar>
                  <ListItemText
                    primary={value.name}
                    secondary={"Cantidad: " + value.quantity}
                  />

                  <ListItemSecondaryAction>
                    <IconButton aria-label="Delete">
                      <DeleteOutlinedIcon className={classes.icon} />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
                <Divider />
              </div>
            ))}
          </List>
        </div>
        <Button
          variant="contained"
          color="primary"
          className={
            this.state.cart.length > 0
              ? classes.botonSendToCar
              : classes.btnHideSendToCar
          }
        >
          Pagar
        </Button>
      </div>
    );
  }
}

Payment.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Payment);

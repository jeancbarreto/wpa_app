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
  },
  spaceTotal:{
    marginLeft:'4%'
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
      cart: [],
      Total:0
    };

    this.handleGetCart();
  }

  handlePayCart = (event) =>{
    const userid = cookies.get("iap");
    axios.post("https://api-wpa.herokuapp.com/user/" + userid.id + "/pay/", {
      Total:this.state.Total
    }, config).then(result => {
      if (result.status === 200) {
        alert("Pagado con Exito");
      } else {
        console.log("Error...");
      }
    })
      .catch(err => {
        console.log(err);
      });
  }

  handleGetCart = () => {
    const userid = cookies.get("iap");

    axios
      .get("https://api-wpa.herokuapp.com/users/" + userid.id + "", config)
      .then(result => {
        if (result.status === 200) {
          var total = 0;
          this.setState({ cart: result.data.cart });
          this.state.cart.map(value => {
            var valor = value.individual_cost * value.quantity;
            
            total = (parseInt(total) + parseInt(valor));
          })

          this.setState({Total:total});
        } else {
          console.log("Error...", result.status);
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
                  <Avatar src={value.image}>
                   
                  </Avatar>
                  <ListItemText
                    primary={value.name}
                    secondary={
                      "Cantidad: " +
                      value.quantity +
                      " || Precio: $" +
                      value.individual_cost * value.quantity
                    }
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
        <Typography className={classes.spaceTotal} variant="h6" component="h4">
            <b>Total a Pagar: {"$"+this.state.Total}</b>
        </Typography>
        <Button
          variant="contained"
          color="primary"
          className={
            this.state.cart.length > 0
              ? classes.botonSendToCar
              : classes.btnHideSendToCar
          }
          onClick={e => this.handlePayCart(e)}
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

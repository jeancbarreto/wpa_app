import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
import IconButton from "@material-ui/core/IconButton";
import AddCircleOutline from "@material-ui/icons/AddCircleOutline";
import RemoveCircleOutline from "@material-ui/icons/RemoveCircleOutline";
import Icon from "@material-ui/core/Icon";
import Grid from "@material-ui/core/Grid";
import axios from "axios";
import Menu from "../Components/Menu";
import Cookies from "universal-cookie";
import SwipeableViews from "react-swipeable-views";
import AppBar from "@material-ui/core/AppBar";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import Card from "@material-ui/core/Card";
import CardActionArea from "@material-ui/core/CardActionArea";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import Button from "@material-ui/core/Button";
import Typography from "@material-ui/core/Typography";
import Input from "@material-ui/core/Input";
import Fade from "@material-ui/core/Fade";
import "../App.css";

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: "#d1cfcf"
  },
  root_: {
    backgroundColor: theme.palette.background.paper,
    width: 500
  },
  gridList: {
    width: "100%",
    height: "100%"
  },
  icon: {
    color: "rgba(255, 255, 255, 0.54)"
  },
  image: {
    width: "100%",
    height: "100%"
  },
  card: {
    maxWidth: "100%",
    MarginBottom: 10
  },
  media: {
    height: 140
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

function TabContainer({ children, dir }) {
  return (
    <Typography component="div" dir={dir} style={{ padding: 8 * 3 }}>
      {children}
    </Typography>
  );
}

TabContainer.propTypes = {
  children: PropTypes.node.isRequired,
  dir: PropTypes.string.isRequired
};

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
      Local: [],
      ProductosMarket: [],
      ProductsSend: [],
      value: 0,
      productsInCar: false
    };

    const idProducto = this.props.match.params.id;
    this.handleSearchLocal(idProducto);
  }

  handleChange = (event, value) => {
    this.setState({ value });
  };

  handleChangeIndex = index => {
    this.setState({ value: index });
  };

  handleSearchLocal = id => {
    axios
      .get("https://api-wpa.herokuapp.com/locales/" + id + "", config)
      .then(result => {
        if (result.status === 200) {
          this.setState({
            Local: result.data.local,
            ProductosMarket: result.data.products
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  handleAddProduct = (data, event) => {
    const datosArray = {
      product: data,
      quantity: 1
    };

    var exist = true;

    if (this.state.ProductsSend.length === 0) {
      this.state.ProductsSend.push(datosArray);
      document.getElementById("txtQuantity_" + data + "").value = 1;
    } else {
      this.state.ProductsSend.map(datos => {
        if (datos.product === data) {
          datos.quantity = datos.quantity + 1;
          document.getElementById("txtQuantity_" + data + "").value =
            datos.quantity;
          exist = false;
        }
      });

      if (exist) {
        this.state.ProductsSend.push(datosArray);
        document.getElementById("txtQuantity_" + data + "").value = 1;
      }
    }

    this.setState({ productsInCar: true });
  };

  handleDeleteProduct = (id, event) => {
    var i = 0;
    if (this.state.ProductsSend.length > 0) {
      this.state.ProductsSend.map(datos => {
        if (datos.product === id) {
          if (datos.quantity > 0) {
            datos.quantity = datos.quantity - 1;
            if (datos.quantity === 0) {
              this.state.ProductsSend.splice(i, 1);
            }

            document.getElementById("txtQuantity_" + id + "").value =
              datos.quantity;
          }
        }
        i++;
      });
    }

    if (this.state.ProductsSend.length === 0) {
      this.setState({ productsInCar: false });
    }
  };

  handleSendToCarClic = event => {
    const cookies_ = new Cookies();
    const userid = cookies_.get("iap");
    axios
      .post(
        "https://api-wpa.herokuapp.com/cart",
        JSON.stringify({
          user: userid,
          products: this.state.ProductsSend
        }),
        config
      )
      .then(result => {
        if (result.status === 200) {
          console.log(result.data.response, "y rol: ", result.data.rol);
        } else {
          console.log("Error...");
        }
      })
      .catch(err => {
        console.log(err);
      });
  };

  render() {
    const cookies = new Cookies();
    const user = cookies.get("user");
    const { classes } = this.props;

    return (
      <div className={classes.root}>
        <div>
          {user !== undefined ? (
            <Menu user={user} title="Detalle" type="Atras" />
          ) : null}
        </div>
        <Grid container spacing={24}>
          <Grid item xs={12}>
            <img
              alt=""
              src={this.state.Local.image}
              className={classes.image}
            />
          </Grid>
        </Grid>
        <Grid xs={12}>
          <Fade in={this.state.productsInCar}>
            <Button
              variant="contained"
              color="primary"
              className={
                this.state.productsInCar === true
                  ? classes.botonSendToCar
                  : classes.btnHideSendToCar
              }
              onClick={e => this.handleSendToCarClic(e)}
            >
              Enviar a Carrito
            </Button>
          </Fade>
          <AppBar position="static" color="default">
            <Tabs
              value={this.state.value}
              onChange={this.handleChange}
              indicatorColor="primary"
              textColor="primary"
              variant="fullWidth"
            >
              <Tab label="Información" />
              <Tab label="Productos" />
            </Tabs>
          </AppBar>
          <SwipeableViews
            axis={classes.direction === "rtl" ? "x-reverse" : "x"}
            index={this.state.value}
            onChangeIndex={this.handleChangeIndex}
          >
            <TabContainer dir={classes.direction}>
              <b>Local: </b>
              {this.state.Local.name}
            </TabContainer>
            <TabContainer dir={classes.direction}>
              {this.state.ProductosMarket.map(tile => (
                <Card className={classes.card}>
                  <CardActionArea>
                    <CardMedia
                      className={classes.media}
                      image={tile.image}
                      title={tile.name}
                    />
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {tile.name}
                      </Typography>
                      <Typography component="p">{tile.description}</Typography>
                    </CardContent>
                  </CardActionArea>
                  <CardActions>
                    <IconButton>
                      <AddCircleOutline
                        aria-label="Add"
                        onClick={e => this.handleAddProduct(tile.id, e)}
                      />
                    </IconButton>
                    <Input
                      className={classes.input}
                      disabled
                      id={tile.id ? "txtQuantity_" + tile.id : ""}
                      inputProps={{
                        "aria-label": "Description"
                      }}
                    />
                    <IconButton
                      aria-label="Add"
                      onClick={e => this.handleDeleteProduct(tile.id, e)}
                    >
                      <RemoveCircleOutline />
                    </IconButton>
                  </CardActions>
                </Card>
              ))}
            </TabContainer>
          </SwipeableViews>
        </Grid>
      </div>
    );
  }
}

Details.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Details);

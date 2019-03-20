import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Menu from "../Components/Menu";
import Cookies from "universal-cookie";
import QrReader from "react-qr-reader";
import axios from "axios";
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
import { Fade } from "@material-ui/core";

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
    },
    GridList_item: {
        width: "100%",
        height: 227,
        padding: 2
    },
    viewCam:{
        width:'100%',
        height:'80%',
        margin:50
    },
    ocultarCamara:{
        display:'none'
    }
});
const config = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
};
const cookies = new Cookies();
class qrScarnner extends Component {
    constructor(props) {
        super(props);
        this.state = {
            result: 'No result',
            vacio: false,
            cart: []
        }
    }

    handleScan = data => {
        var admin = cookies.get("iap");
        if (data) {
            this.setState({
                result: data
            })

            axios.post("https://api-wpa.herokuapp.com/cart/paid",
                {
                    admin: admin.id,
                    token: this.state.result
                }, config
            ).then(result => {
                if(result.status === 200){
                    this.setState({cart: result.data.response, vacio: true});
                    MediaStream.stop();
                    console.log("Carrito: ", this.state.cart);
                }
            }).catch(error => {
                console.log(error);
            })
        }
    }

handleBuildVista = () => {
    const classes = this.props;
    if(this.state.cart.length > 0){
        return (
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
                                    value.quantity
                                }
                            />
                        </ListItem>
                        <Divider />
                    </div>
                ))}
            </List>
        )
    }else{
        return <b>No tiene contenido</b>
    }
}

    handleError(err) {
        console.error(err)
    }

render(){
    const user = cookies.get("user");
    const { classes } = this.props;
    const previewStyle = {
        height: 240,
        width: 320,
    }
    return (
      <div className={classes.root}>
        <div>
          {user !== undefined ? (
            <Menu user={user} title="Locales" type="Atras" />
          ) : null}
        </div>
        <div className={this.state.vacio === false ? classes.viewCam : classes.ocultarCamara}>
          <QrReader
            delay={300}
            onError={this.handleError}
            onScan={this.handleScan}
            style={{ width: "100%" }}
            facingMode="environment"
          />
          <p>{this.state.result}</p>
        </div>
        <Fade in={this.state.vacio}>
            <div>
                {this.handleBuildVista()}
            </div>
        </Fade>
      </div>
    );
}

}

qrScarnner.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(qrScarnner);

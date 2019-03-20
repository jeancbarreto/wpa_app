import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import Menu from "../Components/Menu";
import Button from "@material-ui/core/Button";
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import SwipeableViews from "react-swipeable-views";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import DeleteOutlinedIcon from "@material-ui/icons/DeleteOutlined";
import IconButton from "@material-ui/core/IconButton";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import Typography from "@material-ui/core/Typography";
import Divider from "@material-ui/core/Divider";
import Avatar from "@material-ui/core/Avatar";
import Cookies from "universal-cookie";
import firebase from "firebase";
import Modal from '@material-ui/core/Modal';
import "../App.css";

function TabContainer(props) {
    return (
        <Typography component="div" style={{ padding: 8 * 3 }}>
            {props.children}
        </Typography>
    );
}

TabContainer.propTypes = {
    children: PropTypes.node.isRequired,
};

const styles = theme => ({
    root: {
        paddingTop: "13%",
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    rootList: {
        paddingTop: "1%",
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    rootTwo: {

        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    container: {
        flexWrap: 'wrap',
        textAlign: 'center',
        width: '100%'
    },
    textField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    dense: {
        marginTop: 16,
    },
    menu: {
        width: 200,
    },
    bottomMenu: {
        display: "block",
        width: "100%",
        position: "fixed",
        zIndex: 1000,
        bottom: 0
    },
    buttonSend: {
        marginTop: 4,
        width: '100%'
    },
    buttonUpload: {
        width: '100%'
    },
    tabSadmin: {
        width: '50%'
    },
    paper: {
        position: 'absolute',
        width: '68%',
        backgroundColor: theme.palette.background.paper,
        boxShadow: theme.shadows[5],
        padding: theme.spacing.unit * 4,
        outline: 'none',
    },
});

function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {

    return {
        top: `50%`,
        left: `50%`,
        transform: `translate(-50%, -50%)`,
    };
}

const config = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
};

const cookies = new Cookies();
class Admin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name: "",
            description: "",
            direction:"",
            image_form:"",
            image:"",
            value: 0,
            open:false,
            nameProduct:"",
            descriptionPro:"",
            imageProduct:"",
            imageProductForm:"",
            cost:0,
            localId:0,
            listLocales: []
        };

        this.handleGetAdmin();
    }

    handleGetAdmin = () => {
        const userid = cookies.get("iap");
        axios
            .get("https://api-wpa.herokuapp.com/admin/" + userid.id + "/locales", config)
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        listLocales: result.data
                    });
                }
            })
            .catch(function (error) {
                console.log(error);
            });
    };


    handleChangeForm = name => event => {
        this.setState({
            [name]: event.target.value,
        });

    };

    handleChangeIndex = index => {
        this.setState({ value: index });
    };

    handleChange = (event, value) => {
        this.setState({
            value: value,
        });
    };

    handleOpen = (id) => {
        this.setState({ open: true, localId:id });
    };

    handleClose = () => {
        this.setState({ open: false });
    };

    handleChangeImageUpload = (e) =>{
        var fileName = e.target.files[0].name;
        var file = e.target.files[0];
        const storageBef = firebase.storage().ref('/img_spotnigth/').child(fileName);
        storageBef.put(file);
        storageBef.getDownloadURL().then(url => {
            this.setState({image:url});
        });

        this.setState({ image_form: fileName })
        const task = storageBef.put(file);
    }

    handleChangeImageUploadProduct = (e) => {
        var fileName = e.target.files[0].name;
        var file = e.target.files[0];

        const storageBef = firebase.storage().ref('/img_spotnigth/').child(fileName);
        storageBef.put(file);
        storageBef.getDownloadURL().then(url => {
            this.setState({ imageProduct: url });
        });
        this.setState({imageProductForm: fileName})
        
    }

    handleCreateLocal = () => {
        const userid = cookies.get("iap");
        axios.post("https://api-wpa.herokuapp.com/locales", {
            admin: userid.id,
            name: this.state.name,
            description: this.state.description,
            direction:this.state.direction,
            image:this.state.image
        }, config).then(result => {
            if(result.status === 200){
                alert("Local Creado");
                this.handleGetAdmin();
                this.setState({ name: "", email: "", description: "", direction: "", image: "", image_form: "" });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    handleCreateProducts = () =>{
        const userid = cookies.get("iap");
        axios.post("https://api-wpa.herokuapp.com/locale/product/create", {
            admin: userid.id,
            locale: this.state.localId,
            name: this.state.nameProduct,
            description: this.state.descriptionPro,
            image: this.state.imageProduct
        }, config).then(result => {
            if (result.status === 200) {
                alert("Producto Creado");
                this.setState({ nameProduct: "", descriptionPro: "", localId: 0, cost: 0, imageProduct: "", imageProductForm: "" });
            }
        }).catch(error => {
            console.log(error);
        })
    }

    render() {
        const user = cookies.get("user");
        const { classes } = this.props;
        return (
            <div>
                <div>
                    {user !== undefined ? (
                        <Menu user={user} title="Admin Spotnight" type="Atras" />
                    ) : null}
                </div>

                <div className={classes.bottomMenu}>
                    <div className={classes.rootTwo}>
                        <AppBar position="static" color="default">
                            <Tabs value={this.state.value} onChange={this.handleChange} indicatorColor="primary"
                                textColor="primary">
                                <Tab label="Agregar" className={classes.tabSadmin} />
                                <Tab label="Ver todos" className={classes.tabSadmin} />
                            </Tabs>
                        </AppBar>
                    </div>
                </div>
                <SwipeableViews
                    axis={classes.direction === "rtl" ? "x-reverse" : "x"}
                    index={this.state.value}
                    onChangeIndex={this.handleChangeIndex}
                >
                    {this.state.value === 0 &&
                        <TabContainer dir={classes.direction}>
                            <Grid container justify="center" spacing={24}>
                                <Grid item lg={12}>
                                    <div className={classes.root}>
                                        <Typography variant="h6" component="h4" align="center">
                                            Agregar Local
                                        </Typography>
                                        <form className={classes.container} noValidate autoComplete="off">
                                            <Paper elevation={1}>
                                                <TextField
                                                    id="outlined-name"
                                                    label="Name"
                                                    className={classes.textField}
                                                    value={this.state.name}
                                                    onChange={this.handleChangeForm('name')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                                <TextField
                                                    id="outlined-name"
                                                    label="Description"
                                                    className={classes.textField}
                                                    value={this.state.description}
                                                    onChange={this.handleChangeForm('description')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                                <TextField
                                                    id="outlined-name"
                                                    label="Direction"
                                                    className={classes.textField}
                                                    value={this.state.direction}
                                                    onChange={this.handleChangeForm('direction')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                                <TextField
                                                    id="outlined-name"
                                                    label="Image"
                                                    className={classes.textField}
                                                    value={this.state.image_form}
                                                    onChange={this.handleChangeForm('image_form')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />
                                                <input
                                                    accept="image/*"
                                                    className={classes.input}
                                                    style={{ display: 'none' }}
                                                    id="raised-button-file"
                                                    onChange={e => this.handleChangeImageUpload(e)}
                                                    multiple
                                                    type="file"
                                                />
                                                <label htmlFor="raised-button-file">
                                                    <Button variant="raised" component="span" className={classes.buttonUpload} >
                                                        Subir imagen
                                                    </Button>
                                                </label> 
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.buttonSend}
                                                    onClick={e => this.handleCreateLocal(e)}
                                                >
                                                    Agregar
                                                </Button>
                                            </Paper>

                                        </form>
                                    </div>
                                </Grid>
                            </Grid>
                        </TabContainer>}
                    {this.state.value === 1 &&
                        <TabContainer dir={classes.direction}>
                            <Grid container justify="center" spacing={24}>
                                <Grid item lg={12}>
                                    <div className={classes.rootTwo}>
                                        <Typography variant="h6" component="h4" align="center">
                                            Lista de administradores
                                        </Typography>
                                        <div className={classes.container}>
                                            <List className={classes.rootList}>
                                                {this.state.listLocales.map(value => (
                                                    <div>
                                                        <ListItem key={value.name} role={undefined} dense button onClick={e => this.handleOpen(e, value.id)}>
                                                            <Avatar src={value.image}>

                                                            </Avatar>
                                                            <ListItemText
                                                                primary={value.name}
                                                                secondary={
                                                                    "Fecha: " +
                                                                    value.created_at
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
                                        <Modal
                                            aria-labelledby="simple-modal-title"
                                            aria-describedby="simple-modal-description"
                                            open={this.state.open}
                                            onClose={this.handleClose}
                                        >
                                            <div style={getModalStyle()} className={classes.paper}>
                                            <Typography variant="h6" id="modal-title">
                                                    Producto
                                            </Typography>
                                            <Typography variant="subtitle1" id="simple-modal-description">
                                                    Agregar Productos
                                            </Typography>
                                                <form className={classes.container} noValidate autoComplete="off">
                                                   
                                                        <TextField
                                                            id="outlined-name"
                                                            label="Name"
                                                            className={classes.textField}
                                                             value={this.state.nameProduct}
                                                            onChange={this.handleChangeForm('nameProduct')}
                                                            margin="normal"
                                                            variant="outlined"
                                                        />
                                                        <TextField
                                                            id="outlined-name"
                                                            label="Cost"
                                                            className={classes.textField}
                                                            value={this.state.cost}
                                                            onChange={this.handleChangeForm('cost')}
                                                            margin="normal"
                                                            variant="outlined"
                                                        />
                                                        <TextField
                                                            id="outlined-name"
                                                            label="Description"
                                                            className={classes.textField}
                                                        value={this.state.descriptionPro}
                                                        onChange={this.handleChangeForm('descriptionPro')}
                                                            margin="normal"
                                                            variant="outlined"
                                                        />
                                                        <TextField
                                                            id="outlined-name"
                                                            label="Image"
                                                            className={classes.textField}
                                                             value={this.state.imageProductForm}
                                                            onChange={this.handleChangeForm('imageProductForm')}
                                                            margin="normal"
                                                            variant="outlined"
                                                        />
                                                        <input
                                                            accept="image/*"
                                                            className={classes.input}
                                                            style={{ display: 'none' }}
                                                            id="raised-button-file-two"
                                                            onChange={e => this.handleChangeImageUploadProduct(e)}
                                                            multiple
                                                            type="file"
                                                        />
                                                        <label htmlFor="raised-button-file-two">
                                                            <Button variant="raised" component="span" className={classes.buttonUpload} >
                                                                Subir imagen
                                                            </Button>
                                                        </label>
                                                        <Button
                                                            variant="contained"
                                                            color="primary"
                                                            className={classes.buttonUpload}
                                                            onClick={e => this.handleCreateProducts(e)}
                                                            >
                                                            Agregar
                                                        </Button>
                                                    

                                                </form>
                                            </div>
                                        </Modal>
                                        </div>
                                    </div>
                                </Grid>
                            </Grid>
                        </TabContainer>
                    }
                </SwipeableViews>
            </div>


        );
    }
}

Admin.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Admin);

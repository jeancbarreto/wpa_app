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
        paddingTop: "35%",
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    rootList: {
        paddingTop: "15%",
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    rootTwo: {
       
        width: "100%",
        backgroundColor: theme.palette.background.paper
    },
    container: {
        flexWrap: 'wrap',
        textAlign:'center',
        width:'100%'
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
    bottomMenu:{
        display: "block",
        width: "100%",
        position: "fixed",
        zIndex: 1000,
        bottom: 0
    },
    buttonSend:{
        marginTop: 37,
        width: '100%'
    },
    tabSadmin:{
        width:'50%'
    }
});


const config = {
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
    }
};

const cookies = new Cookies();
class SuperAdmin extends Component {
    constructor(props) {
        super(props);

        this.state = {
            name:"",
            email:"",
            value: 0,
            listAdmin:[]
        };

        this.handleGetAdmin();
    }

    handleGetAdmin = () => {
        const userid = cookies.get("iap");
        axios
            .get("https://api-wpa.herokuapp.com/admin/" + userid.id+ "", config)
            .then(result => {
                if (result.status === 200) {
                    this.setState({
                        listAdmin: result.data.response
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

    handleCreateAdmin = () =>{
        const userid = cookies.get("iap");
        axios.post("https://api-wpa.herokuapp.com/admin/", {
            id:userid.id,
            name:this.state.name,
            email:this.state.email
        },config).then(result => {
            alert("Usuario Creado");
            this.setState({name:"", email:""});
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
                                            Agregar Administrador
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
                                                    label="Email"
                                                    className={classes.textField}
                                                    value={this.state.email}
                                                    onChange={this.handleChangeForm('email')}
                                                    margin="normal"
                                                    variant="outlined"
                                                />

                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    className={classes.buttonSend}
                                                    onClick={e => this.handleCreateAdmin(e)}
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
                                                {this.state.listAdmin.map(value => (
                                                        <div>
                                                            <ListItem key={value.name} role={undefined} dense button>
                                                                <Avatar src={value.image}>

                                                                </Avatar>
                                                                <ListItemText
                                                                    primary={value.name}
                                                                    secondary={
                                                                        "EMAIL: " +
                                                                        value.email +
                                                                        " || Fecha: $" +
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

SuperAdmin.propTypes = {
    classes: PropTypes.object.isRequired
};

export default withStyles(styles)(SuperAdmin);

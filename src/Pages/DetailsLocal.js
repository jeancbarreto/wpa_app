import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Paper from "@material-ui/core/Paper";
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
    maxWidth: 345
  },
  media: {
    height: 140
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
      Productos: [],
      value: 0
    };
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
            Productos: result.data.products
          });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const cookies = new Cookies();
    const user = cookies.get("user");
    const { classes } = this.props;
    const idProducto = this.props.match.params.id;

    this.handleSearchLocal(idProducto);
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
              {this.state.Productos.map(tile => (
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
                    <Button size="small" color="primary">
                      Share
                    </Button>
                    <Button size="small" color="primary">
                      Learn More
                    </Button>
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

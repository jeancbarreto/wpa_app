import React, { Component } from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import GridList from "@material-ui/core/GridList";
import GridListTile from "@material-ui/core/GridListTile";
import GridListTileBar from "@material-ui/core/GridListTileBar";
import ListSubheader from "@material-ui/core/ListSubheader";
import IconButton from "@material-ui/core/IconButton";
import InfoIcon from "@material-ui/icons/Info";
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
  },
  GridList_item: {
    width: "100%",
    height: 227,
    padding: 2
  }
});
const config = {
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json"
  }
};
const cookies = new Cookies();
class Home extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [
        {
          id: 0,
          name: "",
          description: "",
          direction: "",
          image: "",
          created_at: "",
          update_at: ""
        }
      ]
    };

    this.handlePillUpProducto();
  }

  handlePillUpProducto = () => {
    axios
      .get("http://api-wpa.herokuapp.com/locales", config)
      .then(result => {
        if (result.status === 200) {
          this.setState({ data: result.data });
        }
      })
      .catch(function(error) {
        console.log(error);
      });
  };

  render() {
    const user = cookies.get("user");
    const { classes } = this.props;
    return (
      <div className={classes.root}>
        <div>
          {user !== undefined ? <Menu user={user} title="Locales" /> : null}
        </div>

        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
            <ListSubheader component="div">Locales</ListSubheader>
          </GridListTile>
          {this.state.data.map(tile => (
            <GridListTile key={tile.img} className={classes.GridList_item}>
              <img src={tile.image} alt={tile.name} />

              <a href={tile.id ? "/detail/" + tile.id + "" : "/detail"}>
                <GridListTileBar
                  title={tile.name}
                  subtitle={<span>by: {tile.created_at}</span>}
                  actionIcon={
                    <IconButton className={classes.icon}>
                      <InfoIcon />
                    </IconButton>
                  }
                />
              </a>
            </GridListTile>
          ))}
        </GridList>
      </div>
    );
  }
}

Home.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withStyles(styles)(Home);

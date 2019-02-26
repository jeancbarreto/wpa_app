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

const styles = theme => ({
  root: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "space-around",
    overflow: "hidden",
    backgroundColor: theme.palette.background.paper
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
      .get("https://api-wpa.herokuapp.com/locales", config)
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
    const { classes } = this.props;
    return (
      <div className={classes.root} item xs={12}>
        <GridList cellHeight={180} className={classes.gridList}>
          <GridListTile key="Subheader" cols={2} style={{ height: "auto" }}>
            <ListSubheader component="div">Locales</ListSubheader>
          </GridListTile>
          {this.state.data.map(tile => (
            <GridListTile key={tile.img}>
              <img src={tile.image} alt={tile.name} />
              <GridListTileBar
                title={tile.name}
                subtitle={<span>by: {tile.created_at}</span>}
                actionIcon={
                  <IconButton className={classes.icon}>
                    <InfoIcon />
                  </IconButton>
                }
              />
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

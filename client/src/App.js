import React, {Component} from 'react';
import './App.css';

import Grid from '@material-ui/core/Grid';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { FixedSizeList } from 'react-window';
import {AutoSizer} from 'react-virtualized'; 

function getFileName(scientificName) {
  const suffix = scientificName.trim().toLowerCase().replace(/ /g,"-").replace("‘", "(").replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-avatars/${suffix}.jpg`
}

function getBigFileName(scientificName) {
  const suffix = scientificName.trim().toLowerCase().replace(/ /g,"-").replace("‘", "(").replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-images/${suffix}.jpg`
}

function getFullName(scientificName, commonName) {
  return <h2>{commonName} (<i>{scientificName}</i>)</h2>
}

function getLight(lightID) {
  switch (lightID) {
    case "1":
      return <p>Sunny light areas: At least 4 hours of direct sun</p>
    case "1-2":
      return <p>Sunny-high light areas: Over 200 ft-c with some direct sunlight.</p>
    case "2":
      return <p>High-light areas: Over 200 ft-c, but not direct sun</p>
    case "2-3":
      return <p>Medium-high light areas: 150-250 ft-c, but not direct sun</p>
    case "3":
      return <p>Medium-light areas: 75 ft-c to 200 ft-c</p>
    case "3-4":
      return <p>Low-medium light areas: 50-150 ft-c</p>
    case "4":
      return <p>Low-light areas: 25 ft-c to 75 ft-c</p>
  }
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: [],
      currentPlant: null
    };

    this.Row = this.Row.bind(this);
  }

  handleClick(Id) {
    const clickedPlant = this.state.plants.find(plant => plant.Id === Id);
    this.setState({ currentPlant: clickedPlant });
  }

  Row (data) {
    if (this.state.plants.length === 0) {
      return false;
    }

    const plant = this.state.plants[data.index];

    return <ListItem style={data.style} button={true} onClick={() => this.handleClick(plant.Id)} key={plant.id}>
              <ListItemAvatar>
                <Avatar src={getFileName(plant.ScientificName)} />
              </ListItemAvatar>
              <ListItemText
                primary={plant.CommonName}
                secondary={plant.ScientificName}
              />
            </ListItem>
  }

  plantList() {
    return (
      <Grid item xs>
        <div className="PlantList">
        <AutoSizer>
          {({ width, height }) => (
          <FixedSizeList
            height={height}
            width={width}
            itemSize={80}
            itemCount={this.state.plants.length}
          >
            {this.Row}
          </FixedSizeList>
          )}
          </AutoSizer>
        </div>
      </Grid>
    )
  }

  plantView() {
    const plant = this.state.currentPlant;

    return (
      <Grid item xs>
        <div className="PlantView">
          {getFullName(plant.ScientificName, plant.CommonName)}
          {getLight(plant.Light)}
          <img className="PlantViewImage" src={getBigFileName(plant.ScientificName)}/>
        </div>
      </Grid>
    )
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-header">Houseplant Nurse 🌱</h1>
        <Grid container spacing={4}
          
          alignItems="stretch"
          className="Main-Grid"
          direction="row"
          justify="center"
          alignItems="center"
        >
          {this.plantList()}
          {(this.state.currentPlant != null) &&
            this.plantView()
          }
        </Grid>
      </div>
    );
  }

  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/api/plants`)
        .then(res => res.json())
        .then((data) => {
          this.setState({ plants: data.plants })
        })
        .catch(console.log)
  }
}

export default App;

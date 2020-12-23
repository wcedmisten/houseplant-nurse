import React, {Component} from 'react';
import './App.css';

import Grid from '@material-ui/core/Grid';

import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

import { FixedSizeList } from 'react-window';
import {AutoSizer} from 'react-virtualized'; 

// get the thumbnail image filename for the list view
function getThumbnailFileName(scientificName) {
  const suffix = scientificName.trim().toLowerCase().replace(/ /g,"-").replace("‘", "(").replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-avatars/${suffix}.jpg`
}

// get the full sized image filename for the plant view
function getBigFileName(scientificName) {
  const suffix = scientificName.trim().toLowerCase().replace(/ /g,"-").replace("‘", "(").replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-images/${suffix}.jpg`
}

// render the full name of the plant with common and scientific names
function getFullName(scientificName, commonName) {
  return <h2 className="PlantViewTitle">{commonName} (<i>{scientificName}</i>)</h2>
}

// get a description of the light level
function getLightDescription(lightID) {
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

  // when an item in the list has been clicked, set the state to indicate we want to show it
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
                <Avatar src={getThumbnailFileName(plant.ScientificName)} />
              </ListItemAvatar>
              <ListItemText
                primary={plant.CommonName}
                secondary={plant.ScientificName}
              />
            </ListItem>
  }

  // view for showing a list of plants in the catalog
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

  // view for describing the plant and showing a large image of it
  plantView() {
    const plant = this.state.currentPlant;

    return (
      <Grid item xs>
        <div className="PlantView">
          {getFullName(plant.ScientificName, plant.CommonName)}
          <img className="PlantViewImage" src={getBigFileName(plant.ScientificName)}/>
          {getLightDescription(plant.Light)}
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

  // before the page finishes loading, retrieve all of the plant data (but not images)
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

import React, { Component } from "react";
import "./App.css";

import Grid from "@material-ui/core/Grid";

import ListItem from "@material-ui/core/ListItem";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import ListItemText from "@material-ui/core/ListItemText";
import Avatar from "@material-ui/core/Avatar";

import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";

import { FixedSizeList } from "react-window";
import { AutoSizer } from "react-virtualized";

// get the thumbnail image filename for the list view
function getThumbnailFileName(scientificName) {
  const suffix = scientificName
    .trim()
    .toLowerCase()
    .replace(/ /g, "-")
    .replace("‘", "(")
    .replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-avatars/${suffix}.jpg`;
}

// get the full sized image filename for the plant view
function getBigFileName(scientificName) {
  const suffix = scientificName
    .trim()
    .toLowerCase()
    .replace(/ /g, "-")
    .replace("‘", "(")
    .replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-images/${suffix}.jpg`;
}

// render the full name of the plant with common and scientific names
function getFullName(scientificName, commonName) {
  return (
    <h2 className="PlantViewTitle">
      {commonName} (<i>{scientificName}</i>)
    </h2>
  );
}

// get a description of the light level
function getLightDescription(lightLevel) {
  switch (lightLevel) {
    case "1":
      return "Sunny light areas: At least 4 hours of direct sun";
    case "1-2":
      return "Sunny-high light areas: Over 200 ft-c with some direct sunlight.";
    case "2":
      return "High-light areas: Over 200 ft-c, but not direct sun";
    case "2-3":
      return "Medium-high light areas: 150-250 ft-c, but not direct sun";
    case "2-4":
      return "Low-high light areas: 25-250 ft-c, but not direct sun";
    case "3":
      return "Medium-light areas: 75 ft-c to 200 ft-c";
    case "3-4":
      return "Low-medium light areas: 50-150 ft-c";
    case "4":
      return "Low-light areas: 25 ft-c to 75 ft-c";
  }
}

function getLightIcon(lightLevel) {
  const filename = lightLevel.replace("-", "")
  return `${process.env.PUBLIC_URL}/assets/icons/sun${filename}.png`
}

// get a description of the temperature
function getTemperatureDescription(temperatureLevel) {
  switch (temperatureLevel) {
    case "1":
      return "Cool: 50°F night, 65°F day temperatures";
    case "1-2":
      return "Cool-Average: 50-65°F night, 65-75°F day temperatures";
    case "2":
      return "Average: 65°F night, 75°F day temperatures";
    case "2-3":
      return "Average-Warm: 65-70°F night, 75-85°F day temperatures";
    case "3":
      return "Warm: 70°F night, 85°F day temperatures";
  }
}

function getTemperatureIcon(temperatureLevel) {
  const filename = temperatureLevel.replace("-", "")
  return `${process.env.PUBLIC_URL}/assets/icons/temperature${filename}.png`
}

// get a description of humidity
function getHumidityDescription(humidityLevel) {
  switch (humidityLevel) {
    case "1":
      return "High: 50% or higher";
    case "1-2":
      return "Average-High: 25%-50% or higher";
    case "2":
      return "Average: 25% to 49%";
    case "2-3":
      return "Low-Average: 5%-49%";
    case "3":
      return "Low: 5% to 24%";
  }
}

function getHumidityIcon(humidityLevel) {
  const filename = humidityLevel.replace("-", "")
  return `${process.env.PUBLIC_URL}/assets/icons/humidity${filename}.png`
}

function getWaterDescription(waterLevel) {
  switch (waterLevel) {
    case "1":
      return "Keep soil mix moist";
    case "1-2":
      return "Surface of soil mix should only slightly dry before re-watering";
    case "2":
      return "Surface of soil mix should dry before re-watering";
    case "2-3":
      return "Deeper soil can become slightly dry before re-watering";
    case "3":
      return "Deeper soil should become moderately dry before re-watering";
  }
}

function getWaterIcon(waterLevel) {
  const filename = waterLevel.replace("-", "")
  return `${process.env.PUBLIC_URL}/assets/icons/water${filename}.png`
}

function getSoilDescription(soilType) {
  switch (soilType) {
    case "1":
      return "Flowering house plants";
    case "2":
      return "Foliage plants";
    case "3":
      return "Bromeliads";
    case "4":
      return "Orchids";
    case "5":
      return "Succulents and cacti";
    case "6":
      return "Ferns";
    case "7":
      return "African violets and other Gesneriads";
  }
}

function getSoilIcon(soilType) {
  return `${process.env.PUBLIC_URL}/assets/icons/soil${soilType}.png`
}


class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: [],
      currentPlant: null,
      searchVal: null,
    };

    this.Row = this.Row.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClearButtonClick = this.handleClearButtonClick.bind(this);
  }

  // when an item in the list has been clicked, set the state to indicate we want to show it
  handleClick(Id) {
    const clickedPlant = this.state.plants.find((plant) => plant.Id === Id);
    this.setState({ currentPlant: clickedPlant });
  }

  Row(data) {
    if (this.state.plants.length === 0) {
      return false;
    }

    const plant = this.state.plants[data.index];

    return (
      <ListItem
        style={data.style}
        button={true}
        onClick={() => this.handleClick(plant.Id)}
        key={plant.id}
      >
        <ListItemAvatar>
          <Avatar src={getThumbnailFileName(plant.ScientificName)} />
        </ListItemAvatar>
        <ListItemText
          primary={plant.CommonName}
          secondary={plant.ScientificName}
        />
      </ListItem>
    );
  }

  handleChange(event) {
    this.setState({searchVal: event.target.value});
  }

  handleSubmit(event) {
    event.preventDefault();

    fetch(`${process.env.PUBLIC_URL}/api/search?name=${this.state.searchVal}`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ plants: data.plants });
      })
      .catch(console.log);
  }

  // clear the search query
  handleClearButtonClick() {
    this.searchBar.value = "";
    this.setState({ searchVal: null });
    fetch(`${process.env.PUBLIC_URL}/api/plants`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ plants: data.plants });
      })
      .catch(console.log);
  }

  // show all plants again and clear the search bar
  clearSearchButton() {
    return (
      <input type="submit" value="Clear" onClick={this.handleClearButtonClick}/>
    );
  }


  // view for showing a list of plants in the catalog
  plantList() {
    return (
      <Grid item xs>
        <div className="Search">
          <form onSubmit={this.handleSubmit}>
            <label>
              <input type="text" value={this.state.searchVal} ref={el => this.searchBar = el} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Search" />
            {this.state.searchVal != null && this.clearSearchButton()}
          </form>
        </div>
        <div className="PlantList">
          <AutoSizer>
            {({ width, height }) => (
              <FixedSizeList
                height={height}
                width={width}
                itemSize={80}
                itemCount={this.state.plants.length}
                itemData={this.state.plants}
              >
                {this.Row}
              </FixedSizeList>
            )}
          </AutoSizer>
        </div>
      </Grid>
    );
  }

  // view for describing the plant and showing a large image of it
  plantView() {
    const plant = this.state.currentPlant;

    const rows = [
      { name: "Light", description: getLightDescription(plant.Light), icon: getLightIcon(plant.Light) },
      {
        name: "Temperature",
        description: getTemperatureDescription(plant.Temperature),
        icon: getTemperatureIcon(plant.Temperature)
      },
      { name: "Humidity", description: getHumidityDescription(plant.Humidity), icon: getHumidityIcon(plant.Humidity) },
      { name: "Watering", description: getWaterDescription(plant.Watering), icon: getWaterIcon(plant.Light) },
      { name: "Soil", description: getSoilDescription(plant.Soil), icon: getSoilIcon(plant.Soil) },
    ];

    return (
      <Grid item xs>
        <div className="PlantView">
          {getFullName(plant.ScientificName, plant.CommonName)}
          <img
            className="PlantViewImage"
            src={getBigFileName(plant.ScientificName)}
          />

          <TableContainer component={Paper}>
            <Table className="plantDescriptionTable" size="small" aria-label="simple table">
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.name}>
                    <TableCell component="th" scope="row">
                      <b>{row.name}</b>
                    </TableCell>
                    <TableCell align="right">{row.description}
                    </TableCell>
                    <TableCell><img className="PlantViewPropertyIcon" src={row.icon}/></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
      </Grid>
    );
  }

  render() {
    return (
      <div className="App">
        <h1 className="App-header">Houseplant Nurse <img className="HeaderLogo" src="./assets/icons/logo.png"/></h1>
        <Grid
          container
          spacing={4}
          alignItems="stretch"
          className="Main-Grid"
          direction="row"
          justify="center"
          alignItems="center"
          wrap="wrap-reverse"
        >
          {this.plantList()}
          {this.state.currentPlant != null && this.plantView()}
        </Grid>
      </div>
    );
  }

  // before the page finishes loading, retrieve all of the plant data (but not images)
  componentDidMount() {
    fetch(`${process.env.PUBLIC_URL}/api/plants`)
      .then((res) => res.json())
      .then((data) => {
        this.setState({ plants: data.plants });
      })
      .catch(console.log);
  }
}

export default App;

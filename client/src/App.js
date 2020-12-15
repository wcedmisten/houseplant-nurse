import React, {Component} from 'react';
import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';

class Plant {
  constructor(id, scientificName, commonName, light, temperature, humidity, watering, soil) {
    this.id = id;
    this.scientificName = scientificName;
    this.commonName = commonName;
    this.light = light;
    this.temperature = temperature;
    this.humidity = humidity;
    this.watering = watering;
    this.soil = soil;
  }
}

function getFileName(scientificName) {
  const suffix = scientificName.split('‘')[0].trim().toLowerCase().replace(" ", "-");
  return `${process.env.PUBLIC_URL}/assets/plant-avatars/${suffix}.jpg`
}

function plantList(plants) {
  return plants.map(plant =>
    <ListItem button={true} onClick={() => { alert('clicked') }} key={plant.id}>
      <ListItemAvatar>
        <Avatar src={getFileName(plant.ScientificName)} />
      </ListItemAvatar>
      <ListItemText
        primary={plant.CommonName}
        secondary={plant.ScientificName}
      />
    </ListItem>
  );
}

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      plants: []
    };
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
        <h1 className="App-h1">Houseplant Nurse 🌱</h1>
        <div className="plantList">
          <List dense="false">
            {plantList(this.state.plants)}
          </List>
        </div>
        </header>
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

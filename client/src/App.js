import React, {Component} from 'react';
import './App.css';

import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import ListItemText from '@material-ui/core/ListItemText';
import Avatar from '@material-ui/core/Avatar';
import { FixedSizeList } from 'react-window';
import Grid from '@material-ui/core/Grid';

function getFileName(scientificName) {
  const suffix = scientificName.trim().toLowerCase().replace(/ /g,"-").replace("‘", "(").replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-avatars/${suffix}.jpg`
}

function getBigFileName(scientificName) {
  const suffix = scientificName.trim().toLowerCase().replace(/ /g,"-").replace("‘", "(").replace("’", ")");
  return `${process.env.PUBLIC_URL}/assets/plant-images/${suffix}.jpg`
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

  render() {
    return (
      <div className="App">
        <h1 className="App-h1">Houseplant Nurse 🌱</h1>
        <Grid container spacing={1}>
          <Grid container item xs={12} sm={6}>
            <div className="plantList">
              <FixedSizeList
                height={800}
                width={500}
                itemSize={80}
                itemCount={this.state.plants.length}
              >
                {this.Row}
              </FixedSizeList>
            </div>
          </Grid>
          {(this.state.currentPlant != null) &&
          <Grid container item xs={12} sm={6}>
            <div className="plantView">
              <p>{this.state.currentPlant.ScientificName} ({this.state.currentPlant.CommonName})</p>
              <img src={getBigFileName(this.state.currentPlant.ScientificName)}
              style={{
                height: '100%',
                width: '100%'
              }}/>
            </div>
          </Grid>
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

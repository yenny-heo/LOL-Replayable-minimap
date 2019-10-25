import React from 'react';
import axios from 'axios';
import { Stage, Layer, Image, Circle } from 'react-konva';
import './App.css';

const matchID = "3931756472";
const rad = 20;

class App extends React.Component {

  state = {
    image: ""
  }

  componentDidMount() {
    this._callAPI();
    this._renderMap();
  }
  _callAPI = () => {
    axios.get(`/${matchID}?api_key=RGAPI-9913435b-4378-4fd7-b372-51e98788c1ac`)
      .then(res => {  console.log(res.data.frames); this.setState({ data: res.data.frames }); })
      .catch(err => console.log(err));
  }
  _renderMap = () =>{
    const image = new window.Image();
    image.src = "./images.jpeg"
    image.onload = () => {
      this.setState({
        image: image
      })
    }
  }

  _renderSummoner = () => {
    const { data } = this.state;
    let i = 14;
    let color;
    if(!data) return null;

    let summoners = Object.keys(data[i].participantFrames).map(key => {
      if(data[i].participantFrames[key].participantId <= 5) color = "blue";
      else color = "purple";
      return <Circle x={data[i].participantFrames[key].position.x/25}
      y={Math.abs(data[i].participantFrames[key].position.y/25-600)}
       radius={rad} fill={color} key={key}></Circle>
    })

    return summoners;
  }

  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        {this.state.data ?
        <Layer>
          <Image image={this.state.image} width={600} height={600}></Image>
          {this._renderSummoner()}
        </Layer>: null}
      </Stage>
    );
  }
}

export default App;

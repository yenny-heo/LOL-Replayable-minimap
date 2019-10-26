import React from 'react';
import axios from 'axios';
import { Stage, Layer, Image, Circle, Rect, Group } from 'react-konva';
import './App.css';

const matchID = "3931756472";
const rad = 15;

class App extends React.Component {

  state = {
    image: "",
    time: 0
  }

  componentDidMount() {
    this._callAPI();
    this._renderMap();

    //this.interval = setInterval(() => this.setState({ time: this.state.time + 1 }), 2000);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _callAPI = () => {
    axios.get(`/${matchID}?api_key=RGAPI-9913435b-4378-4fd7-b372-51e98788c1ac`)
      .then(res => { console.log(res.data.frames); this.setState({ data: res.data.frames }); })
      .catch(err => console.log(err));
  }

  _renderMap = () => {
    this._createTurret();
    const image = new window.Image();
    image.src = "./images.jpeg"
    image.onload = () => {
      this.setState({
        image: image
      })
    }
  }

  _renderSummoner = () => {
    const { data, time } = this.state;
    let i = time;
    let color;
    if (!data) return null;
    console.log(time, data.length);
    if (time >= data.length - 1) clearInterval(this.interval);

    let summoners = Object.keys(data[i].participantFrames).map(key => {
      //레드팀 블루팀
      if (data[i].participantFrames[key].participantId <= 5) color = "blue";
      else color = "purple";
      return <Circle x={data[i].participantFrames[key].position.x / 25}
        y={Math.abs(data[i].participantFrames[key].position.y / 25 - 600)}
        radius={rad} fill={color} stroke="black" key={key}></Circle>
    })
    return summoners;
  }

  _createTurret = () => {
    const blueTurret = {
      top_lane:{
        outer:{x:30,y:417.64},
        inner:{x:50,y:280},
        base:{x:38,y:190},
        restrain:{x:46.84,y:142.84}
      },
      mid_lane:{
        outer:{x:233.84, y:280},
        inner:{x:195, y:220},
        base:{x:135, y:160},
        restrain:{x:120,y:120},
        nexust1:{x:80,y:90},
        nexust2:{x:60,y:110},
        nexus:{x:60,y:60}
      },
      bot_lane:{
        outer:{x:420,y:55},
        inner:{x:276,y:75},
        base:{x:171,y:65},
        restrain:{x:138,y:49}
      }
    }
    this.setState({blueTurret: blueTurret});
  }

  _renderTurret = () =>{
    const { blueTurret } = this.state;

    let turrets = Object.keys(blueTurret).map((lane) => {
      return Object.keys(blueTurret[lane]).map((t, i) => {
        if(t === "restrain" || t === "nexus")
              return <Circle x={blueTurret[lane][t].x} y={Math.abs(blueTurret[lane][t].y-600)} radius={13} fill="DeepSkyBlue" stroke="black" key={i}></Circle>
        else return <Rect x={blueTurret[lane][t].x} y={Math.abs(blueTurret[lane][t].y-600)} height={30} width={20} fill="DeepSkyBlue" stroke="black" key={i}></Rect>
      })
    })
    return turrets;
  }

  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        {(this.state.data && this.state.blueTurret) ?
          <Layer>
            <Image image={this.state.image} width={600} height={600}></Image>
            {this._renderTurret()}
            {this._renderSummoner()}
          </Layer> : null}
      </Stage>
    );
  }
}

export default App;

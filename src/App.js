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
    this._renderImage();

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

  _renderImage = () => {
    const map = new window.Image();
    map.src = "./images.jpeg"
    map.onload = () => {
      this.setState({
        map: map
      })
    }
    const blueTurret = new window.Image();
    blueTurret.src="./blue_turret.png"
    blueTurret.onload = () => {
      this.setState({
        blueTurret:blueTurret
      })
    }
    const redTurret = new window.Image();
    redTurret.src="./red_turret.png"
    redTurret.onload = () => {
      this.setState({
        redTurret:redTurret
      })
    }
    console.log(redTurret);
    this._createTurret();
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
      else color = "red";
      return <Circle x={data[i].participantFrames[key].position.x / 25}
        y={Math.abs(data[i].participantFrames[key].position.y / 25 - 600)}
        radius={rad} fill={color} stroke="black" key={key}></Circle>
    })
    return summoners;
  }

  _createTurret = () => {
    const Turret = {
      blue: {
        TOP_LANE: {
          OUTER_TURRET: { x: 30, y: 417.64 },
          INNER_TURRET: { x: 50, y: 280 },
          BASE_TURRET: { x: 38, y: 190 },
          UNDEFINED_TURRET: { x: 46.84, y: 142.84 }
        },
        MID_LANE: {
          OUTER_TURRET: { x: 233.84, y: 280 },
          INNER_TURRET: { x: 195, y: 220 },
          BASE_TURRET: { x: 135, y: 160 },
          UNDEFINED_TURRET: { x: 120, y: 120 },
          NEXUS_TURRET1: { x: 80, y: 90 },
          NEXUS_TURRET2: { x: 60, y: 110 },
          nexus: { x: 60, y: 60 }
        },
        BOT_LANE: {
          OUTER_TURRET: { x: 420, y: 55 },
          INNER_TURRET: { x: 276, y: 75 },
          BASE_TURRET: { x: 171, y: 65 },
          UNDEFINED_TURRET: { x: 138, y: 49 }
        }
      },
      red: {
        TOP_LANE: {
          OUTER_TURRET: { x: 170, y: 580 },
          INNER_TURRET: { x: 310, y: 555 },
          BASE_TURRET: { x: 410, y: 565 },
          UNDEFINED_TURRET: { x: 450, y: 550 }
        },
        MID_LANE: {
          OUTER_TURRET: { x: 355, y: 360 },
          INNER_TURRET: { x: 380, y: 420 },
          BASE_TURRET: { x: 440, y: 470 },
          UNDEFINED_TURRET: { x: 475, y: 480 },
          NEXUS_TURRET1: { x: 500, y: 540 },
          NEXUS_TURRET2: { x: 520, y: 520 },
          nexus: { x: 540, y: 540 }
        },
        BOT_LANE: {
          OUTER_TURRET: { x: 550, y: 185 },
          INNER_TURRET: { x: 530, y: 340 },
          BASE_TURRET: { x: 540, y: 450 },
          UNDEFINED_TURRET: { x: 550, y: 470 }
        }
      }
    }
    this.setState({ Turret: Turret });
  }

  _renderTurret = () => {
    const { Turret } = this.state;

    let turrets = Object.keys(Turret).map((team) => {
      return Object.keys(Turret[team]).map((lane) => {
        return Object.keys(Turret[team][lane]).map((t, i) => {
          let color, image;
          if(team === "blue") { color = "DeepSkyBlue"; image = this.state.blueTurret;  }
          else { color = "FireBrick"; image = this.state.redTurret; }
          if (t === "UNDEFINED_TURRET" || t === "nexus")
          return <Circle x={Turret[team][lane][t].x} y={Math.abs(Turret[team][lane][t].y - 600)} radius={13} fill={color} stroke="black" key={i}></Circle>
        else return <Rect x={Turret[team][lane][t].x} y={Math.abs(Turret[team][lane][t].y - 600)} height={30} width={20} fillPatternImage={image} key={i}></Rect>
        })
      })
    })
    return turrets;
  }

  render() {
    return (
      <Stage width={window.innerWidth} height={window.innerHeight}>
        {(this.state.data && this.state.Turret) ?
          <Layer>
            <Image image={this.state.map} width={600} height={600}></Image>
            {this._renderTurret()}
            {this._renderSummoner()}
          </Layer> : null}
      </Stage>
    );
  }
}

export default App;

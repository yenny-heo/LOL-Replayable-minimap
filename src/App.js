import React from 'react';
import axios from 'axios';
import { Stage, Layer, Image, Circle, Rect } from 'react-konva';
import './App.css';
import Summoner from './Summoner'
import Timeline from './Timeline'
import Itemlist from './Itemlist'

const matchID = "4198162101";
const timeInterval = 2000;

let championInfo = "";
let champions = [];
let blueScore = [];
let redScore = [];

let turretDestroy = {
  blue: {
    TOP_LANE: 0, MID_LANE: 0, BOT_LANE: 0,
    INHIBIT_CNT: 0
  },
  red: {
    TOP_LANE: 0, MID_LANE: 0, BOT_LANE: 0,
    INHIBIT_CNT: 0
  }
}

class App extends React.Component {

  state = {
    image: "",
    time: 0,
    timeline: ""
  }

  componentDidMount() {
    this._callAPI();
    this._renderImage();
    setTimeout(() => {
      this.interval = setInterval(() => this.setState({ time: this.state.time + 1 }), timeInterval);
    }, 2000);

  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  _callAPI = () => {
    axios.get(`timelines/by-match/${matchID}?api_key=RGAPI-9913435b-4378-4fd7-b372-51e98788c1ac`)
      .then(res => { console.log(res.data.frames); this.setState({ data: res.data.frames }); return this._scanEvent(res.data.frames); })
      .then(timeline => { this.setState({ timeline: timeline }); })
      .catch(err => console.log(err));

    axios.get(`matches/${matchID}?api_key=RGAPI-9913435b-4378-4fd7-b372-51e98788c1ac`)
      .then(res => { console.log(res.data); this.setState({ party: res.data }); return this.state.party })
      .then(party => { return this._callChampAPI() })
      .catch(err => console.log(err));

  }

  _callChampAPI = () => {
    //챔피언 정보 가져오기
    axios.get("http://ddragon.leagueoflegends.com/cdn/10.5.1/data/en_US/champion.json")
      .then(res => {console.log(res.data.data); championInfo = res.data.data; return this._getChampId() })
      .then(err => console.log(err));
  }

  //챔피언 키로부터 이름 가져오기
  _getChampId = () => { 
    const { party } = this.state;
    for(var i = 0; i < 10; i++){
        party.participants[i].championId += "";
        for(var j in championInfo){
            if(championInfo[j].key === party.participants[i].championId){
                champions[i] = j;
            }
        }
    }
  }

  _scanEvent = (data) => {
    let timeline = new Array(100);
    for (let i = 0; i < timeline.length; i++) {
      timeline[i] = new Array();
    }

    for (let i = 0; i < data.length; i++) {
      let k = 0;
      blueScore[i] = 0;
      redScore[i] = 0;
      for (let j = 0; j < data[i].events.length; j++) {
        const curEvent = data[i].events[j];
        if (curEvent.type === "BUILDING_KILL") {
          timeline[i][k] = { type: "BUILDING_KILL", team: curEvent.teamId };
          k++;
        }
        else if (curEvent.type === "CHAMPION_KILL") {
          timeline[i][k] = { type: "CHAMPION_KILL", killer: curEvent.killerId, victim: curEvent.victimId };
          k++;
          if (curEvent.killerId <= 5) blueScore[i]++;
          else redScore[i]++;
        }
      }
      if (i !== 0) { blueScore[i] += blueScore[i - 1]; redScore[i] += redScore[i - 1]; }
    }
    return timeline;
  }


  _renderImage = () => {
    const map = new window.Image();
    map.src = "./map.png"

    const blueTurret = new window.Image();
    blueTurret.src = "./blue_turret.png"

    const redTurret = new window.Image();
    redTurret.src = "./red_turret.png"
    redTurret.onload = () => {
      this.setState({
        map: map,
        blueTurret: blueTurret,
        redTurret: redTurret
      })
    }

    this._createTurret();
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
          INNER_TURRET: { x: 310, y: 560 },
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
          //팀에 따른 포탑, 억제기 외형과 색
          if (team === "blue") { color = "DeepSkyBlue"; image = this.state.blueTurret; }
          else { color = "FireBrick"; image = this.state.redTurret; }
          //파괴된 포탑은 렌더링 X
          if (turretDestroy[team][lane] > i)
            return null;
          else if (t === "UNDEFINED_TURRET" || t === "nexus")
            return <Circle x={Turret[team][lane][t].x} y={Math.abs(Turret[team][lane][t].y - 600)} radius={13} fill={color} stroke="black" key={i}></Circle>
          else return <Rect x={Turret[team][lane][t].x} y={Math.abs(Turret[team][lane][t].y - 600)} height={35} width={25} fillPatternImage={image} key={i}></Rect>
        })
      })
    })
    return turrets;
  }

  _turretEvent = () => {
    const { data, time } = this.state;
    let event = data[time].events;
    //억제기 재생성
    if(turretDestroy.blue["INHIBIT_CNT"] === 6){
      turretDestroy.blue["MID_LANE"] = 3;
      turretDestroy.blue["INHIBIT_CNT"] = 0;
    }
    //억제기 재생성
    if(turretDestroy.red["INHIBIT_CNT"] === 6){
      turretDestroy.red["MID_LANE"] = 3;
      turretDestroy.red["INHIBIT_CNT"] = 0;
    }
    for (let i = 0; i < event.length; i++) {
      if (event[i].type === "BUILDING_KILL") {
        if (event[i].teamId === 100){
          turretDestroy.blue[event[i].laneType]++;
        }
        else {
          turretDestroy.red[event[i].laneType]++;
        }
      }
    }
    //억제기 재생성 카운트
    if(turretDestroy.blue["MID_LANE"] === 4)
      turretDestroy.blue["INHIBIT_CNT"]++;

    //억제기 재생성 카운트
    if(turretDestroy.red["MID_LANE"] === 4)
      turretDestroy.red["INHIBIT_CNT"]++;

    return this._renderTurret();
  }


  render() {
    return (
      <div>
        {(this.state.data && this.state.Turret && this.state.party && this.state.timeline) ?
          <div className="Container">
            <span className="Title">L O L - M I N I M A P - R E P L A Y</span>
            <div className="Map">
              <Itemlist
              champName={champions}
              party={this.state.party}
              time={this.state.time}
              data={this.state.data}></Itemlist>
              <Stage width={600} height={600}>
                <Layer>
                  <Image image={this.state.map} width={600} height={600}></Image>
                  <Summoner
                    interval={this.interval}
                    data={this.state.data}
                    time={this.state.time}
                    party={champions}></Summoner>
                  {this._turretEvent()}
                </Layer>
              </Stage>
              <Timeline
                timeline={this.state.timeline}
                time={this.state.time}
                gamelength={this.state.data.length - 1}
                champName={champions}
                party={this.state.party}></Timeline>
            </div>
            <div className="Score">
              <div className="BlueScore">
                {blueScore[this.state.time]}
              </div>
              ⠀<img src="./score.png" alt="score" className="ScoreIcon"></img>⠀
              <div className="RedScore">
                {redScore[this.state.time]}</div>
              </div>
          </div>
          : null}
      </div>
    );
  }
}

export default App;

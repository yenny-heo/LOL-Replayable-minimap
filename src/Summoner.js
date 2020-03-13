import React from 'react';
import axios from 'axios';
import { Group, Circle } from 'react-konva';

const rad = 20;
let images = {};

let championInfo = "";
class Summoner extends React.Component {

    state={
        image: false
    }
    componentDidMount() {
        this._summonerImage();
    }

    // _callAPI = () => {
    //     axios.get("http://ddragon.leagueoflegends.com/cdn/10.5.1/data/en_US/champion.json")
    //     .then(res => {console.log(res.data.data); championInfo = res.data.data; return this._getChampId() })
    //     .then(err => console.log(err));
    // }

    // _getChampId = () => { 
    //     const { party } = this.props;
    //     for(var i = 0; i < 10; i++){
    //         party[i].championId += "";
    //         for(var j in championInfo){
    //             console.log(championInfo[j].key === party[i].championId);
    //             if(championInfo[j].key === party[i].championId){
    //                 console.log(j);
    //                 images[i] = new Image();
    //                 images[i].src = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/champion/${j}.png`;

    //                 if(i === 9) images[i].onload = () => {this.setState({image: true})};
    //             }
    //         }
    //     }
    // }

    _summonerImage = () => {
        const { party } = this.props;
        for (var i = 0; i < 10; i++) {
            images[i] = new Image();
            images[i].src = `http://ddragon.leagueoflegends.com/cdn/10.5.1/img/champion/${party[i]}.png`;
            //마지막 이미지가 로드 되었을 때 Render
            if(i === 9) images[i].onload = () => {this.setState({image: true})};
        }
    }

    _renderSummoner = () => {
        const { data, time, interval } = this.props;
        let i = time;
        let color;
        if (!data) return null;
        if (time >= data.length - 1){ clearInterval(interval); return null;}

        let summoners = Object.keys(data[i].participantFrames).map(key => {
            //레드팀 블루팀
            const id = data[i].participantFrames[key].participantId;
            if (id <= 5) color = "blue";
            else color = "FireBrick";
            return <Circle x={data[i].participantFrames[key].position.x / 25}
                y={Math.abs(data[i].participantFrames[key].position.y / 25 - 600)}
                radius={rad} fillPatternImage={images[id-1]}
                fillPatternOffset={{x:rad*3, y:rad*3}} fillPatternScale={{x:0.4, y:0.4}} 
                stroke={color} strokeWidth={6} key={key}></Circle>
        })
        return summoners;
    }

    render() {
        return (
            <Group>
            {this.state.image ? this._renderSummoner() : null}
            </Group>
        )
    }
}
export default Summoner;
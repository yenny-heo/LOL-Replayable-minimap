import React from 'react';
import './Itemlist.css';
let itemLists = [[], [], [], [], [], [], [], [], [], []];
class Itemlist extends React.Component {

    _renderChampImg = () => {
        const { party } = this.props;
        return party.participants.map((data, i) => {
            const imgsrc = `./icon/${data.championId}.png`
            if(i < 5){
                return <img className="ChampBlueIcon" src={imgsrc} alt="champ" key={i}></img>
            } else return <img className="ChampRedIcon" src={imgsrc} alt="champ" key={i}></img>
        })
    }

    _updateItems = () => {
        const { time, data } = this.props;
        const curEvent = data[time].events;
        curEvent.map((data, i) => {
            const partId = data.participantId - 1;
            const itemId = data.itemId;
            if (data.type === "ITEM_PURCHASED") {
                if (itemId === 2003) {//포션
                    if(itemLists[partId][8] === undefined)
                        itemLists[partId][8] = {id: 2003, num: 1}
                    else{
                        const n = itemLists[partId][8].num;
                        itemLists[partId][8] = {id: 2003, num: n+1};
                    }
                } else if (itemId === 2055) {//제어와드
                    if(itemLists[partId][9] === undefined)
                        itemLists[partId][9] = {id: 2055, num: 1}
                    else{
                        const n = itemLists[partId][9].num;
                        itemLists[partId][9] = {id: 2055, num: n+1};
                    }
                } else if (itemId === 3340 || itemId === 3364 || itemId === 3363){//기본와드
                    itemLists[partId][10] = itemId;
                } 
                else {//기타 아이템
                    for (let i = 0; i <= 7; i++) {
                        if (itemLists[partId][i] === undefined) {
                            itemLists[partId][i] = itemId;
                            break;
                        }
                    }
                }
            }
            else if (data.type === "ITEM_DESTROYED") {
                if (itemId === 2003) {//포션
                    const n = itemLists[partId][8].num;
                    itemLists[partId][8] = {id: 2003, num: n-1};
                } else if (itemId === 2055) {//제어와드
                    const n = itemLists[partId][9].num;
                    itemLists[partId][9] = {id: 2055, num: n-1};
                } else {//기타 아이템
                    for(let i = 0; i <= 7; i++){
                        if(itemLists[partId][i] === itemId){
                            itemLists[partId][i] = undefined;
                            break;
                        }
                    }
                }
            }
            else if (data.type === "ITEM_UNDO") {
                if (data.beforeId === 2003) {//포션
                    const n = itemLists[partId][8].num;
                    itemLists[partId][8] = {id: 2003, num: n - 1};
                } else if (data.beforeId === 2055) {//제어와드
                    const n = itemLists[partId][9].num;
                    itemLists[partId][9] = {id: 2055, num: n - 1};
                } else {//기타 아이템
                    for(let i = 0; i <= 7; i++){
                        if(itemLists[partId][i] === data.beforeId){
                            itemLists[partId][i] = undefined;
                            break;
                        }
                    }
                }
            }
            else if (data.type === "ITEM_SOLD") {
                if (itemId === 2003) {//포션
                    const n = itemLists[partId][8].num;
                    itemLists[partId][8] = {id: 2003, num: n - 1};
                } else if (itemId === 2055) {//제어와드
                    const n = itemLists[partId][9].num;
                    itemLists[partId][9] = {id: 2055, num: n - 1};
                } else {//기타 아이템
                    for(let i = 0; i <= 7; i++){
                        if(itemLists[partId][i] === itemId){
                            itemLists[partId][i] = undefined;
                            break;
                        }
                    }
                }
            }
        })

        return this._renderItems();

    }

    _renderItems = () => {
        return itemLists.map((part, i) => {
            return <div className="ChampItem">{part.map((item, j) => {
                if(j === 8 && item.num !== 0 ){
                    return <img className="Item" src="http://ddragon.leagueoflegends.com/cdn/9.21.1/img/item/2003.png" alt="potion"></img>
                } else if(j === 9 && item.num !== 0){
                    return <img className="Item" src="http://ddragon.leagueoflegends.com/cdn/9.21.1/img/item/2055.png" alt="ward"></img>
                } else if(j !==8 && j !== 9 && item !== undefined){
                    const imgsrc = `http://ddragon.leagueoflegends.com/cdn/9.21.1/img/item/${item}.png`
                    return <img className="Item" src={imgsrc} alt="item"></img>
                } else return null;
            })}</div>
        })
    }


    render() {
        return (
            <div className="Container3">
                <div className="ChampImages">
                    {this._renderChampImg()}
                </div>
                <div className="ItemLists">
                    {this._updateItems()}
                </div>
            </div>
        )
    }
}

export default Itemlist;
# League of Legend Minimap Replay

league of legend의 match Id를 통해, 미니맵으로 리플레이와 타임라인을 볼 수 있는 모듈입니다.
리플레이는 1분단위로 제공됩니다.

## Getting Started

### how to use

Enter League of Legend match Id for```matchID```

### execute project

```shell
$ npm start
```

## Example of execution 

![example](./image/example1.png)

## properties

### matchID

- type: const
- default: 3931756472 (my match ID)

: game's matchID

### timeInterval

- Type: const
- Default: 2000
- min: 1000

: replay execution time interval. if ```timeInterval``` is 2000, replay are played every 2 seconds.

### blueScore/redScore

- type: array

: blue/red team score per minute

### turretDestroy

- Type: object

: number of destroyed turrets




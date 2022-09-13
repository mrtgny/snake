import { FC } from "react";

const Map: FC<{
    mapSize: number[];
    map: number[][];
    diamondCoordinate: number[],
    isPartOfSnake: (snakeCoorinates: number[][], mapCoordinates: number[]) => boolean;
    score: number;
    snakeCoordinates: number[][]
}> = ({
    mapSize,
    map,
    score,
    diamondCoordinate,
    isPartOfSnake,
    snakeCoordinates
}) => {
        if (!mapSize) return null;
        return (
            <>
                {
                    map.map((item, y) => {
                        return item.map((_, x) => {
                            const diamond = diamondCoordinate[0] === x && y === diamondCoordinate[1];
                            return <div className={isPartOfSnake(snakeCoordinates, [x, y]) ? "snake-item" : diamond ? "diamond" : "map-item"}
                                key={x}
                                style={{
                                    transition: score > 5 ? '0.4s' : '0s',
                                    width: Math.min(...mapSize),
                                    height: Math.min(...mapSize),
                                }} />
                        })
                    })
                }
            </>
        )
    }

export default Map;
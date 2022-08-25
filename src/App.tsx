import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import './App.css';
import { useHighScore } from './hooks/useHighScore';
import { useSwipGesture } from './hooks/useSwipeGesture';
import { DirectionType, KeyCodeDirection, KeyCodeType, OppositeKeyCodeDirection } from './types';

const Game = (): JSX.Element => {
    const swipeGestures = useSwipGesture();
    const { getHighScore, setHightScore } = useHighScore()
    const [map, setMap] = useState<[number?][]>([]);
    const [mapSize, setMapSize] = useState([0, 0]);
    const [snakeCoordinates, setSnakeCoordinates] = useState([[5, 0], [5, 1], [5, 2]]);
    const [diamondCoordinate, setDiamonCoordinate] = useState([0, 0]);
    const [isGameOver, setIsGameOver] = useState(false);
    const [isGameStarted, setIsGameStarted] = useState(false);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(0);
    const [countDown, setCountDown] = useState(3);
    const direction = useRef<DirectionType>("r");
    const gameInterval = useRef<NodeJS.Timer>();
    const timerInterval = useRef<NodeJS.Timer>();
    const [headerHeight, setHeaderHeight] = useState(40);

    const setDirection = useCallback((newDirection: DirectionType) => {
        direction.current = newDirection;
    }, [])

    const resetIntervals = useCallback(() => {
        if (gameInterval.current) clearInterval(gameInterval.current);
        if (timerInterval.current) clearInterval(timerInterval.current);
    }, [])

    const getMapInfo = useCallback((_innerHeight?: number, _innerWidth?: number) => {
        const innerWidth = _innerWidth || window.innerWidth;
        const innerHeight = _innerHeight || window.innerHeight;

        const rowCount = 50;
        const mapHeight = innerHeight - 40;
        const mapWidth = innerWidth;
        const edgeLength = innerWidth / rowCount;
        const columnCount = parseInt(`${mapHeight / edgeLength}`)

        return {
            rowCount,
            mapHeight,
            mapWidth,
            edgeLength,
            columnCount,
        }
    }, [])

    const onGameOver = useCallback(() => {
        setCountDown(3);
        setHightScore(score);
        resetIntervals()
        setIsGameOver(true)
        setIsGameStarted(false);
    }, [score, setHightScore, resetIntervals]);

    const isPartOfSnake = useCallback((snakeCoordinates, coordinate: number[]) => {
        return JSON.stringify(snakeCoordinates).indexOf(JSON.stringify(coordinate)) > -1;
    }, [])

    const generateDiamondCoordinate = useCallback((snakeCoordinates): [number, number] => {
        const { rowCount, columnCount } = getMapInfo()
        const x = parseInt(`${Math.random() * rowCount}`);
        const y = parseInt(`${Math.random() * columnCount}`);

        return isPartOfSnake(snakeCoordinates, [x, y]) ? generateDiamondCoordinate(snakeCoordinates) : [x, y];
    }, [isPartOfSnake, getMapInfo]);

    const move = useCallback(() => {
        const { rowCount, columnCount } = getMapInfo()
        setSnakeCoordinates(old => {
            let [x, y] = [...old[old.length - 1]];
            const newCoordinates = [...old]
            switch (direction.current) {
                case "r":
                    x = (x + 1) % rowCount;
                    break;
                case "l":
                    x = (x + (rowCount - 1)) % rowCount;
                    break;
                case "u":
                    y = (y + (columnCount - 1)) % columnCount;
                    break;
                case "d":
                    y = (y + 1) % columnCount;
                    break;
                default:
                    break;
            }

            if (isPartOfSnake(old, [x, y])) {
                onGameOver();
                return old;
            }

            newCoordinates.push([x, y]);
            if (JSON.stringify([x, y]) !== JSON.stringify(diamondCoordinate)) {
                newCoordinates.shift();
            } else {
                setScore(old => old + 1);
                setDiamonCoordinate(generateDiamondCoordinate(newCoordinates))
            }
            return [...newCoordinates]
        })
    }, [diamondCoordinate, isPartOfSnake, onGameOver, generateDiamondCoordinate, getMapInfo]);

    const setItemSize = useCallback(() => {
        const { edgeLength } = getMapInfo();
        setMapSize([edgeLength, edgeLength]);
    }, [getMapInfo]);

    const startGame = useCallback(() => {
        resetIntervals()
        gameInterval.current = setInterval(move, 100);
        timerInterval.current = setInterval(() => {
            setTime(old => old + 1)
        }, 1000);

        const listener = (ev: KeyboardEvent) => {
            const keyCode = ev.code as KeyCodeType
            const newDirection = KeyCodeDirection[keyCode] as DirectionType;
            const oppositeNewDirection = OppositeKeyCodeDirection[keyCode] as DirectionType;
            if (!newDirection) return;
            if (oppositeNewDirection !== direction.current) setDirection(newDirection)
        }
        document.addEventListener('keydown', listener, { passive: true })
        return () => {
            document.removeEventListener("keydown", listener)
        }
    }, [resetIntervals, move, setDirection]);

    const initGame = useCallback(() => {
        setIsGameOver(false);
        if (isGameStarted) return;
        const countDown = setInterval(() => {
            setCountDown(old => {
                const newCountDown = old - 1
                if (newCountDown === 0) {
                    setIsGameStarted(true)
                    clearInterval(countDown);
                }
                return newCountDown;
            })
        }, 1000);
        return () => {
            clearInterval(countDown);
        }
    }, [isGameStarted]);

    useEffect(() => {
        if (isGameStarted) {
            return startGame()
        }
    }, [startGame, isGameStarted])

    const renderMap = () => {
        if (!mapSize) return null;
        return map.map((item, y) => {
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

    const renderTime = () => {
        const _mintes = parseInt(`${time / 60}`);
        const _seconds = parseInt(`${time % 60}`);

        const minutes = _mintes < 10 ? "0" + _mintes : _mintes;
        const seconds = _seconds < 10 ? "0" + _seconds : _seconds;

        return minutes + ":" + seconds;
    }

    const initMap = useCallback(() => {
        const { rowCount, columnCount, edgeLength } = getMapInfo();
        const mapHeight = columnCount * edgeLength;
        setHeaderHeight(window.innerHeight - mapHeight);
        const matrix: [number?][] = [];
        for (let i = 0; i < columnCount; i++) {
            matrix[i] = [];
            for (let j = 0; j < rowCount; j++) {
                matrix[i][j] = 0;
            }
        }
        setMap(matrix);
    }, [getMapInfo])

    const isDiamondInMap = useCallback(() => {
        const [x, y] = diamondCoordinate;
        const { rowCount, columnCount } = getMapInfo();
        if (rowCount < x || columnCount < y) {
            setDiamonCoordinate(generateDiamondCoordinate(snakeCoordinates))
        }
    }, [generateDiamondCoordinate, diamondCoordinate, snakeCoordinates, getMapInfo])

    useEffect(() => {
        initMap()
        setItemSize();
        window.onresize = () => {
            initMap()
            setItemSize();
            isDiamondInMap()
        }
    }, [initMap, setItemSize, isDiamondInMap])

    useLayoutEffect(() => {
        return initGame()
    }, [setItemSize, initGame])

    return (
        <div className="container"
            {...swipeGestures}
        >
            <CountDown countDown={countDown} />
            <GameOverDialog
                gameOver={isGameOver}
                score={score}
                highScore={getHighScore()}
                time={renderTime()}
                onTryAgain={initGame}
            />
            <div className="header" style={{
                height: headerHeight
            }}>
                <div
                    style={{
                        display: "flex",
                        justifyContent: "space-around",
                        alignItems: "center",
                        color: "white",
                        height: "100%",
                    }}>
                    <p>High Score: {getHighScore()}</p>
                    <p>Score: {score}</p>
                    <p>Time: {renderTime()}</p>
                </div>
            </div>
            <div className="map">
                {renderMap()}
            </div>
        </div>
    );
}

const CountDown = ({ countDown }: {
    countDown: number
}): JSX.Element => {
    const className = !countDown ? "count-down-container-out" : "count-down-container";
    return (
        <div className={className + " center count-down"}>
            {countDown}
        </div>
    )
};

const GameOverDialog = ({ gameOver, highScore, score, time, onTryAgain }: {
    gameOver: boolean,
    onTryAgain: () => void;
    highScore: number,
    score: number,
    time: string,
}) => {
    return (
        <div className={gameOver ? "game-over-dialog-on" : "game-over-dialog-off"}>
            <h1>Game Over</h1>
            <div>
                <p>High Score: {highScore}</p>
                <p>Score: {score}</p>
                <p>Time: {time}</p>
            </div>
            <button className="button" onClick={onTryAgain}>Try Again</button>
        </div>
    )
};

export default Game;
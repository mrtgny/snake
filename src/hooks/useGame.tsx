import { useCallback, useEffect, useRef, useState } from "react";
import {
  getInitialDirection,
  getInitialDirections,
  getInitialSnakePosition,
} from "utils/constants";
import {
  DirectionType,
  KeyCodeDirection,
  KeyCodeType,
  OppositeKeyCodeDirection,
} from "utils/types";
import { useHighScore } from "./useHighScore";
import usePageHeight from "./usePageHeight";

const useGame = () => {
  const { setHightScore } = useHighScore();
  const [map, setMap] = useState<number[][]>([]);
  const [mapSize, setMapSize] = useState([0, 0]);
  const [snakeCoordinates, setSnakeCoordinates] = useState(
    getInitialSnakePosition()
  );
  const [diamondCoordinate, setDiamonCoordinate] = useState([0, 0]);
  const [isGameOver, setIsGameOver] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(0);
  const [countDown, setCountDown] = useState(3);
  const directions = useRef<DirectionType[]>(getInitialDirections());
  const lastDirection = useRef<DirectionType>(getInitialDirection());
  const gameInterval = useRef<NodeJS.Timer>();
  const timerInterval = useRef<NodeJS.Timer>();
  const [headerHeight, setHeaderHeight] = useState(40);
  const [pageHeight] = usePageHeight();

  const setDirection = useCallback((newDirection: DirectionType) => {
    directions.current.push(newDirection);
  }, []);

  const resetIntervals = useCallback(() => {
    if (gameInterval.current) clearInterval(gameInterval.current);
    if (timerInterval.current) clearInterval(timerInterval.current);
  }, []);

  const getMapInfo = useCallback(
    (_innerHeight?: number, _innerWidth?: number) => {
      const innerWidth = _innerWidth || window.innerWidth;
      const innerHeight = _innerHeight || pageHeight;

      const rowCount = parseInt(`${innerHeight / 30}`);
      const mapHeight = innerHeight - 40;
      const mapWidth = innerWidth;
      const edgeLength = innerWidth / rowCount;
      const columnCount = parseInt(`${mapHeight / edgeLength}`);

      return {
        rowCount,
        mapHeight,
        mapWidth,
        edgeLength,
        columnCount,
      };
    },
    [pageHeight]
  );

  const onGameOver = useCallback(() => {
    setCountDown(3);
    setHightScore(score);
    resetIntervals();
    setIsGameOver(true);
  }, [score, setHightScore, resetIntervals]);

  const isPartOfSnake = useCallback(
    (snakeCoordinates, coordinate: number[]) => {
      return (
        JSON.stringify(snakeCoordinates).indexOf(JSON.stringify(coordinate)) >
        -1
      );
    },
    []
  );

  const generateDiamondCoordinate = useCallback(
    (snakeCoordinates): [number, number] => {
      const { rowCount, columnCount } = getMapInfo();
      const x = parseInt(`${Math.random() * rowCount}`);
      const y = parseInt(`${Math.random() * columnCount}`);

      return isPartOfSnake(snakeCoordinates, [x, y])
        ? generateDiamondCoordinate(snakeCoordinates)
        : [x, y];
    },
    [isPartOfSnake, getMapInfo]
  );

  const move = useCallback(() => {
    const { rowCount, columnCount } = getMapInfo();
    setSnakeCoordinates((old) => {
      let [x, y] = [...old[old.length - 1]];
      const newCoordinates = [...old];
      const nextDirection =
        directions.current.length > 0
          ? directions.current.shift()
          : lastDirection.current;
      lastDirection.current = nextDirection!;
      switch (nextDirection) {
        case KeyCodeDirection.ArrowRight:
          x = (x + 1) % rowCount;
          break;
        case KeyCodeDirection.ArrowLeft:
          x = (x + (rowCount - 1)) % rowCount;
          break;
        case KeyCodeDirection.ArrowUp:
          y = (y + (columnCount - 1)) % columnCount;
          break;
        case KeyCodeDirection.ArrowDown:
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
        setScore((old) => old + 1);
        setDiamonCoordinate(generateDiamondCoordinate(newCoordinates));
      }
      return [...newCoordinates];
    });
  }, [
    diamondCoordinate,
    isPartOfSnake,
    onGameOver,
    generateDiamondCoordinate,
    getMapInfo,
  ]);

  const setItemSize = useCallback(() => {
    const { edgeLength } = getMapInfo();
    setMapSize([edgeLength, edgeLength]);
  }, [getMapInfo]);

  const startGame = useCallback(() => {
    resetIntervals();
    gameInterval.current = setInterval(
      move,
      Math.max(50, 150 - (score + 1) * 5)
    );
    timerInterval.current = setInterval(() => {
      setTime((old) => old + 1);
    }, 1000);
  }, [resetIntervals, move, score]);

  useEffect(() => {
    const listener = (ev: KeyboardEvent) => {
      const keyCode = ev.code as KeyCodeType;
      const newDirection = KeyCodeDirection[keyCode] as DirectionType;
      const oppositeNewDirection = OppositeKeyCodeDirection[
        keyCode
      ] as DirectionType;
      const nextDirection =
        directions.current.length > 0
          ? directions.current[directions.current.length - 1]
          : lastDirection.current;
      if (!newDirection) return;
      if (oppositeNewDirection !== nextDirection) setDirection(newDirection);
    };
    document.addEventListener("keydown", listener, { passive: true });
    return () => {
      document.removeEventListener("keydown", listener);
    };
  }, [setDirection]);

  const initGame = useCallback(() => {
    setIsGameOver(false);
    setSnakeCoordinates(getInitialSnakePosition());
    directions.current = getInitialDirections();
    lastDirection.current = getInitialDirection();
    setTime(0);
    setScore(0);
    if (isGameStarted) return;
    const countDown = setInterval(() => {
      setCountDown((old) => {
        const newCountDown = old - 1;
        if (newCountDown === 0) {
          setIsGameStarted(true);
          clearInterval(countDown);
        }
        return newCountDown;
      });
    }, 1000);
    return () => {
      clearInterval(countDown);
    };
  }, [isGameStarted]);

  useEffect(() => {
    if (isGameStarted) {
      return startGame();
    }
  }, [startGame, isGameStarted]);

  const initMap = useCallback(() => {
    const { rowCount, columnCount, edgeLength } = getMapInfo();
    const mapHeight = columnCount * edgeLength;
    setHeaderHeight(pageHeight - mapHeight);
    const matrix: number[][] = [];
    for (let i = 0; i < columnCount; i++) {
      matrix[i] = [];
      for (let j = 0; j < rowCount; j++) {
        matrix[i][j] = 0;
      }
    }
    setMap(matrix);
  }, [getMapInfo, pageHeight]);

  const isDiamondInMap = useCallback(() => {
    const [x, y] = diamondCoordinate;
    const { rowCount, columnCount } = getMapInfo();
    if (rowCount < x || columnCount < y) {
      setDiamonCoordinate(generateDiamondCoordinate(snakeCoordinates));
    }
  }, [
    generateDiamondCoordinate,
    diamondCoordinate,
    snakeCoordinates,
    getMapInfo,
  ]);

  const restartGame = () => {
    setIsGameStarted(false);
  };

  useEffect(() => {
    initMap();
    setItemSize();
    window.onresize = () => {
      initMap();
      setItemSize();
      isDiamondInMap();
    };
  }, [initMap, setItemSize, isDiamondInMap]);

  useEffect(() => {
    return initGame();
  }, [setItemSize, initGame]);

  return {
    countDown,
    isGameOver,
    score,
    time,
    restartGame,
    headerHeight,
    mapSize,
    map,
    diamondCoordinate,
    isPartOfSnake,
    snakeCoordinates,
  };
};

export default useGame;

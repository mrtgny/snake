import CountDown from "components/CountDown";
import GameOverDialog from "components/GameOverDialog";
import Header from "components/Header";
import Map from "components/Map";
import useGame from "hooks/useGame";
import { useHighScore } from "hooks/useHighScore";
import usePageHeight from "hooks/usePageHeight";
import { useSwipGesture } from "hooks/useSwipeGesture";
import { NextPage } from "next/types";

const Home: NextPage = () => {
  const swipeGestures = useSwipGesture();
  const { getHighScore } = useHighScore();
  const [pageHeight] = usePageHeight();

  const {
    countDown,
    isGameOver,
    time,
    restartGame,
    headerHeight,
    mapSize,
    map,
    score,
    diamondCoordinate,
    isPartOfSnake,
    snakeCoordinates,
  } = useGame();

  return (
    <div
      className="container"
      style={{ height: pageHeight }}
      {...swipeGestures}
    >
      <CountDown countDown={countDown} />
      <GameOverDialog
        gameOver={isGameOver}
        score={score}
        highScore={getHighScore()}
        time={time}
        onTryAgain={restartGame}
      />
      <Header headerHeight={headerHeight} score={score} time={time} />
      <div className="map">
        <Map
          mapSize={mapSize}
          map={map}
          score={score}
          diamondCoordinate={diamondCoordinate}
          isPartOfSnake={isPartOfSnake}
          snakeCoordinates={snakeCoordinates}
        />
      </div>
    </div>
  );
};

export default Home;

import { useHighScore } from "hooks/useHighScore";
import { FC } from "react";
import { renderTime } from "utils/functions";

const Header: FC<{
  headerHeight: number;
  time: number;
  score: number;
}> = ({ headerHeight, time, score }) => {
  const { getHighScore } = useHighScore();

  return (
    <div
      className="header"
      style={{
        height: headerHeight,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-around",
          alignItems: "center",
          color: "white",
          height: "100%",
        }}
      >
        <p>High Score: {getHighScore()}</p>
        <p>Score: {score}</p>
        <p>Time: {renderTime(time)}</p>
      </div>
    </div>
  );
};

export default Header;

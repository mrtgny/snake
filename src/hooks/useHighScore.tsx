import { useCallback } from "react";
import { isBrowser } from "utils/functions";

export const useHighScore = () => {
  const getHighScore = useCallback((): number => {
    if (!isBrowser()) return 0;
    const highScore = window.localStorage.getItem("highScore") || "0";
    return parseInt(highScore);
  }, []);

  const setHightScore = useCallback(
    (score: number): number => {
      if (!isBrowser()) return 0;
      const lastHighScore = getHighScore();
      if (score > lastHighScore) {
        window.localStorage.setItem("highScore", `${score}`);
        return score;
      } else {
        return lastHighScore;
      }
    },
    [getHighScore]
  );

  return {
    getHighScore,
    setHightScore,
  };
};

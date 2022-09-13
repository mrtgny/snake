import { renderTime } from "utils/functions";

const GameOverDialog = ({ gameOver, highScore, score, time, onTryAgain }: {
    gameOver: boolean,
    onTryAgain: () => void;
    highScore: number,
    score: number,
    time: number,
}) => {
    return (
        <div className={gameOver ? "game-over-dialog-on" : "game-over-dialog-off"}>
            <h1>Game Over</h1>
            <div>
                <p>High Score: {highScore}</p>
                <p>Score: {score}</p>
                <p>Time: {renderTime(time)}</p>
            </div>
            <button className="button" onClick={onTryAgain}>Try Again</button>
        </div>
    )
};

export default GameOverDialog;
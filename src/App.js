import React from 'react';
import './App.css';

const matrixSizeX = 50;
const matrixSizeY = 50;

class App extends React.Component {
    constructor(props, context) {
        super(props, context);

        const matrix = [];
        for (let i = 0; i < matrixSizeX; i++) {
            matrix[i] = [];
            for (let j = 0; j < matrixSizeY; j++) {
                matrix[i][j] = 0;
            }
        }

        this.state = {
            itemSize: 0,
            score: 0,
            time: 0,
            snakeCoordinates: [],
            map: matrix,
            direction: "r",
            countDown: 3,
            gameOver: false,
            highScore: 0
        };

        this.state.diamondCoordinate = this.generateDiamondCoordinate();
    }

    isPartOfSnake(coordinate) {
        const {snakeCoordinates} = this.state;
        return JSON.stringify(snakeCoordinates).indexOf(JSON.stringify(coordinate)) > -1;
    }

    generateDiamondCoordinate = () => {
        const x = parseInt(Math.random() * matrixSizeX);
        const y = parseInt(Math.random() * matrixSizeY);

        return this.isPartOfSnake([x, y]) ? this.generateDiamondCoordinate() : [x, y];
    };

    componentDidMount() {

        this.setItemSize();
        window.onresize = this.setItemSize;
        this.initGame()
    }

    setItemSize = () => {
        const itemSize = window.innerWidth / matrixSizeX;
        this.setState({itemSize});
    };

    getHighScore = () => {
        return parseInt(window.localStorage.getItem("highScore") || "0");
    };

    setHightScore = () => {
        const lastHighScore = this.getHighScore();
        const {score} = this.state;
        if (score > lastHighScore) {
            window.localStorage.setItem("highScore", score);
            this.setState({highScore: score});
        }
    };

    initGame = () => {
        this.setState({
            gameOver: false,
            score: 0,
            time: 0,
            snakeCoordinates: [[5, 0], [5, 1], [5, 2]],
            countDown: 3,
            direction: "r",
            highScore: this.getHighScore()
        }, () => {

            this.countDown = setInterval(() => {
                this.setState({countDown: this.state.countDown - 1}, () => {
                    if (this.state.countDown === 0) {
                        this.startGame();
                        clearInterval(this.countDown);
                    }
                })
            }, 1000);
        })

    };

    startGame = () => {
        setTimeout(() => {
            this.game = setInterval(this.move, 100);
            this.timer = setInterval(() => {
                this.setState({time: this.state.time + 1})
            }, 1000);

            const code = {
                ArrowUp: "u",
                ArrowDown: "d",
                ArrowLeft: "l",
                ArrowRight: "r",
            };

            const oppositeCode = {
                ArrowUp: "d",
                ArrowDown: "u",
                ArrowLeft: "r",
                ArrowRight: "l",
            };

            document.onkeydown = ev => {
                const {direction} = this.state;
                const newDirection = code[ev.code];
                if (!newDirection)
                    return;
                if (oppositeCode[ev.code] !== direction)
                    this.setState({direction: newDirection})
            }
        }, 500);
    };

    gameOver = () => {
        this.setHightScore();
        clearInterval(this.game);
        clearInterval(this.timer);
        this.setState({gameOver: true});
    };

    move = () => {
        const {direction, snakeCoordinates, diamondCoordinate} = this.state;

        const newValue = [...snakeCoordinates[snakeCoordinates.length - 1]];
        switch (direction) {
            case "r":
                newValue[1] = (newValue[1] + 1) % matrixSizeX;
                break;
            case "l":
                newValue[1] = (newValue[1] + (matrixSizeY - 1)) % matrixSizeY;
                break;
            case "u":
                newValue[0] = (newValue[0] + (matrixSizeY - 1)) % matrixSizeY;
                break;
            case "d":
                newValue[0] = (newValue[0] + 1) % matrixSizeY;
                break;
            default:
                break;
        }

        if (this.isPartOfSnake(newValue)) {
            this.gameOver();
            return;
        }

        snakeCoordinates.push(newValue);
        if (JSON.stringify(newValue) !== JSON.stringify(diamondCoordinate)) {
            snakeCoordinates.shift();
        } else {
            this.setState({
                score: this.state.score + 1,
                diamondCoordinate: this.generateDiamondCoordinate()
            })
        }

        this.setState({snakeCoordinates});
    };

    renderMap() {
        const {map, itemSize, diamondCoordinate} = this.state;
        if (!itemSize)
            return null;
        return map.map((item, index) => {
            return item.map((point, pindex) => {
                const diamond = diamondCoordinate[0] === index && pindex === diamondCoordinate[1];
                return <span className={this.isPartOfSnake([index, pindex]) ? "snake-item" : diamond ? "diamond" : ""}
                             key={pindex}
                             style={{
                                 width: itemSize,
                                 height: itemSize,
                                 display: "inline-block",
                             }}/>
            })
        })
    }

    renderTime() {
        const {time} = this.state;
        const _mintes = parseInt(time / 60);
        const _seconds = parseInt(time % 60);

        const minutes = _mintes < 10 ? "0" + _mintes : _mintes;
        const seconds = _seconds < 10 ? "0" + _seconds : _seconds;

        return minutes + ":" + seconds;
    }

    render() {
        const {score, gameOver, countDown, highScore} = this.state;
        return (
            <div className="container">
                <CountDown countDown={countDown}/>
                <GameOverDialog gameOver={gameOver}
                                score={score}
                                highScore={highScore}
                                time={this.renderTime()}
                                tryAgain={this.initGame}
                />
                <div className="header">
                    <div
                        style={{
                            display: "flex",
                            justifyContent: "space-around",
                            alignItems: "center",
                            color: "white",
                            height: "100%",
                            fontWeight: "bold",
                            fontSize: 24
                        }}>
                        <p>High Score: {highScore}</p>
                        <p>Score: {score}</p>
                        <p>Time: {this.renderTime()}</p>
                    </div>
                </div>
                <div className="map">
                    {this.renderMap()}
                </div>
            </div>
        );
    }
}

const CountDown = props => {
    const {countDown} = props;
    const className = !countDown ? "count-down-container-out" : "count-down-container";
    return (
        <div className={className + " center count-down"}>
            {countDown}
        </div>
    )
};

const GameOverDialog = props => {
    const {gameOver, highScore, score, time, tryAgain} = props;
    return (
        <div className={gameOver ? "game-over-dialog-on" : "game-over-dialog-off"}>
            <h1>Game Over</h1>
            <div>
                <p>High Score: {highScore}</p>
                <p>Score: {score}</p>
                <p>Time: {time}</p>
            </div>
            <button className="button" onClick={tryAgain}>Try Again</button>
        </div>
    )
};

export default App;

import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={() => props.onClick() } style={{color : props.color}}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} color={this.props.colors[i]}/>;
    }

    createBoard = () => {
        let boardSquares = [];
        for (let row = 0; row < 3; row++) {
          let rowSquares = []
          for (let column = 0; column < 3; column++) {
            let squareIndex = (3 * row) + column
            rowSquares.push(<span key={squareIndex}>{this.renderSquare(squareIndex)}</span>)
          }
          boardSquares.push(<div className="board-row" key={row}>{rowSquares}</div>)
        }
        return boardSquares;
    }

    render() {

        return (
            <div>
                {this.createBoard()}
            </div>
            
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
                move : null
            }],
            stepNumber: 0,
            xIsNext: true,
            isDescending : false,
        }
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const move = {column: (i % 3) + 1, row: Math.floor(i / 3) + 1};
        const squares = current.squares.slice();
        if (calculateWinner(squares) || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? 'X' : 'O';
        this.setState({
            history: history.concat([{ squares: squares, move: move }]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    sortMoves = () => {
        this.setState({
            isDescending: !this.state.isDescending
        })
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
        });
    }

    redWinningSquares = (winner) => {
        let colors = Array(9).fill(null)
        winner['winningSquares'].forEach(index => {
            colors[index] = 'red'
        })
        return colors
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);
        const maximumNumberOfMoves = 9;
            
        const moves = history.map((_step, move) => {
            const desc = move ?
                'Go to move #' + move + " in column " + _step['move']['column'] + " and row " +  _step['move']['row'] :
                'Go to game start';
            const fontWeight = move === this.state.stepNumber ? 'bold' : 'normal' 
            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)} style={{fontWeight : fontWeight}}>{desc}</button>
                </li>
            );
        });

        let status;
        let colors = Array(9).fill(null)
        if (winner) {
            status = 'Winner : ' + winner['player'];
            colors = this.redWinningSquares(winner)
        } else {
            status = (this.state.stepNumber === maximumNumberOfMoves) ? 'Draw' : 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        }

        let buttonText = "Moves sorted by ascending order"

        if(this.state.isDescending){
            moves.reverse()
            buttonText = "Moves sorted by descending order"
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)} colors={colors} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                    <button onClick={() => this.sortMoves()}>{buttonText}</button>
                </div>
            </div>
           
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return {'player' : squares[a], 'winningSquares' : [a, b, c]};
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);

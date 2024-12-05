import React from 'react';
import './GameBoard.css';

const GameBoard = ({ snake, foodPos }) => {
  const renderBoxes = () => {
    const boxes = [];
    for (let i = 0; i < 21; i++) {
      for (let j = 0; j < 21; j++) {
        const isSnake = snake.some(([x, y]) => x === j && y === i);
        const isFood = foodPos[0] === j && foodPos[1] === i;
        boxes.push(
          <div
            key={`${i}-${j}`}
            className={`box ${isSnake ? 'snake' : ''} ${isFood ? 'food' : ''}`}
          />
        );
      }
    }
    return boxes;
  };

  return <div className="snakeTable">{renderBoxes()}</div>;
};

export default GameBoard;

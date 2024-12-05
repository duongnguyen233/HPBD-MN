import React, { useState, useEffect, useCallback } from 'react';
import './SnakeGame.css'; // Ensure the CSS file exists

const SnakeGame = () => {
  const [snake, setSnake] = useState([
    { x: 10, y: 10 }, // Head of the snake
    { x: 9, y: 10 },  // Body of the snake
  ]);
  const [food, setFood] = useState({ x: 5, y: 5 });
  const [direction, setDirection] = useState('RIGHT');
  const [score, setScore] = useState(0);
  const [startTouch, setStartTouch] = useState(null); // For swipe detection
  const [gameOver, setGameOver] = useState(false); // To track game over state
  const [showFlower, setShowFlower] = useState(false); // To trigger the flower effect

  // Function to reset the game state
  const resetGame = () => {
    setSnake([
      { x: 10, y: 10 }, // Reset snake to initial position
      { x: 9, y: 10 },
    ]);
    setFood({ x: 5, y: 5 });
    setDirection('RIGHT');
    setScore(0);
    setGameOver(false);
    setShowFlower(false); // Reset flower effect
  };

  const generateFood = useCallback(() => {
    const margin = 1;
    let newFoodX, newFoodY;

    // Loop to find a valid position for the food that doesn't overlap with the snake
    let foodPositionFound = false;

    while (!foodPositionFound) {
      // Generate new random food position
      newFoodX = Math.floor(Math.random() * (20 - 2 * margin)) + margin;
      newFoodY = Math.floor(Math.random() * (20 - 2 * margin)) + margin;

      // Check if the new food position overlaps with any part of the snake
      let isValid = true;

      for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === newFoodX && snake[i].y === newFoodY) {
          isValid = false;
          break; // Stop checking as we found a collision
        }
      }

      if (isValid) {
        foodPositionFound = true;
      }
    }

    // Once a valid position is found, set the new food position
    setFood({ x: newFoodX, y: newFoodY });
  }, [snake]);

  // Handle keyboard input for controlling snake
  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowUp' && direction !== 'DOWN') {
      setDirection('UP');
    } else if (e.key === 'ArrowDown' && direction !== 'UP') {
      setDirection('DOWN');
    } else if (e.key === 'ArrowLeft' && direction !== 'RIGHT') {
      setDirection('LEFT');
    } else if (e.key === 'ArrowRight' && direction !== 'LEFT') {
      setDirection('RIGHT');
    }
  }, [direction]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [handleKeyDown]);

  // Handle touch events for mobile swipe
  useEffect(() => {
    const handleTouchStart = (e) => {
      const touchStart = e.touches[0];
      setStartTouch({ x: touchStart.clientX, y: touchStart.clientY });
    };

    const handleTouchMove = (e) => {
      if (!startTouch) return;

      // Prevent the default scroll behavior
      e.preventDefault();

      const touchMove = e.touches[0];
      const diffX = touchMove.clientX - startTouch.x;
      const diffY = touchMove.clientY - startTouch.y;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (diffX > 0 && direction !== 'LEFT') setDirection('RIGHT');
        if (diffX < 0 && direction !== 'RIGHT') setDirection('LEFT');
      } else {
        if (diffY > 0 && direction !== 'UP') setDirection('DOWN');
        if (diffY < 0 && direction !== 'DOWN') setDirection('UP');
      }

      setStartTouch(null); // Reset after detecting swipe
    };

    const handleTouchEnd = () => {
      setStartTouch(null);
    };

    window.addEventListener('touchstart', handleTouchStart);
    window.addEventListener('touchmove', handleTouchMove);
    window.addEventListener('touchend', handleTouchEnd);

    return () => {
      window.removeEventListener('touchstart', handleTouchStart);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleTouchEnd);
    };
  }, [direction, startTouch]);

  // Move snake and handle game over logic
  const moveSnake = useCallback(() => {
    const newSnake = [...snake];
    const head = { ...newSnake[0] };

    if (direction === 'UP') head.y -= 1;
    if (direction === 'DOWN') head.y += 1;
    if (direction === 'LEFT') head.x -= 1;
    if (direction === 'RIGHT') head.x += 1;

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setScore(score + 1);
      generateFood(); // Now it's defined before use
    } else {
      newSnake.pop();
    }

    if (head.x < 0 || head.y < 0 || head.x >= 20 || head.y >= 20 || checkSelfCollision(newSnake)) {
      setGameOver(true);
    } else {
      setSnake(newSnake);
    }
  }, [snake, direction, food, score, generateFood]); // Add generateFood here

  useEffect(() => {
    if (gameOver) return; // If game is over, stop the game loop.

    const gameLoop = setInterval(() => {
      moveSnake();
    }, 100);

    return () => {
      clearInterval(gameLoop);
    };
  }, [snake, direction, gameOver, moveSnake]);

  // Check if the snake collides with itself
  const checkSelfCollision = (newSnake) => {
    const head = newSnake[0];
    for (let i = 1; i < newSnake.length; i++) {
      if (newSnake[i].x === head.x && newSnake[i].y === head.y) return true;
    }
    return false;
  };

  // Trigger flower effect if score reaches 10
  useEffect(() => {
    if (score >= 10) {
      setShowFlower(true);
      setTimeout(() => {
        alert('Game Over! You scored 10 points.');
        setGameOver(true);
      }, 2000); // Wait for 2 seconds before ending the game
    }
  }, [score]);

  return (
    <div className="game-board">
      <div className="score">Score: {score}</div>
      {snake.map((segment, index) => (
        <div
          key={index}
          className="snake"
          style={{ left: `${segment.x * 20}px`, top: `${segment.y * 20}px` }}
        ></div>
      ))}
      <div
        className="food"
        style={{ left: `${food.x * 20}px`, top: `${food.y * 20}px` }}
      ></div>

      {score > 4 && score <= 9 && !gameOver && (
        <div className="happy-birthday">
          Giỏi quá!
        </div>
      )}

      {score > 9 && score <= 19 && !gameOver && (
        <div className="firework-effect">
        </div>
      )}

      {score > 19 && score <= 29 && !gameOver && (
        <div className="happy-birthday">
          Happy Birthday Minh Ngok 🐶!
        </div>
      )}

      {showFlower && !gameOver && (
        <div className="flower-effect">
          🌸
        </div>
      )}

      {gameOver && (
        <div className="game-over">
          <div>Game Over!</div>
          <button onClick={resetGame}>Restart Game</button>
        </div>
      )}
    </div>
  );
};

export default SnakeGame;

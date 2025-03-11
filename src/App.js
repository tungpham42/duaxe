import React, { useState, useEffect } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
import { Container, Row, Col, Button } from "react-bootstrap";
import "./App.css";

const App = () => {
  const [carPosition, setCarPosition] = useState(50); // Car's horizontal position
  const [obstacles, setObstacles] = useState([]);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [gameStarted, setGameStarted] = useState(false);

  // Game constants
  const GAME_WIDTH = 300;
  const CAR_WIDTH = 40;
  const OBSTACLE_WIDTH = 40;
  const SPEED = 2;

  // Handle keyboard controls
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (!gameStarted || gameOver) return;

      if (e.key === "ArrowLeft" && carPosition > 0) {
        setCarPosition((prev) => Math.max(0, prev - 10));
      }
      if (e.key === "ArrowRight" && carPosition < GAME_WIDTH - CAR_WIDTH) {
        setCarPosition((prev) => Math.min(GAME_WIDTH - CAR_WIDTH, prev + 10));
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [carPosition, gameStarted, gameOver]);

  // Game loop
  useEffect(() => {
    if (!gameStarted || gameOver) return;

    const gameLoop = setInterval(() => {
      // Generate new obstacles
      if (Math.random() < 0.02) {
        const newObstacle = {
          id: Date.now(),
          position: Math.random() * (GAME_WIDTH - OBSTACLE_WIDTH),
          top: -20,
        };
        setObstacles((prev) => [...prev, newObstacle]);
      }

      // Update obstacle positions and check collisions
      setObstacles((prev) => {
        const updatedObstacles = prev
          .map((obs) => ({
            ...obs,
            top: obs.top + SPEED,
          }))
          .filter((obs) => obs.top < 400);

        // Check collision
        updatedObstacles.forEach((obs) => {
          if (
            obs.top + 20 >= 350 &&
            obs.top <= 400 &&
            obs.position < carPosition + CAR_WIDTH &&
            obs.position + OBSTACLE_WIDTH > carPosition
          ) {
            setGameOver(true);
          }
        });

        return updatedObstacles;
      });

      // Update score
      setScore((prev) => prev + 1);
    }, 16); // ~60fps

    return () => clearInterval(gameLoop);
  }, [gameStarted, gameOver, carPosition]);

  const startGame = () => {
    setGameStarted(true);
    setGameOver(false);
    setScore(0);
    setObstacles([]);
    setCarPosition(50);
  };

  return (
    <Container className="mt-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <h1 className="text-center">Car Racing Game</h1>
          <div className="score text-center mb-3">Score: {score}</div>

          <div className="game-container">
            {/* Car */}
            <div className="car" style={{ left: `${carPosition}px` }} />

            {/* Obstacles */}
            {obstacles.map((obstacle) => (
              <div
                key={obstacle.id}
                className="obstacle"
                style={{
                  left: `${obstacle.position}px`,
                  top: `${obstacle.top}px`,
                }}
              />
            ))}

            {/* Game Over Message */}
            {gameOver && <div className="game-over">Game Over!</div>}
          </div>

          <div className="text-center mt-3">
            {!gameStarted && (
              <Button onClick={startGame} variant="primary">
                Start Game
              </Button>
            )}
            {gameOver && (
              <Button onClick={startGame} variant="primary">
                Restart Game
              </Button>
            )}
          </div>

          <div className="instructions mt-3 text-center">
            Use ← and → arrow keys to move the car
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default App;

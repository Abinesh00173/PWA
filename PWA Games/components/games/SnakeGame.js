import { useState, useEffect, useRef } from 'react';

export default function SnakeGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const gameStateRef = useRef({
    body: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    gameRunning: true,
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    const gameLoop = () => {
      if (!gameStateRef.current.gameRunning) return;

      const state = gameStateRef.current;
      const head = { ...state.body[0] };
      head.x += state.direction.x;
      head.y += state.direction.y;

      if (head.x < 0 || head.x >= 20 || head.y < 0 || head.y >= 20 ||
          state.body.some(s => s.x === head.x && s.y === head.y)) {
        state.gameRunning = false;
        const highScore = parseInt(localStorage.getItem('snake_score')) || 0;
        if (score > highScore) localStorage.setItem('snake_score', score);
        return;
      }

      state.body.unshift(head);

      if (head.x === state.food.x && head.y === state.food.y) {
        setScore(s => s + 10);
        state.food = {
          x: Math.floor(Math.random() * 20),
          y: Math.floor(Math.random() * 20),
        };
      } else {
        state.body.pop();
      }

      ctx.fillStyle = '#2c3e50';
      ctx.fillRect(0, 0, 400, 400);
      
      ctx.fillStyle = '#27ae60';
      state.body.forEach(segment => {
        ctx.fillRect(segment.x * gridSize, segment.y * gridSize, gridSize - 2, gridSize - 2);
      });

      ctx.fillStyle = '#e74c3c';
      ctx.fillRect(state.food.x * gridSize, state.food.y * gridSize, gridSize - 2, gridSize - 2);
    };

    const interval = setInterval(gameLoop, 100);

    const handleKeyDown = (e) => {
      const state = gameStateRef.current;
      if (e.key === 'ArrowUp' && state.direction.y === 0) state.direction = { x: 0, y: -1 };
      if (e.key === 'ArrowDown' && state.direction.y === 0) state.direction = { x: 0, y: 1 };
      if (e.key === 'ArrowLeft' && state.direction.x === 0) state.direction = { x: -1, y: 0 };
      if (e.key === 'ArrowRight' && state.direction.x === 0) state.direction = { x: 1, y: 0 };
    };

    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      clearInterval(interval);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [score]);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Snake Game</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
      <div className="game-controls">
        <button className="control-btn" onClick={() => gameStateRef.current.direction = { x: 0, y: -1 }}>⬆️</button>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="control-btn" onClick={() => gameStateRef.current.direction = { x: -1, y: 0 }}>⬅️</button>
          <button className="control-btn" onClick={() => gameStateRef.current.direction = { x: 0, y: 1 }}>⬇️</button>
          <button className="control-btn" onClick={() => gameStateRef.current.direction = { x: 1, y: 0 }}>➡️</button>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect, useRef } from 'react';

export default function PongGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState('0:0');
  const gameStateRef = useRef({
    p1Y: 150, p2Y: 150, ballX: 200, ballY: 150, ballDX: 4, ballDY: 4,
    score1: 0, score2: 0, gameRunning: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const gameLoop = () => {
      if (!state.gameRunning) return;

      state.ballX += state.ballDX;
      state.ballY += state.ballDY;

      if (state.ballY < 0 || state.ballY > 300) state.ballDY *= -1;

      if (state.ballX < 15 && state.ballY > state.p1Y && state.ballY < state.p1Y + 60) {
        state.ballDX *= -1;
      }
      if (state.ballX > 385 && state.ballY > state.p2Y && state.ballY < state.p2Y + 60) {
        state.ballDX *= -1;
      }

      if (state.ballX < 0) {
        state.score2++;
        setScore(`${state.score1}:${state.score2}`);
        state.ballX = 200;
        state.ballY = 150;
      }
      if (state.ballX > 400) {
        state.score1++;
        setScore(`${state.score1}:${state.score2}`);
        state.ballX = 200;
        state.ballY = 150;
      }

      if (Math.random() < 0.1) {
        if (state.p2Y < state.ballY) state.p2Y += 3;
        else state.p2Y -= 3;
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 300);

      ctx.fillStyle = '#fff';
      ctx.fillRect(10, state.p1Y, 10, 60);
      ctx.fillRect(380, state.p2Y, 10, 60);

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(gameLoop);
    };

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.p1Y = Math.max(0, Math.min(e.clientY - rect.top - 30, 240));
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    const interval = setInterval(gameLoop, 1000 / 60);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      clearInterval(interval);
    };
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Pong</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

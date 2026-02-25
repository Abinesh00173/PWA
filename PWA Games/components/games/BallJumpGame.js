import { useState, useEffect, useRef } from 'react';

export default function BallJumpGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    ballX: 50, ballY: 250, ballVX: 3, ballVY: 0, gravity: 0.2,
    platforms: [], gameActive: true, platformOffset: 0, score: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 300;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    state.platforms = [];
    for (let i = 0; i < 8; i++) {
      state.platforms.push({
        x: Math.random() * 200,
        y: i * 70 + 50,
        width: 60,
        height: 10
      });
    }

    let mouseX = 200;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    };

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaFactor = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = timestamp;

      state.ballVY += state.gravity * deltaFactor;
      state.ballX = mouseX - 5;
      state.ballY += state.ballVY * deltaFactor;

      state.platforms.forEach(p => {
        p.y += 1 * deltaFactor;
      });

      const checkCollision = (x, y, r, px, py, pw, ph) => {
        return x + r > px && x - r < px + pw && y + r > py && y - r < py + ph;
      };

      state.platforms.forEach(p => {
        if (checkCollision(state.ballX, state.ballY, 5, p.x, p.y, p.width, p.height)) {
          state.ballVY = -10;
          const newScore = state.score + 10;
          state.score = newScore;
          setScore(newScore);
          localStorage.setItem('balljump_score', newScore);
        }
      });

      state.platforms = state.platforms.filter(p => p.y < 500);
      
      if (state.platforms.length < 8) {
        state.platforms.push({
          x: Math.random() * 200,
          y: -10,
          width: 60,
          height: 10
        });
      }

      if (state.ballY > 500) {
        state.gameActive = false;
      }

      ctx.fillStyle = '#1a1a1a';
      ctx.fillRect(0, 0, 300, 500);

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#3498db';
      state.platforms.forEach(p => {
        ctx.fillRect(p.x, p.y, p.width, p.height);
      });

      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText('Score: ' + state.score, 10, 20);

      if (state.gameActive) {
        requestAnimationFrame(gameLoop);
      } else {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 300, 500);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 24px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', 150, 250);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(gameLoop);

    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Ball Jump</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

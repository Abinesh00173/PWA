import { useState, useEffect, useRef } from 'react';

export default function DinoGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    dinoY: 200, gameActive: true, obstacles: [], gravity: 0.6,
    velocity: 0, jumping: false, score: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 300;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const addObstacle = () => {
      state.obstacles.push({ x: 400, y: 240, width: 20, height: 40 });
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space' && !state.jumping && state.gameActive) {
        state.jumping = true;
        state.velocity = -12;
        e.preventDefault();
      }
    };

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaFactor = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = timestamp;

      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, 400, 300);

      ctx.fillStyle = '#90EE90';
      ctx.fillRect(0, 260, 400, 40);

      state.velocity += state.gravity * deltaFactor;
      state.dinoY += state.velocity * deltaFactor;

      if (state.dinoY >= 200) {
        state.dinoY = 200;
        state.velocity = 0;
        state.jumping = false;
      }

      ctx.fillStyle = '#FFD700';
      ctx.fillRect(20, state.dinoY, 30, 40);
      ctx.fillStyle = '#000';
      ctx.arc(35, state.dinoY + 10, 3, 0, Math.PI * 2);
      ctx.beginPath();
      ctx.arc(35, state.dinoY + 10, 3, 0, Math.PI * 2);
      ctx.fill();

      state.obstacles.forEach((obs, idx) => {
        obs.x -= 5 * deltaFactor;
        ctx.fillStyle = '#8B4513';
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);

        if (obs.x < 320 && obs.x + obs.width > 20 && state.dinoY + 40 > obs.y) {
          state.gameActive = false;
        }

        if (obs.x < -20) {
          state.obstacles.splice(idx, 1);
          const newScore = state.score + 10;
          state.score = newScore;
          setScore(newScore);
          localStorage.setItem('dino_score', newScore);
        }
      });

      if (Math.random() < 0.02 * deltaFactor && state.gameActive) {
        addObstacle();
      }

      if (!state.gameActive) {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        ctx.fillRect(0, 0, 400, 300);
        ctx.fillStyle = '#fff';
        ctx.font = 'bold 30px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Game Over!', 200, 150);
        return;
      }

      requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    gameLoop();

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Dino Runner</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
        <div style={{ marginTop: '10px', textAlign: 'center', fontSize: '0.9em' }}>
          Press SPACE to jump
        </div>
      </div>
    </div>
  );
}

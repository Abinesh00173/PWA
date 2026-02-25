import { useState, useEffect, useRef } from 'react';

export default function FlappyGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    y: 150, vy: 0, pipes: [], score: 0, gameRunning: true
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    const jump = () => {
      gameStateRef.current.vy = -8;
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') { jump(); e.preventDefault(); }
    };

    canvas.addEventListener('click', jump);
    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = (timestamp) => {
      const state = gameStateRef.current;
      if (!state.gameRunning) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaFactor = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = timestamp;

      state.vy += 0.4 * deltaFactor;
      state.y += state.vy * deltaFactor;

      if (state.y > 380 || state.y < 0) {
        state.gameRunning = false;
        setGameOver(true);
        if (state.score > parseInt(localStorage.getItem('flappy_score') || 0)) {
          localStorage.setItem('flappy_score', state.score);
        }
        return;
      }

      if (Math.random() < 0.02 * deltaFactor) {
        const gap = 100;
        const pipeY = Math.random() * (200 - gap);
        state.pipes.push({ x: 400, y1: pipeY, y2: pipeY + gap, passed: false });
      }

      state.pipes = state.pipes.filter(p => p.x > -50);

      state.pipes.forEach(p => {
        p.x -= 3 * deltaFactor;
        if (p.x < 60 && p.x > 40 && (state.y < p.y1 + 10 || state.y + 20 > p.y2 - 10)) {
          state.gameRunning = false;
          setGameOver(true);
          if (state.score > parseInt(localStorage.getItem('flappy_score') || 0)) {
            localStorage.setItem('flappy_score', state.score);
          }
        }
        if (!p.passed && p.x + 50 < 60) {
          p.passed = true;
          state.score++;
          setScore(state.score);
        }
      });

      ctx.fillStyle = '#87CEEB';
      ctx.fillRect(0, 0, 400, 400);

      state.pipes.forEach(p => {
        ctx.fillStyle = '#27ae60';
        ctx.fillRect(p.x, 0, 50, p.y1);
        ctx.fillRect(p.x, p.y2, 50, 400 - p.y2);
      });

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(60, state.y + 10, 10, 0, Math.PI * 2);
      ctx.fill();

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('click', jump);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Flappy Bird</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        {gameOver && <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', backgroundColor: '#000', color: '#fff', padding: '20px', borderRadius: '10px', zIndex: 10 }}>Game Over! Score: {score}</div>}
        <canvas ref={canvasRef} style={{ display: 'block', cursor: 'pointer' }}></canvas>
      </div>
      <div className="game-controls">
        <button className="control-btn" onClick={() => { gameStateRef.current.vy = -8; }}>Jump</button>
        <button className="control-btn" onClick={() => { gameStateRef.current.gameRunning = false; window.location.reload(); }}>Reset</button>
      </div>
    </div>
  );
}

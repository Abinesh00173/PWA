import { useState, useEffect, useRef } from 'react';

export default function PacManGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const lastTimeRef = useRef(0);
  const moveAccumulatorRef = useRef(0);
  const gameStateRef = useRef({
    pacX: 1, pacY: 1, pacDir: 'RIGHT', pellets: [], ghosts: [],
    gameActive: true, mouth: 0, score: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const state = gameStateRef.current;
    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.15) {
          state.pellets.push({ x: j, y: i });
        }
      }
    }

    state.ghosts = [
      { x: 8, y: 8, dx: 1, dy: 0, color: '#FF0000' },
      { x: 9, y: 8, dx: 0, dy: 1, color: '#FFB8FF' },
      { x: 8, y: 9, dx: -1, dy: 0, color: '#00FFFF' },
    ];

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') state.pacDir = 'UP';
      if (e.key === 'ArrowDown') state.pacDir = 'DOWN';
      if (e.key === 'ArrowLeft') state.pacDir = 'LEFT';
      if (e.key === 'ArrowRight') state.pacDir = 'RIGHT';
    };

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaMs = Math.min(timestamp - lastTimeRef.current, 40);
      const deltaFactor = deltaMs / 16.67;
      lastTimeRef.current = timestamp;

      moveAccumulatorRef.current += deltaMs;
      const moveInterval = 140;

      while (moveAccumulatorRef.current >= moveInterval) {
        if (state.pacDir === 'UP' && state.pacY > 0) state.pacY--;
        if (state.pacDir === 'DOWN' && state.pacY < 19) state.pacY++;
        if (state.pacDir === 'LEFT' && state.pacX > 0) state.pacX--;
        if (state.pacDir === 'RIGHT' && state.pacX < 19) state.pacX++;
        moveAccumulatorRef.current -= moveInterval;
      }

      const pelletIndex = state.pellets.findIndex((p) => p.x === state.pacX && p.y === state.pacY);
      if (pelletIndex >= 0) {
        state.pellets.splice(pelletIndex, 1);
        const newScore = state.score + 10;
        state.score = newScore;
        setScore(newScore);
        localStorage.setItem('pacman_score', newScore);
      }

      state.ghosts.forEach(g => {
        g.x += g.dx * deltaFactor;
        g.y += g.dy * deltaFactor;
        if (g.x < 0 || g.x > 19) g.dx *= -1;
        if (g.y < 0 || g.y > 19) g.dy *= -1;
      });

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 400);

      ctx.fillStyle = '#FFD700';
      state.mouth = (state.mouth + deltaFactor) % 20;
      const mouthAngle = (Math.sin(state.mouth / 10) * 0.3 + 0.1);
      ctx.beginPath();
      ctx.arc(state.pacX * gridSize + 10, state.pacY * gridSize + 10, 8, mouthAngle, Math.PI * 2 - mouthAngle);
      ctx.lineTo(state.pacX * gridSize + 10, state.pacY * gridSize + 10);
      ctx.fill();

      state.pellets.forEach(p => {
        ctx.fillStyle = '#FFF';
        ctx.fillRect(p.x * gridSize + 8, p.y * gridSize + 8, 4, 4);
      });

      state.ghosts.forEach(g => {
        ctx.fillStyle = g.color;
        ctx.fillRect(g.x * gridSize, g.y * gridSize, gridSize, gridSize);
      });

      if (state.gameActive) {
        requestAnimationFrame(gameLoop);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(gameLoop);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Pac-Man</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

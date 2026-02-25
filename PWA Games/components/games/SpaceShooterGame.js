import { useState, useEffect, useRef } from 'react';

export default function SpaceShooterGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    playerX: 150, playerY: 450, playerBullets: [], enemies: [],
    gameActive: true, score: 0
  });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    let mouseX = 200;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = e.clientX - rect.left;
    };

    const handleClick = () => {
      state.playerBullets.push({
        x: state.playerX,
        y: state.playerY,
        vy: -5
      });
    };

    const addEnemy = () => {
      state.enemies.push({
        x: Math.random() * 350,
        y: -20,
        vy: 2
      });
    };

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaFactor = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = timestamp;

      state.playerX = Math.max(0, Math.min(mouseX, 380));

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 500);

      state.playerBullets = state.playerBullets.filter(b => b.y > 0);
      state.playerBullets.forEach(b => {
        b.y += b.vy * deltaFactor;
        ctx.fillStyle = '#00FF00';
        ctx.fillRect(b.x, b.y, 3, 10);
      });

      state.enemies.forEach((e, eidx) => {
        e.y += e.vy * deltaFactor;
        ctx.fillStyle = '#FF0000';
        ctx.fillRect(e.x, e.y, 30, 20);

        state.playerBullets.forEach((b, bidx) => {
          if (b.x > e.x && b.x < e.x + 30 && b.y > e.y && b.y < e.y + 20) {
            state.playerBullets.splice(bidx, 1);
            state.enemies.splice(eidx, 1);
            const newScore = state.score + 10;
            state.score = newScore;
            setScore(newScore);
            localStorage.setItem('spaceshooter_score', newScore);
          }
        });
      });

      state.enemies = state.enemies.filter(e => e.y < 500);

      if (Math.random() < 0.05 * deltaFactor) {
        addEnemy();
      }

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.moveTo(state.playerX + 15, state.playerY);
      ctx.lineTo(state.playerX, state.playerY + 20);
      ctx.lineTo(state.playerX + 30, state.playerY + 20);
      ctx.closePath();
      ctx.fill();

      ctx.fillStyle = '#fff';
      ctx.font = '16px Arial';
      ctx.fillText('Score: ' + state.score, 10, 20);

      if (state.gameActive) {
        requestAnimationFrame(gameLoop);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    canvas.addEventListener('click', handleClick);
    requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('mousemove', handleMouseMove);
      canvas.removeEventListener('click', handleClick);
    };
  }, []);

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Space Shooter</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
    </div>
  );
}

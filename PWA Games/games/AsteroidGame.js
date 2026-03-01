import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function AsteroidGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    shipX: 150, shipY: 250, shipAngle: 0, velocity: { x: 0, y: 0 },
    bullets: [], asteroids: [], gameActive: true, keys: {}, score: 0
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('asteroid_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    const asteroids = [];
    Array(5).fill().forEach(() => {
      asteroids.push({
        x: Math.random() * 400,
        y: Math.random() * 200,
        vx: (Math.random() - 0.5) * 3,
        vy: (Math.random() - 0.5) * 3,
        size: 20
      });
    });
    gameStateRef.current = {
      shipX: 150, shipY: 250, shipAngle: 0, velocity: { x: 0, y: 0 },
      bullets: [], asteroids, gameActive: true, keys: {}, score: 0
    };
    lastTimeRef.current = 0;
    setScore(0);
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 500;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const handleKeyDown = (e) => {
      state.keys[e.key.toLowerCase()] = true;
      if (e.key === ' ') {
        state.bullets.push({
          x: state.shipX,
          y: state.shipY,
          vx: Math.cos(state.shipAngle) * 5,
          vy: Math.sin(state.shipAngle) * 5
        });
        e.preventDefault();
      }
    };

    const handleKeyUp = (e) => {
      state.keys[e.key.toLowerCase()] = false;
    };

    const gameLoop = (timestamp) => {
      if (!state.gameActive) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaFactor = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = timestamp;

      if (state.keys['arrowleft']) state.shipAngle -= 0.1 * deltaFactor;
      if (state.keys['arrowright']) state.shipAngle += 0.1 * deltaFactor;
      if (state.keys['arrowup']) {
        state.velocity.x += Math.cos(state.shipAngle) * 0.3 * deltaFactor;
        state.velocity.y += Math.sin(state.shipAngle) * 0.3 * deltaFactor;
      }

      state.shipX += state.velocity.x * deltaFactor;
      state.shipY += state.velocity.y * deltaFactor;
      state.velocity.x *= Math.pow(0.99, deltaFactor);
      state.velocity.y *= Math.pow(0.99, deltaFactor);

      if (state.shipX < 0) state.shipX = 400;
      if (state.shipX > 400) state.shipX = 0;
      if (state.shipY < 0) state.shipY = 500;
      if (state.shipY > 500) state.shipY = 0;

      state.bullets = state.bullets.filter(b => b.x > -50 && b.x < 450 && b.y > -50 && b.y < 550);
      state.bullets.forEach(b => {
        b.x += b.vx * deltaFactor;
        b.y += b.vy * deltaFactor;
      });

      state.asteroids.forEach(ast => {
        ast.x += ast.vx * deltaFactor;
        ast.y += ast.vy * deltaFactor;
        if (ast.x < 0) ast.x = 400;
        if (ast.x > 400) ast.x = 0;
        if (ast.y < 0) ast.y = 500;
        if (ast.y > 500) ast.y = 0;

        // Check collision with ship
        const dx = state.shipX - ast.x;
        const dy = state.shipY - ast.y;
        if (Math.hypot(dx, dy) < ast.size + 10) {
          state.gameActive = false;
          const finalScore = state.score;
          if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem('asteroid_highscore', finalScore);
          }
          setGameStatus('gameover');
        }
      });

      for (let i = state.bullets.length - 1; i >= 0; i--) {
        for (let j = state.asteroids.length - 1; j >= 0; j--) {
          if (!state.bullets[i]) break;
          const dx = state.bullets[i].x - state.asteroids[j].x;
          const dy = state.bullets[i].y - state.asteroids[j].y;
          if (Math.hypot(dx, dy) < state.asteroids[j].size) {
            state.bullets.splice(i, 1);
            const newScore = state.score + state.asteroids[j].size;
            state.score = newScore;
            setScore(newScore);
            state.asteroids.splice(j, 1);
            // Spawn new asteroid
            if (Math.random() < 0.5) {
              state.asteroids.push({
                x: Math.random() < 0.5 ? 0 : 400,
                y: Math.random() * 500,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: 15 + Math.random() * 10
              });
            }
            break;
          }
        }
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 500);

      ctx.save();
      ctx.translate(state.shipX, state.shipY);
      ctx.rotate(state.shipAngle);
      ctx.strokeStyle = '#fff';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(10, 0);
      ctx.lineTo(-10, -8);
      ctx.lineTo(-5, 0);
      ctx.lineTo(-10, 8);
      ctx.closePath();
      ctx.stroke();
      ctx.restore();

      state.asteroids.forEach(ast => {
        ctx.strokeStyle = '#FFD700';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(ast.x, ast.y, ast.size, 0, Math.PI * 2);
        ctx.stroke();
      });

      ctx.fillStyle = '#00FF00';
      state.bullets.forEach(b => {
        ctx.beginPath();
        ctx.arc(b.x, b.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      if (state.gameActive) {
        requestAnimationFrame(gameLoop);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);
    requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Asteroids" score={score} showBest={false} />
      <div className="game-canvas-container">
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={400} height={500}></canvas>
          {gameStatus === 'start' && (
            <StartOverlay
              isDesktop={isDesktop}
              icon="🚀"
              title="ASTEROIDS"
              features={[
                { icon: '🔄', text: 'Rotate' },
                { icon: '🔥', text: 'Thrust' },
                { icon: '💥', text: 'Shoot' }
              ]}
              onStart={startGame}
              highScore={highScore}
            />
          )}
          {gameStatus === 'gameover' && (
            <GameOverOverlay
              isDesktop={isDesktop}
              score={score}
              highScore={highScore}
              isNewHighScore={score >= highScore && score > 0}
              onRestart={startGame}
            />
          )}
        </div>
      </div>
    </div>
  );
}

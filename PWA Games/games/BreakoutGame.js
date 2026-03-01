import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function BreakoutGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    paddleX: 150, ballX: 200, ballY: 300, ballDX: 3, ballDY: -3, score: 0, gameRunning: true, bricks: []
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('breakout_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const startGame = () => {
    const bricks = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 5; col++) {
        bricks.push({ x: col * 80, y: row * 40 + 20, width: 75, height: 35 });
      }
    }
    gameStateRef.current = {
      paddleX: 150, ballX: 200, ballY: 300, ballDX: 3, ballDY: -3, score: 0, gameRunning: true, bricks
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
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;

    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      state.paddleX = Math.min(Math.max(e.clientX - rect.left - 50, 0), 300);
    };

    canvas.addEventListener('mousemove', handleMouseMove);

    const gameLoop = (timestamp) => {
      if (!state.gameRunning) return;

      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaFactor = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = timestamp;

      state.ballX += state.ballDX * deltaFactor;
      state.ballY += state.ballDY * deltaFactor;

      if (state.ballX < 0 || state.ballX > 400) state.ballDX *= -1;
      if (state.ballY < 0) state.ballDY *= -1;

      if (state.ballY > 400) {
        state.gameRunning = false;
        const finalScore = state.score;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('breakout_highscore', finalScore);
        }
        setGameStatus('gameover');
        return;
      }

      if (state.ballY > 350 && state.ballX > state.paddleX && state.ballX < state.paddleX + 100) {
        state.ballDY *= -1;
      }

      state.bricks = state.bricks.filter(b => {
        if (state.ballX > b.x && state.ballX < b.x + b.width &&
            state.ballY > b.y && state.ballY < b.y + b.height) {
          state.ballDY *= -1;
          state.score += 10;
          setScore(state.score);
          return false;
        }
        return true;
      });

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 400);

      ctx.fillStyle = '#27ae60';
      ctx.fillRect(state.paddleX, 360, 100, 20);

      ctx.fillStyle = '#FFD700';
      ctx.beginPath();
      ctx.arc(state.ballX, state.ballY, 5, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = '#e74c3c';
      state.bricks.forEach(b => {
        ctx.fillRect(b.x, b.y, b.width, b.height);
      });

      requestAnimationFrame(gameLoop);
    };

    requestAnimationFrame(gameLoop);
    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Breakout" score={score} showBest={false} />
      <div className="game-canvas-container">
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={400} height={400}></canvas>
          {gameStatus === 'start' && (
            <StartOverlay
              isDesktop={isDesktop}
              icon="🧱"
              title="BREAKOUT"
              features={[
                { icon: '🎯', text: 'Aim' },
                { icon: '🏓', text: 'Bounce' },
                { icon: '💥', text: 'Destroy' }
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

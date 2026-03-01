import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function BallJumpGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    ballX: 50, ballY: 250, ballVX: 3, ballVY: 0, gravity: 0.2,
    platforms: [], gameActive: true, platformOffset: 0, score: 0
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const stored = parseInt(localStorage.getItem('balljump_highscore')) || 0;
    setHighScore(stored);
  }, []);

  const startGame = () => {
    setScore(0);
    lastTimeRef.current = 0;
    const state = gameStateRef.current;
    state.ballX = 50;
    state.ballY = 250;
    state.ballVX = 3;
    state.ballVY = 0;
    state.gameActive = true;
    state.score = 0;
    state.platforms = [];
    for (let i = 0; i < 8; i++) {
      state.platforms.push({
        x: Math.random() * 200,
        y: i * 70 + 50,
        width: 60,
        height: 10
      });
    }
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;
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
        const finalScore = state.score;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('balljump_highscore', finalScore);
        }
        setGameStatus('gameover');
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
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    requestAnimationFrame(gameLoop);

    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Ball Jump" score={score} showBest={false} />
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
      {gameStatus === 'start' && (
        <StartOverlay
          isDesktop={isDesktop}
          icon="🏀"
          title="BALL JUMP"
          subtitle="Bounce Game"
          features={[
            { icon: '🎯', text: 'Aim' },
            { icon: '⬆️', text: 'Bounce' },
            { icon: '🏆', text: 'Score' }
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
  );
}

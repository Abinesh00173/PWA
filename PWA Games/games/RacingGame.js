import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function RacingGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    carX: 150, carY: 400, carWidth: 30, carHeight: 50,
    obstacles: [], gameActive: true, roadOffset: 0, carSpeed: 0, score: 0
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const stored = parseInt(localStorage.getItem('racing_highscore')) || 0;
    setHighScore(stored);
  }, []);

  const startGame = () => {
    setScore(0);
    lastTimeRef.current = 0;
    const state = gameStateRef.current;
    state.carX = 150;
    state.carY = 400;
    state.obstacles = [];
    state.gameActive = true;
    state.roadOffset = 0;
    state.score = 0;
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

    let mouseX = 150;
    const handleMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = Math.max(30, Math.min(e.clientX - rect.left, 270));
    };

    const gameLoop = (timestamp) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = timestamp;
      }
      const deltaFactor = Math.min((timestamp - lastTimeRef.current) / 16.67, 2);
      lastTimeRef.current = timestamp;

      state.carX += (mouseX - state.carX) * 0.1 * deltaFactor;
      state.roadOffset = (state.roadOffset + 5 * deltaFactor) % 20;

      state.obstacles.forEach(obs => {
        obs.y += 5 * deltaFactor;
      });

      state.obstacles = state.obstacles.filter(obs => obs.y < 600);

      for (let obs of state.obstacles) {
        if (obs.y > state.carY - 50 && obs.y < state.carY + state.carHeight &&
            obs.x > state.carX - 20 && obs.x < state.carX + state.carWidth + 20) {
          state.gameActive = false;
          const finalScore = state.score;
          if (finalScore > highScore) {
            setHighScore(finalScore);
            localStorage.setItem('racing_highscore', finalScore);
          }
          setGameStatus('gameover');
        }
      }

      if (state.obstacles.every(obs => obs.y > state.carY + 50)) {
        if (Math.random() < 0.02 * deltaFactor) {
          state.obstacles.push({
            x: 30 + Math.random() * 240,
            y: -30,
            width: 40,
            height: 40
          });
          const newScore = state.score + 1;
          state.score = newScore;
          setScore(newScore);
        }
      }

      ctx.fillStyle = '#2d5016';
      ctx.fillRect(0, 0, 300, 500);

      ctx.strokeStyle = '#FFD700';
      ctx.lineWidth = 3;
      for (let i = 0; i < 500; i += 20) {
        const offset = (i + state.roadOffset) % 20;
        ctx.beginPath();
        ctx.moveTo(150, offset - 20);
        ctx.lineTo(150, offset);
        ctx.stroke();
      }

      ctx.fillStyle = '#444';
      for (let i = 0; i < 8; i++) {
        const offset = (i * 20 + state.roadOffset) % 100;
        ctx.fillRect(80, offset - 20, 40, 10);
        ctx.fillRect(180, offset - 20, 40, 10);
      }

      ctx.fillStyle = '#FF0000';
      state.obstacles.forEach(obs => {
        ctx.fillRect(obs.x, obs.y, obs.width, obs.height);
      });

      ctx.fillStyle = '#3498db';
      ctx.fillRect(state.carX, state.carY, state.carWidth, state.carHeight);
      ctx.fillStyle = '#FFD700';
      ctx.fillRect(state.carX + 5, state.carY + 10, 8, 8);
      ctx.fillRect(state.carX + 17, state.carY + 10, 8, 8);

      if (state.gameActive) {
        requestAnimationFrame(gameLoop);
      }
    };

    canvas.addEventListener('mousemove', handleMouseMove);
    gameLoop();

    return () => canvas.removeEventListener('mousemove', handleMouseMove);
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Racing" score={score} showBest={false} />
      <div className="game-canvas-container">
        <canvas ref={canvasRef}></canvas>
      </div>
      {gameStatus === 'start' && (
        <StartOverlay
          isDesktop={isDesktop}
          icon="🏎️"
          title="RACING"
          subtitle="Speed Game"
          features={[
            { icon: '🏎️', text: 'Drive' },
            { icon: '🚧', text: 'Dodge' },
            { icon: '💨', text: 'Speed' }
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

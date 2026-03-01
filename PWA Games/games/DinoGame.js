import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { JumpButton } from '../components/ActionButtons';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function DinoGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const lastTimeRef = useRef(0);
  const gameStateRef = useRef({
    dinoY: 200, gameActive: true, obstacles: [], gravity: 0.6,
    velocity: 0, jumping: false, score: 0
  });

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const saved = localStorage.getItem('dino_highscore');
    if (saved) setHighScore(parseInt(saved, 10));
  }, []);

  const handleJump = () => {
    const state = gameStateRef.current;
    if (!state.jumping && state.gameActive) {
      state.jumping = true;
      state.velocity = -12;
    }
  };

  const startGame = () => {
    gameStateRef.current = {
      dinoY: 200, gameActive: true, obstacles: [], gravity: 0.6,
      velocity: 0, jumping: false, score: 0
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

        if (obs.x < 50 && obs.x + obs.width > 20 && state.dinoY + 40 > obs.y) {
          state.gameActive = false;
        }

        if (obs.x < -20) {
          state.obstacles.splice(idx, 1);
          const newScore = state.score + 10;
          state.score = newScore;
          setScore(newScore);
        }
      });

      if (Math.random() < 0.02 * deltaFactor && state.gameActive) {
        addObstacle();
      }

      if (!state.gameActive) {
        const finalScore = state.score;
        if (finalScore > highScore) {
          setHighScore(finalScore);
          localStorage.setItem('dino_highscore', finalScore);
        }
        setGameStatus('gameover');
        return;
      }

      requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    requestAnimationFrame(gameLoop);

    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Dino Runner" score={score} showBest={false} />
      <div className="game-canvas-container" style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', alignItems: 'center', gap: '20px' }}>
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} width={400} height={300}></canvas>
          {gameStatus === 'start' && (
            <StartOverlay
              isDesktop={isDesktop}
              icon="🦖"
              title="DINO RUN"
              features={[
                { icon: '⬆️', text: 'Jump' },
                { icon: '🌵', text: 'Avoid' },
                { icon: '🏃', text: 'Run' }
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
        {gameStatus === 'playing' && (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
            <JumpButton isDesktop={isDesktop} onClick={handleJump} />
          </div>
        )}
      </div>
    </div>
  );
}

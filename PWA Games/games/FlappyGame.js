import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { JumpButton, ResetButton } from '../components/ActionButtons';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function FlappyGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('start');
  const [isDesktop, setIsDesktop] = useState(false);
  const [highScore, setHighScore] = useState(0);
  const lastTimeRef = useRef(0);
  const animationRef = useRef(null);
  const gameStateRef = useRef(null);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('flappy_score')) || 0;
    setHighScore(saved);
  }, []);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    gameStateRef.current = {
      y: 150, vy: 0, pipes: [], score: 0, gameRunning: true
    };
    setScore(0);
    lastTimeRef.current = 0;
    setGameStatus('playing');
  };

  const handleJump = () => {
    if (gameStateRef.current && gameStatus === 'playing') {
      gameStateRef.current.vy = -8;
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');

    // Draw sky background when not playing
    ctx.fillStyle = '#87CEEB';
    ctx.fillRect(0, 0, 400, 400);

    if (gameStatus !== 'playing') return;

    const state = gameStateRef.current;
    if (!state) return;

    const jump = () => {
      if (state.gameRunning) state.vy = -8;
    };

    const handleKeyDown = (e) => {
      if (e.code === 'Space') { jump(); e.preventDefault(); }
    };

    canvas.addEventListener('click', jump);
    window.addEventListener('keydown', handleKeyDown);

    const gameLoop = (timestamp) => {
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
        if (state.score > highScore) {
          localStorage.setItem('flappy_score', state.score);
          setHighScore(state.score);
        }
        setGameStatus('gameover');
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
          if (state.score > highScore) {
            localStorage.setItem('flappy_score', state.score);
            setHighScore(state.score);
          }
          setGameStatus('gameover');
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

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      canvas.removeEventListener('click', jump);
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Flappy Bird" score={score} showBest={false} />
      <div className="game-canvas-container" style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef} style={{ display: 'block', cursor: 'pointer' }}></canvas>
          
          {gameStatus === 'start' && (
            <StartOverlay
              isDesktop={isDesktop}
              icon="🐦"
              title="FLAPPY"
              subtitle="Tap to Fly"
              features={[
                { icon: '👆', text: 'Tap' },
                { icon: '🚀', text: 'Fly' },
                { icon: '🚫', text: 'Avoid' },
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

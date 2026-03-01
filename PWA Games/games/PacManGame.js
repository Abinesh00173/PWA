import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { DpadControlsPanel } from '../components/DpadControlsPanel';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function PacManGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const lastTimeRef = useRef(0);
  const moveAccumulatorRef = useRef(0);
  const animationRef = useRef(null);
  const gameStateRef = useRef(null);

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('pacman_score')) || 0;
    setHighScore(saved);
  }, []);

  const initGameState = () => {
    const pellets = [];
    for (let i = 0; i < 20; i++) {
      for (let j = 0; j < 20; j++) {
        if (Math.random() > 0.15) {
          pellets.push({ x: j, y: i });
        }
      }
    }
    return {
      pacX: 1, pacY: 1, pacDir: 'RIGHT', pellets,
      ghosts: [
        { x: 8, y: 8, dx: 1, dy: 0, color: '#FF0000' },
        { x: 9, y: 8, dx: 0, dy: 1, color: '#FFB8FF' },
        { x: 8, y: 9, dx: -1, dy: 0, color: '#00FFFF' },
      ],
      gameActive: true, mouth: 0, score: 0
    };
  };

  const startGame = () => {
    gameStateRef.current = initGameState();
    setScore(0);
    lastTimeRef.current = 0;
    moveAccumulatorRef.current = 0;
    setGameStatus('playing');
  };

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleDirection = (dir) => {
    if (gameStateRef.current) {
      gameStateRef.current.pacDir = dir.toUpperCase();
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 400;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;

    // Draw empty board when not playing
    if (gameStatus !== 'playing') {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 400, 400);
      return;
    }

    const state = gameStateRef.current;
    if (!state) return;

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowUp') state.pacDir = 'UP';
      if (e.key === 'ArrowDown') state.pacDir = 'DOWN';
      if (e.key === 'ArrowLeft') state.pacDir = 'LEFT';
      if (e.key === 'ArrowRight') state.pacDir = 'RIGHT';
    };

    const gameLoop = (timestamp) => {
      if (!state.gameActive) return;

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
        if (newScore > highScore) {
          localStorage.setItem('pacman_score', newScore);
          setHighScore(newScore);
        }
      }

      // Check win condition
      if (state.pellets.length === 0) {
        state.gameActive = false;
        setGameStatus('gameover');
        return;
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

      animationRef.current = requestAnimationFrame(gameLoop);
    };

    window.addEventListener('keydown', handleKeyDown);
    animationRef.current = requestAnimationFrame(gameLoop);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, [gameStatus, highScore]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Pac-Man" score={score} showBest={false} />
      <div className="game-canvas-container" style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef}></canvas>
          
          {gameStatus === 'start' && (
            <StartOverlay
              isDesktop={isDesktop}
              icon="👻"
              title="PAC-MAN"
              subtitle="Classic Arcade"
              features={[
                { icon: '🟡', text: 'Eat' },
                { icon: '👻', text: 'Avoid' },
                { icon: '🏆', text: 'Win' },
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
          <DpadControlsPanel
            isDesktop={isDesktop}
            onDirection={handleDirection}
            showPauseButton={false}
            hintText={isDesktop ? 'Arrow keys or D-pad' : 'Tap to move'}
          />
        )}
      </div>
    </div>
  );
}

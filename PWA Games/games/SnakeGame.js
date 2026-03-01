import { useState, useEffect, useRef, useCallback } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { GameOverlay } from '../components/GameOverlay';
import { DpadControlsPanel } from '../components/DpadControlsPanel';

export default function SnakeGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [score, setScore] = useState(0);
  const [highScore, setHighScore] = useState(0);
  const [gameStatus, setGameStatus] = useState('start'); // start, playing, paused, gameover
  const [canvasSize, setCanvasSize] = useState(400);
  const [speed, setSpeed] = useState(220); // Much slower start speed
  const [isDesktop, setIsDesktop] = useState(false);
  
  const gameStateRef = useRef({
    body: [{ x: 10, y: 10 }],
    direction: { x: 1, y: 0 },
    nextDirection: { x: 1, y: 0 },
    food: { x: 15, y: 15 },
    specialFood: null,
    particles: [],
  });

  // Load high score
  useEffect(() => {
    const saved = parseInt(localStorage.getItem('snake_highscore')) || 0;
    setHighScore(saved);
  }, []);

  // Responsive canvas sizing and desktop detection
  useEffect(() => {
    const updateSize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const desktop = width >= 768;
      setIsDesktop(desktop);
      
      if (containerRef.current) {
        // On desktop, leave room for side controls; on mobile, use more vertical space
        const maxWidth = desktop ? Math.min(width - 220, 500) : width - 24;
        const maxHeight = desktop ? height - 140 : height - 180;
        const maxSize = Math.min(maxWidth, maxHeight, desktop ? 500 : 400);
        const gridAligned = Math.floor(maxSize / 20) * 20;
        setCanvasSize(Math.max(gridAligned, 240));
      }
    };
    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Keep canvas dimensions in sync even before the game starts
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    canvas.width = canvasSize;
    canvas.height = canvasSize;
  }, [canvasSize]);

  // Reset game
  const resetGame = useCallback(() => {
    const gridCount = canvasSize / 20;
    const center = Math.floor(gridCount / 2);
    gameStateRef.current = {
      body: [
        { x: center, y: center },
        { x: center - 1, y: center },
        { x: center - 2, y: center },
      ],
      direction: { x: 1, y: 0 },
      nextDirection: { x: 1, y: 0 },
      food: { x: center + 5, y: center },
      specialFood: null,
      particles: [],
    };
    setScore(0);
    setSpeed(220); // Reset to slower start speed
  }, [canvasSize]);

  // Start game
  const startGame = () => {
    resetGame();
    setGameStatus('playing');
  };

  // Pause/Resume
  const togglePause = () => {
    setGameStatus(prev => prev === 'playing' ? 'paused' : 'playing');
  };

  // Direction change with validation
  const changeDirection = useCallback((newDir) => {
    const state = gameStateRef.current;
    const { x, y } = state.direction;
    
    if (newDir === 'up' && y === 0) state.nextDirection = { x: 0, y: -1 };
    else if (newDir === 'down' && y === 0) state.nextDirection = { x: 0, y: 1 };
    else if (newDir === 'left' && x === 0) state.nextDirection = { x: -1, y: 0 };
    else if (newDir === 'right' && x === 0) state.nextDirection = { x: 1, y: 0 };
  }, []);

  // Main game loop
  useEffect(() => {
    if (gameStatus !== 'playing') return;
    
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    canvas.width = canvasSize;
    canvas.height = canvasSize;
    const ctx = canvas.getContext('2d');
    const gridSize = 20;
    const gridCount = canvasSize / gridSize;

    const spawnFood = () => {
      const state = gameStateRef.current;
      let newFood;
      do {
        newFood = {
          x: Math.floor(Math.random() * gridCount),
          y: Math.floor(Math.random() * gridCount),
        };
      } while (state.body.some(s => s.x === newFood.x && s.y === newFood.y));
      return newFood;
    };

    const addParticles = (x, y, color) => {
      const state = gameStateRef.current;
      for (let i = 0; i < 8; i++) {
        state.particles.push({
          x: x * gridSize + gridSize / 2,
          y: y * gridSize + gridSize / 2,
          vx: (Math.random() - 0.5) * 8,
          vy: (Math.random() - 0.5) * 8,
          life: 1,
          color,
        });
      }
    };

    const drawRoundedRect = (x, y, w, h, r, fill, stroke = null) => {
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, r);
      ctx.fillStyle = fill;
      ctx.fill();
      if (stroke) {
        ctx.strokeStyle = stroke;
        ctx.lineWidth = 2;
        ctx.stroke();
      }
    };

    const gameLoop = () => {
      const state = gameStateRef.current;
      
      // Apply next direction
      state.direction = state.nextDirection;
      
      const head = { ...state.body[0] };
      head.x += state.direction.x;
      head.y += state.direction.y;

      // Wall collision
      if (head.x < 0 || head.x >= gridCount || head.y < 0 || head.y >= gridCount) {
        endGame();
        return;
      }

      // Self collision
      if (state.body.some(s => s.x === head.x && s.y === head.y)) {
        endGame();
        return;
      }

      state.body.unshift(head);

      // Food collision
      if (head.x === state.food.x && head.y === state.food.y) {
        const points = 10;
        setScore(s => s + points);
        addParticles(head.x, head.y, '#00ff88');
        state.food = spawnFood();
        
        // Speed up gradually (slower progression, higher minimum)
        setSpeed(s => Math.max(s - 1, 140));
        
        // Chance for special food
        if (Math.random() < 0.2 && !state.specialFood) {
          state.specialFood = { ...spawnFood(), timer: 50 };
        }
      } else {
        state.body.pop();
      }

      // Special food
      if (state.specialFood) {
        if (head.x === state.specialFood.x && head.y === state.specialFood.y) {
          setScore(s => s + 50);
          addParticles(head.x, head.y, '#ff00ff');
          state.body.push({ ...state.body[state.body.length - 1] });
          state.body.push({ ...state.body[state.body.length - 1] });
          state.specialFood = null;
        } else {
          state.specialFood.timer--;
          if (state.specialFood.timer <= 0) state.specialFood = null;
        }
      }

      // Update particles
      state.particles = state.particles.filter(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.life -= 0.05;
        return p.life > 0;
      });

      // Draw
      // Background with grid
      const gradient = ctx.createLinearGradient(0, 0, canvasSize, canvasSize);
      gradient.addColorStop(0, '#0f0a1f');
      gradient.addColorStop(1, '#1a1030');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvasSize, canvasSize);

      // Grid lines
      ctx.strokeStyle = 'rgba(124, 58, 237, 0.1)';
      ctx.lineWidth = 1;
      for (let i = 0; i <= gridCount; i++) {
        ctx.beginPath();
        ctx.moveTo(i * gridSize, 0);
        ctx.lineTo(i * gridSize, canvasSize);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i * gridSize);
        ctx.lineTo(canvasSize, i * gridSize);
        ctx.stroke();
      }

      // Snake body with gradient
      state.body.forEach((segment, index) => {
        const isHead = index === 0;
        const progress = index / state.body.length;
        
        // Glow effect
        ctx.shadowColor = isHead ? '#00ff88' : '#00d4ff';
        ctx.shadowBlur = isHead ? 15 : 8;
        
        const hue = 160 + progress * 40;
        const saturation = 100 - progress * 20;
        const lightness = 50 - progress * 15;
        
        drawRoundedRect(
          segment.x * gridSize + 1,
          segment.y * gridSize + 1,
          gridSize - 2,
          gridSize - 2,
          isHead ? 6 : 4,
          `hsl(${hue}, ${saturation}%, ${lightness}%)`
        );

        // Snake eyes
        if (isHead) {
          ctx.shadowBlur = 0;
          const eyeOffsetX = state.direction.x * 3;
          const eyeOffsetY = state.direction.y * 3;
          
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(
            segment.x * gridSize + gridSize / 2 - 4 + eyeOffsetX,
            segment.y * gridSize + gridSize / 2 - 2 + eyeOffsetY,
            3, 0, Math.PI * 2
          );
          ctx.arc(
            segment.x * gridSize + gridSize / 2 + 4 + eyeOffsetX,
            segment.y * gridSize + gridSize / 2 - 2 + eyeOffsetY,
            3, 0, Math.PI * 2
          );
          ctx.fill();
          
          ctx.fillStyle = '#000';
          ctx.beginPath();
          ctx.arc(
            segment.x * gridSize + gridSize / 2 - 4 + eyeOffsetX + state.direction.x,
            segment.y * gridSize + gridSize / 2 - 2 + eyeOffsetY + state.direction.y,
            1.5, 0, Math.PI * 2
          );
          ctx.arc(
            segment.x * gridSize + gridSize / 2 + 4 + eyeOffsetX + state.direction.x,
            segment.y * gridSize + gridSize / 2 - 2 + eyeOffsetY + state.direction.y,
            1.5, 0, Math.PI * 2
          );
          ctx.fill();
        }
      });

      // Food with pulsing glow
      const pulse = Math.sin(Date.now() / 200) * 0.3 + 0.7;
      ctx.shadowColor = '#ff0066';
      ctx.shadowBlur = 15 * pulse;
      
      const foodGradient = ctx.createRadialGradient(
        state.food.x * gridSize + gridSize / 2,
        state.food.y * gridSize + gridSize / 2,
        0,
        state.food.x * gridSize + gridSize / 2,
        state.food.y * gridSize + gridSize / 2,
        gridSize / 2
      );
      foodGradient.addColorStop(0, '#ff6699');
      foodGradient.addColorStop(1, '#ff0066');
      
      ctx.beginPath();
      ctx.arc(
        state.food.x * gridSize + gridSize / 2,
        state.food.y * gridSize + gridSize / 2,
        gridSize / 2 - 2,
        0, Math.PI * 2
      );
      ctx.fillStyle = foodGradient;
      ctx.fill();

      // Special food
      if (state.specialFood) {
        const sPulse = Math.sin(Date.now() / 100) * 0.5 + 0.5;
        ctx.shadowColor = '#ff00ff';
        ctx.shadowBlur = 20 * sPulse;
        
        ctx.save();
        ctx.translate(
          state.specialFood.x * gridSize + gridSize / 2,
          state.specialFood.y * gridSize + gridSize / 2
        );
        ctx.rotate(Date.now() / 200);
        
        ctx.beginPath();
        for (let i = 0; i < 5; i++) {
          const angle = (i * 4 * Math.PI) / 5 - Math.PI / 2;
          const radius = i % 2 === 0 ? gridSize / 2 - 2 : gridSize / 4;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;
          i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.fillStyle = `rgba(255, 0, 255, ${0.5 + sPulse * 0.5})`;
        ctx.fill();
        ctx.restore();
      }

      // Particles
      ctx.shadowBlur = 0;
      state.particles.forEach(p => {
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.life;
        ctx.beginPath();
        ctx.arc(p.x, p.y, 3 * p.life, 0, Math.PI * 2);
        ctx.fill();
      });
      ctx.globalAlpha = 1;
    };

    const endGame = () => {
      setGameStatus('gameover');
      setHighScore(prev => {
        const newHigh = Math.max(prev, score);
        localStorage.setItem('snake_highscore', newHigh);
        return newHigh;
      });
    };

    const interval = setInterval(gameLoop, speed);
    return () => clearInterval(interval);
  }, [gameStatus, canvasSize, speed, score]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameStatus !== 'playing') {
        if (e.key === ' ' || e.key === 'Enter') {
          if (gameStatus === 'start' || gameStatus === 'gameover') startGame();
          else if (gameStatus === 'paused') setGameStatus('playing');
        }
        return;
      }
      
      if (e.key === 'Escape' || e.key === 'p') {
        togglePause();
        return;
      }
      
      if (e.key === 'ArrowUp' || e.key === 'w') changeDirection('up');
      else if (e.key === 'ArrowDown' || e.key === 's') changeDirection('down');
      else if (e.key === 'ArrowLeft' || e.key === 'a') changeDirection('left');
      else if (e.key === 'ArrowRight' || e.key === 'd') changeDirection('right');
      
      e.preventDefault();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameStatus, changeDirection]);

  // Touch/Swipe controls
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let touchStartX = 0;
    let touchStartY = 0;

    const handleTouchStart = (e) => {
      touchStartX = e.touches[0].clientX;
      touchStartY = e.touches[0].clientY;
    };

    const handleTouchEnd = (e) => {
      if (gameStatus !== 'playing') return;
      
      const touchEndX = e.changedTouches[0].clientX;
      const touchEndY = e.changedTouches[0].clientY;
      const diffX = touchEndX - touchStartX;
      const diffY = touchEndY - touchStartY;
      const minSwipe = 30;

      if (Math.abs(diffX) > Math.abs(diffY)) {
        if (Math.abs(diffX) > minSwipe) {
          changeDirection(diffX > 0 ? 'right' : 'left');
        }
      } else {
        if (Math.abs(diffY) > minSwipe) {
          changeDirection(diffY > 0 ? 'down' : 'up');
        }
      }
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });
    
    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gameStatus, changeDirection]);

  const styles = {
    container: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0a1f 0%, #1a1030 100%)',
      color: '#fff',
      fontFamily: "'Segoe UI', system-ui, sans-serif",
      overflow: 'hidden',
    },
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: '12px 16px',
      background: 'rgba(124, 58, 237, 0.1)',
      borderBottom: '1px solid rgba(124, 58, 237, 0.2)',
      flexShrink: 0,
    },
    backBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: 'none',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '14px',
      fontWeight: '500',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      transition: 'all 0.2s',
    },
    title: {
      fontSize: '20px',
      fontWeight: '700',
      background: 'linear-gradient(90deg, #00ff88, #00d4ff)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      margin: 0,
    },
    scoreContainer: {
      display: 'flex',
      gap: '16px',
    },
    scoreBox: {
      textAlign: 'center',
    },
    scoreLabel: {
      fontSize: '10px',
      color: 'rgba(255, 255, 255, 0.6)',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    scoreValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#00ff88',
    },
    highScoreValue: {
      fontSize: '18px',
      fontWeight: '700',
      color: '#ff00ff',
    },
    gameArea: {
      flex: 1,
      display: 'flex',
      flexDirection: isDesktop ? 'row' : 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: isDesktop ? '24px 32px' : '16px',
      gap: isDesktop ? '32px' : '16px',
      overflow: 'auto',
    },
    gameWrapper: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      marginTop: isDesktop ? '-80px' : '-70px',
    },
    canvasContainer: {
      position: 'relative',
      borderRadius: '12px',
      overflow: 'hidden',
      boxShadow: '0 0 40px rgba(124, 58, 237, 0.3), inset 0 0 20px rgba(0, 0, 0, 0.5)',
      border: '2px solid rgba(124, 58, 237, 0.4)',
    },
    canvas: {
      display: 'block',
      touchAction: 'none',
    },
    overlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(15, 10, 31, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
      backdropFilter: 'blur(8px)',
      padding: isDesktop ? '16px' : '8px',
      boxSizing: 'border-box',
    },
    startOverlay: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      background: 'radial-gradient(ellipse at center, rgba(15, 10, 31, 0.92) 0%, rgba(0, 0, 0, 0.97) 100%)',
      backdropFilter: 'blur(8px)',
      padding: isDesktop ? '16px' : '8px',
      boxSizing: 'border-box',
    },
    snakeIconContainer: {
      width: isDesktop ? '90px' : '50px',
      height: isDesktop ? '90px' : '50px',
      minWidth: isDesktop ? '90px' : '50px',
      minHeight: isDesktop ? '90px' : '50px',
      flexShrink: 0,
      borderRadius: '50%',
      background: 'linear-gradient(135deg, rgba(0, 255, 136, 0.2), rgba(0, 212, 255, 0.2))',
      border: isDesktop ? '3px solid rgba(0, 255, 136, 0.5)' : '2px solid rgba(0, 255, 136, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: isDesktop ? '16px' : '6px',
      boxShadow: '0 0 40px rgba(0, 255, 136, 0.3), inset 0 0 20px rgba(0, 255, 136, 0.1)',
    },
    snakeIcon: {
      fontSize: isDesktop ? '42px' : '24px',
      filter: 'drop-shadow(0 0 10px rgba(0, 255, 136, 0.5))',
    },
    overlayTitle: {
      fontSize: isDesktop ? '38px' : '20px',
      fontWeight: '900',
      marginBottom: isDesktop ? '8px' : '2px',
      background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 50%, #ff00ff 100%)',
      WebkitBackgroundClip: 'text',
      WebkitTextFillColor: 'transparent',
      letterSpacing: isDesktop ? '4px' : '1px',
      flexShrink: 0,
    },
    overlaySubtitle: {
      fontSize: isDesktop ? '12px' : '8px',
      color: 'rgba(255, 255, 255, 0.5)',
      textTransform: 'uppercase',
      letterSpacing: isDesktop ? '3px' : '1px',
      marginBottom: isDesktop ? '20px' : '8px',
      flexShrink: 0,
    },
    overlayScore: {
      fontSize: isDesktop ? '52px' : '32px',
      fontWeight: '900',
      color: '#00ff88',
      margin: isDesktop ? '12px 0' : '4px 0',
      textShadow: '0 0 30px rgba(0, 255, 136, 0.5)',
      flexShrink: 0,
    },
    overlayText: {
      fontSize: isDesktop ? '14px' : '12px',
      color: 'rgba(255, 255, 255, 0.7)',
      marginBottom: isDesktop ? '24px' : '16px',
      textAlign: 'center',
      maxWidth: '280px',
      lineHeight: '1.5',
    },
    featureList: {
      display: 'flex',
      gap: isDesktop ? '20px' : '10px',
      marginBottom: isDesktop ? '24px' : '8px',
      flexWrap: 'wrap',
      justifyContent: 'center',
      flexShrink: 0,
    },
    featureItem: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: isDesktop ? '4px' : '1px',
    },
    featureIcon: {
      width: isDesktop ? '34px' : '22px',
      height: isDesktop ? '34px' : '22px',
      borderRadius: isDesktop ? '8px' : '5px',
      background: 'rgba(124, 58, 237, 0.2)',
      border: '1px solid rgba(124, 58, 237, 0.4)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: isDesktop ? '16px' : '10px',
    },
    featureText: {
      fontSize: isDesktop ? '10px' : '7px',
      color: 'rgba(255, 255, 255, 0.6)',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
    },
    playBtn: {
      background: 'linear-gradient(135deg, #00ff88 0%, #00d4ff 100%)',
      border: 'none',
      color: '#0f0a1f',
      padding: isDesktop ? '14px 44px' : '8px 24px',
      borderRadius: '50px',
      fontSize: isDesktop ? '16px' : '12px',
      fontWeight: '800',
      cursor: 'pointer',
      boxShadow: '0 6px 30px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.2)',
      transition: 'all 0.3s',
      textTransform: 'uppercase',
      letterSpacing: isDesktop ? '2px' : '1px',
      flexShrink: 0,
    },
    homeBtn: {
      background: 'transparent',
      border: '2px solid rgba(255, 255, 255, 0.3)',
      color: 'rgba(255, 255, 255, 0.8)',
      padding: isDesktop ? '12px 32px' : '6px 20px',
      borderRadius: '30px',
      fontSize: isDesktop ? '14px' : '11px',
      fontWeight: '600',
      cursor: 'pointer',
      marginTop: isDesktop ? '12px' : '6px',
      transition: 'all 0.3s',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      flexShrink: 0,
    },
    pausedBadge: {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      background: 'rgba(0, 0, 0, 0.8)',
      color: '#00d4ff',
      padding: '16px 28px',
      borderRadius: '12px',
      fontSize: '16px',
      fontWeight: '700',
      border: '2px solid rgba(0, 212, 255, 0.5)',
      cursor: 'pointer',
      textTransform: 'uppercase',
      letterSpacing: '1px',
    },
    controlsContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '8px',
      padding: '8px',
    },
    controlsPanel: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '12px',
      padding: isDesktop ? '24px' : '12px',
      background: isDesktop ? 'rgba(15, 10, 31, 0.8)' : 'transparent',
      borderRadius: '20px',
      border: isDesktop ? '2px solid rgba(0, 212, 255, 0.3)' : 'none',
      boxShadow: isDesktop ? '0 0 30px rgba(0, 212, 255, 0.15)' : 'none',
    },
    controlsTitle: {
      fontSize: '13px',
      fontWeight: '700',
      color: '#00d4ff',
      textTransform: 'uppercase',
      letterSpacing: '2px',
      marginBottom: '4px',
    },
    dpadContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '8px',
    },
    dpadRow: {
      display: 'flex',
      gap: '8px',
    },
    controlBtn: {
      width: isDesktop ? '56px' : '50px',
      height: isDesktop ? '56px' : '50px',
      background: 'linear-gradient(145deg, rgba(0, 212, 255, 0.2), rgba(124, 58, 237, 0.3))',
      border: '2px solid rgba(0, 212, 255, 0.4)',
      color: '#00d4ff',
      borderRadius: '14px',
      fontSize: isDesktop ? '22px' : '20px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'all 0.15s',
      WebkitTapHighlightColor: 'transparent',
      touchAction: 'manipulation',
      boxShadow: '0 4px 15px rgba(0, 212, 255, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    centerBtn: {
      background: 'linear-gradient(145deg, rgba(255, 0, 102, 0.3), rgba(255, 0, 102, 0.1))',
      border: '2px solid rgba(255, 0, 102, 0.5)',
      color: '#ff0066',
      boxShadow: '0 4px 15px rgba(255, 0, 102, 0.2), inset 0 1px 0 rgba(255,255,255,0.1)',
    },
    statsPanel: {
      display: 'flex',
      flexDirection: 'column',
      gap: '8px',
      padding: '12px 16px',
      background: 'rgba(0, 0, 0, 0.3)',
      borderRadius: '10px',
      width: '100%',
    },
    statRow: {
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: '13px',
    },
    statLabel: {
      color: 'rgba(255, 255, 255, 0.6)',
    },
    statValue: {
      color: '#00ff88',
      fontWeight: '600',
    },
    pauseBtn: {
      background: 'rgba(255, 255, 255, 0.1)',
      border: '1px solid rgba(255, 255, 255, 0.2)',
      color: '#fff',
      padding: '8px 16px',
      borderRadius: '8px',
      fontSize: '14px',
      cursor: 'pointer',
      marginTop: '8px',
    },
    hint: {
      fontSize: '12px',
      color: 'rgba(255, 255, 255, 0.5)',
      textAlign: 'center',
      marginTop: '4px',
    },
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <GameHeaderBar
        onBack={goHome}
        title="🐍 Snake"
        score={score}
        highScore={highScore}
      />

      {/* Game Area */}
      <div style={styles.gameArea} ref={containerRef}>
        <div style={styles.gameWrapper}>
          <div style={styles.canvasContainer}>
            <canvas ref={canvasRef} style={styles.canvas} />
          
          {/* Start Screen */}
          {gameStatus === 'start' && (
            <GameOverlay isDesktop={isDesktop} variant="start">
              <div style={styles.snakeIconContainer}>
                <span style={styles.snakeIcon}>🐍</span>
              </div>
              <div style={styles.overlayTitle}>SNAKE</div>
              <div style={styles.overlaySubtitle}>Classic Arcade</div>
              
              <div style={styles.featureList}>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}>🎯</div>
                  <span style={styles.featureText}>Eat Food</span>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}>📊</div>
                  <span style={styles.featureText}>Grow</span>
                </div>
                <div style={styles.featureItem}>
                  <div style={styles.featureIcon}>⚡</div>
                  <span style={styles.featureText}>Speed Up</span>
                </div>
              </div>
              
              <button 
                style={styles.playBtn}
                onClick={startGame}
                onMouseEnter={e => {
                  e.target.style.transform = 'scale(1.05)';
                  e.target.style.boxShadow = '0 8px 40px rgba(0, 255, 136, 0.5), 0 0 80px rgba(0, 255, 136, 0.3)';
                }}
                onMouseLeave={e => {
                  e.target.style.transform = 'scale(1)';
                  e.target.style.boxShadow = '0 6px 30px rgba(0, 255, 136, 0.4), 0 0 60px rgba(0, 255, 136, 0.2)';
                }}
              >
                ▶ START
              </button>
              
              <div style={{ ...styles.hint, marginTop: isDesktop ? '20px' : '6px', fontSize: isDesktop ? '11px' : '9px' }}>
                {isDesktop ? 'Press SPACE or tap to start' : 'Tap to start'}
              </div>
              
              {highScore > 0 && (
                <div style={{ marginTop: isDesktop ? '16px' : '6px', textAlign: 'center', flexShrink: 0 }}>
                  <div style={{ fontSize: isDesktop ? '11px' : '8px', color: 'rgba(255, 255, 255, 0.4)', textTransform: 'uppercase', letterSpacing: '1px' }}>High Score</div>
                  <div style={{ fontSize: isDesktop ? '24px' : '16px', fontWeight: '700', color: '#ff00ff', textShadow: '0 0 20px rgba(255, 0, 255, 0.5)' }}>{highScore}</div>
                </div>
              )}
            </GameOverlay>
          )}

          {/* Paused indicator - just a small badge, no overlay */}
          {gameStatus === 'paused' && (
            <div style={styles.pausedBadge} onClick={() => setGameStatus('playing')}>
              ⏸ PAUSED - Tap to Resume
            </div>
          )}

          {/* Game Over Screen */}
          {gameStatus === 'gameover' && (
            <GameOverlay isDesktop={isDesktop}>
              <div style={{ 
                width: isDesktop ? '80px' : '50px', 
                height: isDesktop ? '80px' : '50px', 
                borderRadius: '50%', 
                background: 'linear-gradient(135deg, rgba(255, 0, 102, 0.3), rgba(255, 0, 102, 0.1))',
                border: isDesktop ? '3px solid rgba(255, 0, 102, 0.5)' : '2px solid rgba(255, 0, 102, 0.5)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: isDesktop ? '16px' : '6px',
                boxShadow: '0 0 40px rgba(255, 0, 102, 0.3)',
                flexShrink: 0,
              }}>
                <span style={{ fontSize: isDesktop ? '40px' : '24px' }}>💀</span>
              </div>
              <div style={{ ...styles.overlayTitle, background: 'linear-gradient(135deg, #ff0066, #ff6699)', WebkitBackgroundClip: 'text' }}>GAME OVER</div>
              <div style={{ fontSize: isDesktop ? '11px' : '8px', color: 'rgba(255, 255, 255, 0.5)', textTransform: 'uppercase', letterSpacing: isDesktop ? '2px' : '1px', marginBottom: isDesktop ? '8px' : '2px', flexShrink: 0 }}>Your Score</div>
              <div style={styles.overlayScore}>{score}</div>
              {score >= highScore && score > 0 && (
                <div style={{ 
                  background: 'linear-gradient(135deg, rgba(255, 0, 255, 0.2), rgba(255, 0, 255, 0.1))',
                  border: '1px solid rgba(255, 0, 255, 0.4)',
                  padding: isDesktop ? '8px 20px' : '4px 12px',
                  borderRadius: '20px',
                  color: '#ff00ff', 
                  marginBottom: isDesktop ? '20px' : '8px', 
                  fontWeight: '700',
                  fontSize: isDesktop ? '13px' : '10px',
                  letterSpacing: '1px',
                  flexShrink: 0,
                }}>
                  🎉 NEW HIGH SCORE!
                </div>
              )}
              <button 
                style={styles.playBtn}
                onClick={startGame}
                onMouseEnter={e => e.target.style.transform = 'scale(1.05)'}
                onMouseLeave={e => e.target.style.transform = 'scale(1)'}
              >
                🔄 RETRY
              </button>
              <button 
                style={styles.homeBtn}
                onClick={goHome}
                onMouseEnter={e => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.5)';
                }}
                onMouseLeave={e => {
                  e.target.style.background = 'transparent';
                  e.target.style.borderColor = 'rgba(255, 255, 255, 0.3)';
                }}
              >
                🏠 HOME
              </button>
            </GameOverlay>
          )}
          </div>
          
          {/* Mobile hint below canvas */}
          {!isDesktop && (gameStatus === 'playing' || gameStatus === 'paused') && (
            <div style={styles.hint}>
              Swipe on game to control
            </div>
          )}
        </div>

        {/* Controls Panel - Right side on desktop, below on mobile */}
        {(gameStatus === 'playing' || gameStatus === 'paused') && (
          <DpadControlsPanel
            isDesktop={isDesktop}
            gameStatus={gameStatus}
            onDirection={changeDirection}
            onTogglePause={togglePause}
            hintText={isDesktop ? 'W A S D or Arrow Keys' : 'Tap D-pad to move'}
            speedPercent={Math.round((220 - speed) / 80 * 100)}
            length={gameStateRef.current.body?.length || 3}
            showStats
          />
        )}
      </div>
    </div>
  );
}

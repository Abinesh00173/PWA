import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { DpadControlsPanel } from '../components/DpadControlsPanel';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

const TETROMINOS = [
  [[1, 1, 1, 1]], // I
  [[1, 1], [1, 1]], // O
  [[0, 1, 1], [1, 1, 0]], // S
  [[1, 1, 0], [0, 1, 1]], // Z
  [[1, 0, 0], [1, 1, 1]], // J
  [[0, 0, 1], [1, 1, 1]], // L
  [[0, 1, 0], [1, 1, 1]], // T
];

export default function TetrisGame({ goHome, soundEnabled }) {
  const canvasRef = useRef(null);
  const [score, setScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const intervalRef = useRef(null);
  const gameStateRef = useRef({
    board: Array(20).fill(null).map(() => Array(10).fill(0)),
    piece: null, x: 3, y: 0, score: 0, gameRunning: false
  });

  useEffect(() => {
    const saved = parseInt(localStorage.getItem('tetris_score')) || 0;
    setHighScore(saved);
  }, []);

  const startGame = () => {
    gameStateRef.current = {
      board: Array(20).fill(null).map(() => Array(10).fill(0)),
      piece: null, x: 3, y: 0, score: 0, gameRunning: true
    };
    setScore(0);
    setGameStatus('playing');
  };

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const canPlacePiece = (piece, x, y) => {
    const state = gameStateRef.current;
    for (let row = 0; row < piece.length; row++) {
      for (let col = 0; col < piece[row].length; col++) {
        if (piece[row][col]) {
          const nx = x + col;
          const ny = y + row;
          if (nx < 0 || nx >= 10 || ny >= 20 || (ny >= 0 && state.board[ny][nx])) return false;
        }
      }
    }
    return true;
  };

  const handleDirection = (dir) => {
    const state = gameStateRef.current;
    if (!state.piece) return;
    if (dir === 'left' && canPlacePiece(state.piece, state.x - 1, state.y)) state.x--;
    if (dir === 'right' && canPlacePiece(state.piece, state.x + 1, state.y)) state.x++;
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = 200;
    canvas.height = 400;
    const ctx = canvas.getContext('2d');
    const state = gameStateRef.current;
    const cellSize = 20;

    // Draw empty board when not playing
    if (gameStatus !== 'playing') {
      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 400);
      return;
    }

    const spawnPiece = () => {
      state.piece = TETROMINOS[Math.floor(Math.random() * TETROMINOS.length)];
      state.x = 3;
      state.y = 0;
    };

    if (!state.piece) spawnPiece();

    const canPlacePieceLocal = (piece, x, y) => {
      for (let row = 0; row < piece.length; row++) {
        for (let col = 0; col < piece[row].length; col++) {
          if (piece[row][col]) {
            const nx = x + col;
            const ny = y + row;
            if (nx < 0 || nx >= 10 || ny >= 20 || (ny >= 0 && state.board[ny][nx])) return false;
          }
        }
      }
      return true;
    };

    const placePiece = () => {
      for (let row = 0; row < state.piece.length; row++) {
        for (let col = 0; col < state.piece[row].length; col++) {
          if (state.piece[row][col]) {
            const ny = state.y + row;
            if (ny >= 0) state.board[ny][state.x + col] = 1;
          }
        }
      }

      for (let row = 0; row < 20; row++) {
        if (state.board[row].every(cell => cell)) {
          state.board.splice(row, 1);
          state.board.unshift(Array(10).fill(0));
          state.score += 100;
          setScore(state.score);
        }
      }

      spawnPiece();
      if (!canPlacePieceLocal(state.piece, state.x, state.y)) {
        state.gameRunning = false;
        if (state.score > parseInt(localStorage.getItem('tetris_score') || 0)) {
          localStorage.setItem('tetris_score', state.score);
          setHighScore(state.score);
        }
        setGameStatus('gameover');
      }
    };

    const gameLoop = () => {
      if (!state.gameRunning) return;

      if (canPlacePieceLocal(state.piece, state.x, state.y + 1)) {
        state.y++;
      } else {
        placePiece();
      }

      ctx.fillStyle = '#000';
      ctx.fillRect(0, 0, 200, 400);

      state.board.forEach((row, y) => {
        row.forEach((cell, x) => {
          if (cell) {
            ctx.fillStyle = '#27ae60';
            ctx.fillRect(x * cellSize, y * cellSize, cellSize - 1, cellSize - 1);
          }
        });
      });

      if (state.piece) {
        ctx.fillStyle = '#e74c3c';
        state.piece.forEach((row, y) => {
          row.forEach((cell, x) => {
            if (cell) {
              ctx.fillRect((state.x + x) * cellSize, (state.y + y) * cellSize, cellSize - 1, cellSize - 1);
            }
          });
        });
      }
    };

    const handleKeyDown = (e) => {
      if (e.key === 'ArrowLeft' && canPlacePieceLocal(state.piece, state.x - 1, state.y)) state.x--;
      if (e.key === 'ArrowRight' && canPlacePieceLocal(state.piece, state.x + 1, state.y)) state.x++;
    };

    window.addEventListener('keydown', handleKeyDown);
    intervalRef.current = setInterval(gameLoop, 500);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [gameStatus]);

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Tetris" score={score} showBest={false} />
      <div className="game-canvas-container" style={{ display: 'flex', flexDirection: isDesktop ? 'row' : 'column', alignItems: 'center', gap: '20px', position: 'relative' }}>
        <div style={{ position: 'relative' }}>
          <canvas ref={canvasRef}></canvas>
          
          {gameStatus === 'start' && (
            <StartOverlay
              isDesktop={isDesktop}
              icon="🧱"
              title="TETRIS"
              subtitle="Block Puzzle"
              features={[
                { icon: '⬅️', text: 'Move' },
                { icon: '🔲', text: 'Stack' },
                { icon: '💥', text: 'Clear' },
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
            directions={['left', 'right']}
            hintText={isDesktop ? 'Arrow keys or buttons' : 'Tap to move'}
          />
        )}
      </div>
    </div>
  );
}

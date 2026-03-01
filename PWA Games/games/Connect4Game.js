import { useState, useEffect } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

export default function Connect4Game({ goHome }) {
  const [board, setBoard] = useState(Array(42).fill(0));
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [message, setMessage] = useState('Your Turn');
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const stored = parseInt(localStorage.getItem('connect4_highscore')) || 0;
    setHighScore(stored);
  }, []);

  const startGame = () => {
    setBoard(Array(42).fill(0));
    setScore(0);
    setGameOver(false);
    setMessage('Your Turn');
    setGameStatus('playing');
  };

  const checkWin = (arr, player) => {
    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        const idx = row * 7 + col;
        if (arr[idx] !== player) continue;
        if (col + 3 < 7 && arr[idx + 1] === player && arr[idx + 2] === player && arr[idx + 3] === player) return true;
        if (row + 3 < 6 && arr[idx + 7] === player && arr[idx + 14] === player && arr[idx + 21] === player) return true;
      }
    }
    return false;
  };

  const dropPiece = (col, newBoard) => {
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row * 7 + col] === 0) {
        newBoard[row * 7 + col] = 1;
        return true;
      }
    }
    return false;
  };

  const aiMove = (newBoard) => {
    const col = Math.floor(Math.random() * 7);
    for (let row = 5; row >= 0; row--) {
      if (newBoard[row * 7 + col] === 0) {
        newBoard[row * 7 + col] = 2;
        return;
      }
    }
    aiMove(newBoard);
  };

  const handleClick = (col) => {
    if (gameOver || gameStatus !== 'playing') return;
    const newBoard = [...board];
    if (!dropPiece(col, newBoard)) return;

    if (checkWin(newBoard, 1)) {
      const newScore = score + 100;
      setScore(newScore);
      if (newScore > highScore) {
        setHighScore(newScore);
        localStorage.setItem('connect4_highscore', newScore);
      }
      setGameOver(true);
      setMessage('You Win! 🎉');
      setGameStatus('gameover');
      return;
    }

    aiMove(newBoard);
    if (checkWin(newBoard, 2)) {
      setGameOver(true);
      setMessage('AI Wins!');
      setGameStatus('gameover');
      return;
    }

    setBoard(newBoard);
  };

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Connect 4" score={score} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'playing' && (
          <div style={{ textAlign: 'center', padding: '20px' }}>
            <div style={{ fontSize: '1.2em', marginBottom: '20px' }}>{message}</div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(7, 50px)',
              gap: '5px',
              margin: '20px auto',
              backgroundColor: '#3498db',
              padding: '10px',
              borderRadius: '5px',
              width: 'fit-content'
            }}>
              {board.map((val, idx) => (
                <div
                  key={idx}
                  onClick={() => handleClick(idx % 7)}
                  style={{
                    width: '50px',
                    height: '50px',
                    backgroundColor: val === 0 ? '#fff' : val === 1 ? '#FFD700' : '#e74c3c',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    border: '2px solid #2c3e50'
                  }}
                />
              ))}
            </div>
          </div>
        )}
      </div>
      {gameStatus === 'start' && (
        <StartOverlay
          isDesktop={isDesktop}
          icon="🔴"
          title="CONNECT 4"
          subtitle="Strategy Game"
          features={[
            { icon: '🧠', text: 'Strategy' },
            { icon: '🤖', text: 'VS AI' },
            { icon: '🏆', text: 'Win' }
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

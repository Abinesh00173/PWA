import { useState, useEffect } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay } from '../components/StartOverlay';

export default function TicTacToeGame({ goHome }) {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [isXNext, setIsXNext] = useState(true);
  const [scores, setScores] = useState({ player: 0, ai: 0 });
  const [gameStatus, setGameStatus] = useState('start');
  const [isDesktop, setIsDesktop] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    const saved = parseInt(localStorage.getItem('tictactoe_score')) || 0;
    setScores({ player: saved, ai: 0 });
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
    setGameStatus('playing');
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    return null;
  };

  const aiMove = (currentBoard) => {
    const empty = currentBoard.map((val, idx) => val === null ? idx : null).filter(val => val !== null);
    if (empty.length === 0) return;

    const newBoard = [...currentBoard];
    
    // Check if AI can win
    for (let i of empty) {
      newBoard[i] = 'O';
      if (calculateWinner(newBoard) === 'O') {
        setBoard(newBoard);
        return;
      }
      newBoard[i] = null;
    }

    // Check if need to block
    for (let i of empty) {
      newBoard[i] = 'X';
      if (calculateWinner(newBoard) === 'X') {
        newBoard[i] = 'O';
        setBoard(newBoard);
        return;
      }
      newBoard[i] = null;
    }

    // Take center
    if (newBoard[4] === null) {
      newBoard[4] = 'O';
      setBoard(newBoard);
      return;
    }

    // Random move
    const move = empty[Math.floor(Math.random() * empty.length)];
    newBoard[move] = 'O';
    setBoard(newBoard);
  };

  const handleClick = (index) => {
    if (board[index] || calculateWinner(board) || !isXNext || gameStatus !== 'playing') return;

    const newBoard = [...board];
    newBoard[index] = 'X';
    setBoard(newBoard);

    if (calculateWinner(newBoard) === 'X') {
      const newScore = scores.player + 1;
      setScores({ ...scores, player: newScore });
      localStorage.setItem('tictactoe_score', newScore);
      return;
    }

    setIsXNext(false);
    setTimeout(() => {
      aiMove(newBoard);
      setIsXNext(true);
    }, 500);
  };

  const winner = calculateWinner(board);
  const isBoardFull = board.every(cell => cell !== null);
  const status = winner ? `Winner: ${winner}` : isBoardFull ? 'Draw!' : `Current: ${isXNext ? 'X (You)' : 'O (AI)'}`;

  const resetGame = () => {
    setBoard(Array(9).fill(null));
    setIsXNext(true);
  };

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Tic Tac Toe" score={scores.player} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'start' && (
          <StartOverlay
            isDesktop={isDesktop}
            icon="⭕"
            title="TIC TAC TOE"
            subtitle="Classic Game"
            features={[
              { icon: '❌', text: 'Place' },
              { icon: '🛡️', text: 'Block' },
              { icon: '🏆', text: 'Win' }
            ]}
            onStart={startGame}
            highScore={0}
          />
        )}
        {gameStatus === 'playing' && (
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '1.2em', marginBottom: '20px', fontWeight: 'bold' }}>{status}</div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 100px)',
            gap: '5px',
            margin: '20px auto',
            backgroundColor: '#ddd',
            padding: '5px',
          }}>
            {board.map((cell, idx) => (
              <button
                key={idx}
                onClick={() => handleClick(idx)}
                style={{
                  width: '100px',
                  height: '100px',
                  fontSize: '2em',
                  fontWeight: 'bold',
                  backgroundColor: '#fff',
                  border: 'none',
                  cursor: 'pointer',
                  borderRadius: '5px',
                  color: cell === 'X' ? '#ff6b6b' : '#27ae60',
                }}
              >
                {cell}
              </button>
            ))}
          </div>
          <button
            onClick={resetGame}
            style={{
              padding: '10px 20px',
              fontSize: '1em',
              backgroundColor: '#3498db',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            New Game
          </button>
        </div>
        )}
      </div>
    </div>
  );
}

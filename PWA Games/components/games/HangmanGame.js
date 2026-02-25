import { useState, useEffect } from 'react';

const WORDS = ['javascript', 'programming', 'developer', 'gameverse', 'react', 'nextjs', 'webdev', 'coding', 'browser', 'computer'];

export default function HangmanGame({ goHome }) {
  const [word, setWord] = useState('');
  const [guessed, setGuessed] = useState([]);
  const [wrong, setWrong] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [won, setWon] = useState(false);

  useEffect(() => {
    startNewGame();
  }, []);

  const startNewGame = () => {
    const newWord = WORDS[Math.floor(Math.random() * WORDS.length)];
    setWord(newWord);
    setGuessed([]);
    setWrong(0);
    setGameOver(false);
    setWon(false);
  };

  const handleGuess = (letter) => {
    if (guessed.includes(letter) || gameOver || won) return;

    const newGuessed = [...guessed, letter];
    setGuessed(newGuessed);

    if (!word.includes(letter)) {
      const newWrong = wrong + 1;
      setWrong(newWrong);
      if (newWrong >= 6) {
        setGameOver(true);
      }
    }

    // Check if won
    if (word.split('').every(l => newGuessed.includes(l))) {
      setWon(true);
      const score = 100 - wrong;
      const saved = parseInt(localStorage.getItem('hangman_score')) || 0;
      if (score > saved) localStorage.setItem('hangman_score', score);
    }
  };

  const hangman = ['😊', '😐', '😕', '😟', '😢', '😭', '💀'];

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Hangman</h3>
        <span>{Math.max(0, 6 - wrong)}</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '3em', marginBottom: '20px' }}>{hangman[wrong]}</div>
          
          <div style={{ fontSize: '2em', letterSpacing: '10px', marginBottom: '30px', fontFamily: 'monospace' }}>
            {word.split('').map((l, i) => (
              <span key={i}>{guessed.includes(l) ? l : '_'}</span>
            ))}
          </div>

          <div style={{ marginBottom: '20px', fontSize: '0.9em' }}>
            Wrong: {wrong}/6
          </div>

          {gameOver && <div style={{ fontSize: '1.5em', color: '#e74c3c', marginBottom: '20px' }}>💀 Game Over! Word: {word}</div>}
          {won && <div style={{ fontSize: '1.5em', color: '#27ae60', marginBottom: '20px' }}>🎉 You Won!</div>}

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', justifyContent: 'center', marginBottom: '20px' }}>
            {['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z'].map(l => (
              <button
                key={l}
                onClick={() => handleGuess(l)}
                disabled={guessed.includes(l) || gameOver || won}
                style={{
                  padding: '8px 12px',
                  fontSize: '0.9em',
                  backgroundColor: guessed.includes(l) ? '#95a5a6' : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  opacity: guessed.includes(l) ? 0.5 : 1,
                }}
              >
                {l}
              </button>
            ))}
          </div>

          <button
            onClick={startNewGame}
            style={{
              padding: '10px 20px',
              fontSize: '1em',
              backgroundColor: '#27ae60',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
          >
            New Game
          </button>
        </div>
      </div>
    </div>
  );
}

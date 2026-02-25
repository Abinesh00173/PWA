import { useState, useEffect, useRef } from 'react';

const WORDS = ['javascript', 'python', 'gaming', 'programming', 'development', 'puzzle', 'challenge', 'awesome', 'typescript', 'react'];

export default function TypingGame({ goHome }) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      setGameOver(true);
      localStorage.setItem('typing_score', Math.max(parseInt(localStorage.getItem('typing_score')) || 0, score));
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver) return;
      
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        if (typedText.trim() === WORDS[currentWordIdx]) {
          const newScore = score + 10;
          setScore(newScore);
          localStorage.setItem('typing_score', newScore);
          setCurrentWordIdx((currentWordIdx + 1) % WORDS.length);
          setTypedText('');
          setAccuracy(100);
        } else {
          setAccuracy(Math.max(0, accuracy - 10));
          setTypedText('');
        }
      } else if (e.key === 'Backspace') {
        setTypedText(typedText.slice(0, -1));
      } else if (e.key.length === 1) {
        const newText = typedText + e.key;
        setTypedText(newText);
        const word = WORDS[currentWordIdx];
        const newAccuracy = Math.floor((newText.split('').filter((c, i) => c === word[i]).length / Math.max(newText.length, word.length)) * 100);
        setAccuracy(newAccuracy);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [typedText, currentWordIdx, gameOver, score, accuracy]);

  if (gameOver) {
    return (
      <div className="screen">
        <div className="game-header">
          <button className="back-btn" onClick={goHome}>← Back</button>
          <h3>Typing Game</h3>
          <span>{score}</span>
        </div>
        <div className="game-canvas-container">
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.5em' }}>
            <div style={{ marginBottom: '20px' }}>⌨️ Time&apos;s Up!</div>
            <div style={{ fontSize: '2em', marginBottom: '20px', fontWeight: 'bold' }}>Final Score: {score}</div>
            <button onClick={goHome} style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#3498db', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}>Back to Home</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Typing Game</h3>
        <span>{score}</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9em', marginBottom: '10px' }}>Time: {timeLeft}s | Accuracy: {accuracy}%</div>
          <div style={{ fontSize: '2em', marginBottom: '20px', fontWeight: 'bold', backgroundColor: '#2c3e50', padding: '10px', borderRadius: '5px' }}>
            {WORDS[currentWordIdx]}
          </div>
          <div style={{
            fontSize: '1.5em',
            padding: '10px',
            backgroundColor: '#34495e',
            borderRadius: '5px',
            marginBottom: '20px',
            minHeight: '40px'
          }}>
            {typedText}
            <span style={{ animation: 'blink 1s infinite' }}>|</span>
          </div>
          <div style={{ fontSize: '0.9em', color: '#bdc3c7' }}>Type the word and press Space to submit</div>
        </div>
      </div>
    </div>
  );
}

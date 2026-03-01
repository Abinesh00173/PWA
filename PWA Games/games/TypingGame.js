import { useState, useEffect, useRef } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

const WORDS = ['javascript', 'python', 'gaming', 'programming', 'development', 'puzzle', 'challenge', 'awesome', 'typescript', 'react'];

export default function TypingGame({ goHome }) {
  const [currentWordIdx, setCurrentWordIdx] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [score, setScore] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    setHighScore(parseInt(localStorage.getItem('typing_score')) || 0);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setCurrentWordIdx(0);
    setTypedText('');
    setScore(0);
    setAccuracy(100);
    setTimeLeft(60);
    setGameOver(false);
    setIsNewHighScore(false);
    setGameStatus('playing');
  };

  useEffect(() => {
    if (gameStatus !== 'playing') return;
    if (timeLeft <= 0) {
      setGameOver(true);
      const saved = parseInt(localStorage.getItem('typing_score')) || 0;
      if (score > saved) {
        localStorage.setItem('typing_score', score);
        setIsNewHighScore(true);
        setHighScore(score);
      }
      setGameStatus('gameover');
      return;
    }

    const timer = setInterval(() => setTimeLeft(t => t - 1), 1000);
    return () => clearInterval(timer);
  }, [timeLeft, score, gameStatus]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (gameOver || gameStatus !== 'playing') return;
      
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
  }, [typedText, currentWordIdx, gameOver, score, accuracy, gameStatus]);

  if (gameOver) {
    return (
      <div className="screen">
        <GameHeaderBar onBack={goHome} title="Typing Game" score={score} showBest={false} />
        <div className="game-canvas-container">
          <GameOverOverlay
            isDesktop={isDesktop}
            score={score}
            highScore={highScore}
            isNewHighScore={isNewHighScore}
            onRestart={startGame}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="screen">
      <GameHeaderBar onBack={goHome} title="Typing Game" score={score} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'start' && (
          <StartOverlay
            isDesktop={isDesktop}
            icon="⌨️"
            title="TYPING"
            subtitle="Speed Test"
            features={[
              { icon: '📝', text: 'Type' },
              { icon: '🎯', text: 'Accuracy' },
              { icon: '⚡', text: 'Speed' }
            ]}
            onStart={startGame}
            highScore={highScore}
          />
        )}
        {gameStatus === 'playing' && (
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
        )}
      </div>
    </div>
  );
}

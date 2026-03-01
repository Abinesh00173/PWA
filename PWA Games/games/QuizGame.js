import { useState, useEffect } from 'react';
import { GameHeaderBar } from '../components/GameUIComponents';
import { StartOverlay, GameOverOverlay } from '../components/StartOverlay';

const QUESTIONS = [
  { q: 'What is the capital of France?', opts: ['London', 'Paris', 'Berlin', 'Madrid'], ans: 1 },
  { q: 'Which planet is known as the Red Planet?', opts: ['Venus', 'Mars', 'Jupiter', 'Saturn'], ans: 1 },
  { q: 'Who wrote Romeo and Juliet?', opts: ['Shakespeare', 'Marlowe', 'Jonson', 'Bacon'], ans: 0 },
  { q: 'What is the largest ocean?', opts: ['Atlantic', 'Indian', 'Arctic', 'Pacific'], ans: 3 },
  { q: 'How many continents are there?', opts: ['5', '6', '7', '8'], ans: 2 },
  { q: 'What is 5 + 3?', opts: ['7', '8', '9', '10'], ans: 1 },
  { q: 'What is the smallest country?', opts: ['Monaco', 'Vatican', 'Liechtenstein', 'Malta'], ans: 1 },
];

export default function QuizGame({ goHome }) {
  const [current, setCurrent] = useState(0);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState(null);
  const [gameOver, setGameOver] = useState(false);
  const [gameStatus, setGameStatus] = useState('start');
  const [highScore, setHighScore] = useState(0);
  const [isDesktop, setIsDesktop] = useState(false);
  const [isNewHighScore, setIsNewHighScore] = useState(false);

  useEffect(() => {
    setIsDesktop(window.innerWidth >= 768);
    const handleResize = () => setIsDesktop(window.innerWidth >= 768);
    window.addEventListener('resize', handleResize);
    setHighScore(parseInt(localStorage.getItem('quiz_score')) || 0);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const startGame = () => {
    setCurrent(0);
    setScore(0);
    setAnswered(false);
    setSelected(null);
    setGameOver(false);
    setIsNewHighScore(false);
    setGameStatus('playing');
  };

  const question = QUESTIONS[current];

  const handleAnswer = (idx) => {
    if (answered || gameStatus !== 'playing') return;
    setSelected(idx);
    setAnswered(true);
    if (idx === question.ans) {
      const newScore = score + 10;
      setScore(newScore);
    }
  };

  const nextQuestion = () => {
    if (current < QUESTIONS.length - 1) {
      setCurrent(current + 1);
      setAnswered(false);
      setSelected(null);
    } else {
      const saved = parseInt(localStorage.getItem('quiz_score')) || 0;
      const finalScore = score;
      if (finalScore > saved) {
        localStorage.setItem('quiz_score', finalScore);
        setIsNewHighScore(true);
        setHighScore(finalScore);
      }
      setGameOver(true);
      setGameStatus('gameover');
    }
  };

  if (gameOver) {
    return (
      <div className="screen">
        <GameHeaderBar onBack={goHome} title="Quiz Master" score={score} showBest={false} />
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
      <GameHeaderBar onBack={goHome} title="Quiz Master" score={`${current + 1}/${QUESTIONS.length}`} showBest={false} />
      <div className="game-canvas-container">
        {gameStatus === 'start' && (
          <StartOverlay
            isDesktop={isDesktop}
            icon="❓"
            title="QUIZ"
            subtitle="Trivia Game"
            features={[
              { icon: '✅', text: 'Answer' },
              { icon: '💯', text: 'Score' },
              { icon: '📚', text: 'Learn' }
            ]}
            onStart={startGame}
            highScore={highScore}
          />
        )}
        {gameStatus === 'playing' && (
        <div style={{ padding: '20px', textAlign: 'center' }}>
          <div style={{ fontSize: '1.2em', marginBottom: '30px', fontWeight: 'bold' }}>{question.q}</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '10px', marginBottom: '20px' }}>
            {question.opts.map((opt, idx) => (
              <button
                key={idx}
                onClick={() => handleAnswer(idx)}
                disabled={answered}
                style={{
                  padding: '12px',
                  fontSize: '1em',
                  backgroundColor: selected === idx ? (idx === question.ans ? '#27ae60' : '#e74c3c') : '#3498db',
                  color: 'white',
                  border: 'none',
                  borderRadius: '5px',
                  cursor: 'pointer',
                  opacity: answered & idx !== selected ? 0.6 : 1,
                }}
              >
                {opt}
              </button>
            ))}
          </div>
          {answered && (
            <button
              onClick={nextQuestion}
              style={{ padding: '10px 20px', fontSize: '1em', backgroundColor: '#27ae60', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer' }}
            >
              Next
            </button>
          )}
        </div>
        )}
      </div>
    </div>
  );
}

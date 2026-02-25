import { useState, useEffect } from 'react';

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

  const question = QUESTIONS[current];

  const handleAnswer = (idx) => {
    if (answered) return;
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
      if (score > saved) localStorage.setItem('quiz_score', score);
      setGameOver(true);
    }
  };

  if (gameOver) {
    return (
      <div className="screen">
        <div className="game-header">
          <button className="back-btn" onClick={goHome}>← Back</button>
          <h3>Quiz Master</h3>
          <span>{score}</span>
        </div>
        <div className="game-canvas-container">
          <div style={{ textAlign: 'center', padding: '40px', fontSize: '1.5em' }}>
            <div style={{ marginBottom: '20px' }}>🎉 Quiz Complete!</div>
            <div style={{ fontSize: '2em', marginBottom: '20px', fontWeight: 'bold' }}>Final Score: {score}/{QUESTIONS.length * 10}</div>
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
        <h3>Quiz Master</h3>
        <span>{current + 1}/{QUESTIONS.length}</span>
      </div>
      <div className="game-canvas-container">
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
      </div>
    </div>
  );
}

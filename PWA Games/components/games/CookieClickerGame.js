import { useState } from 'react';

export default function CookieClickerGame({ goHome }) {
  const [cookies, setCookies] = useState(0);

  const handleClick = () => {
    const newCookies = cookies + 1;
    setCookies(newCookies);
    localStorage.setItem('clicker_score', newCookies);
  };

  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>Cookie Clicker</h3>
        <span>{cookies} Cookies</span>
      </div>
      <div className="game-canvas-container">
        <button
          onClick={handleClick}
          style={{
            fontSize: '4em',
            padding: '40px',
            border: 'none',
            background: 'none',
            cursor: 'pointer',
          }}
        >
          🍪
        </button>
      </div>
    </div>
  );
}

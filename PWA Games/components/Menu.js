export default function Menu({ isOpen, onClose, goHome, toggleSound, showScores, toggleTheme, soundEnabled }) {
  return (
    <>
      {isOpen && (
        <div className="menu-overlay" onClick={onClose} aria-hidden="true"></div>
      )}
      <div
        className={`menu-panel ${isOpen ? 'active' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-label="Game menu"
      >
        <div className="menu-header">
          <h2>🎮 GameVerse</h2>
          <button className="close-btn" onClick={onClose} type="button" aria-label="Close menu">×</button>
        </div>
        <div className="menu-content">
          <button className="menu-btn" onClick={goHome} type="button">🏠 Home</button>
          <button className="menu-btn" onClick={toggleSound} type="button" aria-pressed={soundEnabled}>
            {soundEnabled ? '🔊' : '🔇'} Sound
          </button>
          <button className="menu-btn" onClick={showScores} type="button">🏆 High Scores</button>
          <button className="menu-btn" onClick={toggleTheme} type="button">🌙 Theme</button>
        </div>
      </div>
    </>
  );
}

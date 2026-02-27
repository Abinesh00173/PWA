export default function Menu({ isOpen, onClose, goHome, toggleSound, showScores, toggleTheme, soundEnabled, navigateTo }) {
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
          <h2>
            <span className="material-symbols-outlined">rocket_launch</span>
            NEXUS
          </h2>
          <button className="close-btn" onClick={onClose} type="button" aria-label="Close menu">×</button>
        </div>
        <div className="menu-content">
          <button className="menu-btn" onClick={goHome} type="button">
            <span className="material-symbols-outlined">home</span>
            Home
          </button>
          <button className="menu-btn" onClick={() => { navigateTo && navigateTo('community'); onClose(); }} type="button">
            <span className="material-symbols-outlined">forum</span>
            Community
          </button>
          <button className="menu-btn" onClick={toggleSound} type="button" aria-pressed={soundEnabled}>
            <span className="material-symbols-outlined">{soundEnabled ? 'volume_up' : 'volume_off'}</span>
            Sound {soundEnabled ? 'On' : 'Off'}
          </button>
          <button className="menu-btn" onClick={showScores} type="button">
            <span className="material-symbols-outlined">emoji_events</span>
            High Scores
          </button>
          <button className="menu-btn" onClick={toggleTheme} type="button">
            <span className="material-symbols-outlined">dark_mode</span>
            Theme
          </button>
        </div>
      </div>
    </>
  );
}

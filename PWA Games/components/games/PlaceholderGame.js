export default function PlaceholderGame({ name, goHome }) {
  return (
    <div className="screen">
      <div className="game-header">
        <button className="back-btn" onClick={goHome}>← Back</button>
        <h3>{name}</h3>
        <span>0</span>
      </div>
      <div className="game-canvas-container">
        <div style={{ padding: '50px', textAlign: 'center', fontSize: '1.5em', color: 'var(--text)' }}>
          {name} - Coming Soon!
          <div style={{ marginTop: '20px', fontSize: '0.8em', opacity: 0.7 }}>
            This game is being developed
          </div>
        </div>
      </div>
    </div>
  );
}

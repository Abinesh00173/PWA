export function GameOverlay({ isDesktop, variant = 'default', children }) {
  const overlayStyle = {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    background:
      variant === 'start'
        ? 'radial-gradient(ellipse at center, rgba(15, 10, 31, 0.92) 0%, rgba(0, 0, 0, 0.97) 100%)'
        : 'radial-gradient(ellipse at center, rgba(15, 10, 31, 0.95) 0%, rgba(0, 0, 0, 0.98) 100%)',
    backdropFilter: 'blur(8px)',
    padding: isDesktop ? '16px' : '8px',
    boxSizing: 'border-box',
  };

  return <div style={overlayStyle}>{children}</div>;
}

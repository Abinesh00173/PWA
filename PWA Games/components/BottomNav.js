export default function BottomNav({ navigateTo, currentView }) {
  const navItems = [
    { id: 'home', icon: 'home', label: 'HOME' },
    { id: 'library', icon: 'sports_esports', label: 'LIBRARY' },
    { id: 'store', icon: 'storefront', label: 'STORE' },
    { id: 'profile', icon: 'account_circle', label: 'PROFILE' },
  ];

  return (
    <nav className="bottom-nav" aria-label="Mobile navigation">
      {navItems.map((item) => (
        <button
          key={item.id}
          className={`bottom-nav-item ${currentView === item.id ? 'active' : ''}`}
          onClick={() => navigateTo && navigateTo(item.id)}
          type="button"
          aria-label={item.label}
        >
          <span className="material-symbols-outlined">{item.icon}</span>
          <span className="bottom-nav-label">{item.label}</span>
        </button>
      ))}
    </nav>
  );
}

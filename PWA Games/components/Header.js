import { useState } from 'react';

export default function Header({ title, onMenuClick, isHome, navigateTo, currentView }) {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <header className="header" role="banner">
      {/* Left Section - Menu & Logo */}
      <div className="header-left">
        <button className="menu-toggle" onClick={onMenuClick} type="button" aria-label="Open menu">
          <span className="material-symbols-outlined">menu</span>
        </button>
        <div className="header-logo" onClick={() => navigateTo && navigateTo('home')} style={{ cursor: 'pointer' }}>
          <span className="material-symbols-outlined logo-icon">rocket_launch</span>
          <span className="logo-text">Nexus</span>
        </div>
        <nav className="header-nav">
          <button 
            className={`nav-link ${currentView === 'home' ? 'active' : ''}`}
            onClick={() => navigateTo && navigateTo('home')}
          >
            Home
          </button>
          <button 
            className={`nav-link ${currentView === 'library' ? 'active' : ''}`}
            onClick={() => navigateTo && navigateTo('home')}
          >
            Library
          </button>
          <button 
            className={`nav-link ${currentView === 'store' ? 'active' : ''}`}
            onClick={() => navigateTo && navigateTo('home')}
          >
            Store
          </button>
          <button 
            className={`nav-link ${currentView === 'community' ? 'active' : ''}`}
            onClick={() => navigateTo && navigateTo('community')}
          >
            Community
          </button>
        </nav>
      </div>

      {/* Center Section - Search */}
      <div className="header-search">
        <span className="material-symbols-outlined search-icon">search</span>
        <input
          type="text"
          className="search-input"
          placeholder="Search games, players, or groups..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          aria-label="Search"
        />
      </div>

      {/* Right Section - Actions & Profile */}
      <div className="header-right">
        <button className="header-icon-btn mobile-search-btn" type="button" aria-label="Search">
          <span className="material-symbols-outlined">search</span>
        </button>
        <button className="header-icon-btn" type="button" aria-label="Notifications">
          <span className="material-symbols-outlined">notifications</span>
          <span className="notification-dot"></span>
        </button>
        <button className="header-icon-btn desktop-only" type="button" aria-label="Messages">
          <span className="material-symbols-outlined">chat_bubble</span>
        </button>
        <div className="header-divider"></div>
        
        {/* Enhanced User Profile */}
        <div className="user-profile-enhanced">
          <div className="user-stats">
            <div className="user-xp-bar">
              <div className="user-xp-fill" style={{ width: '68%' }}></div>
            </div>
          </div>
          <div className="user-info-enhanced">
            <span className="user-name-enhanced">Alex_Vortex</span>
            <div className="user-level-badge">
              <span className="material-symbols-outlined">military_tech</span>
              <span>LVL 42</span>
            </div>
          </div>
          <div className="user-avatar-enhanced">
            <span className="material-symbols-outlined">person</span>
          </div>
        </div>
      </div>
    </header>
  );
}

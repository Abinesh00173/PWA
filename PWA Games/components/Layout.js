import Header from './Header';
import BottomNav from './BottomNav';

export default function Layout({ title, onMenuClick, children, isHome, navigateTo, currentView }) {
  return (
    <div className="app-layout">
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Header title={title} onMenuClick={onMenuClick} isHome={isHome} navigateTo={navigateTo} currentView={currentView} />
      <main className="app-main" role="main" id="main-content" tabIndex="-1">
        {children}
      </main>
      <BottomNav navigateTo={navigateTo} currentView={currentView} />
    </div>
  );
}

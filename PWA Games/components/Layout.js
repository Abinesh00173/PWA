import Header from './Header';
import Footer from './Footer';

export default function Layout({ title, onMenuClick, children }) {
  return (
    <div className="app-layout">
      <Header title={title} onMenuClick={onMenuClick} />
      <main className="app-main" role="main">
        {children}
      </main>
      <Footer />
    </div>
  );
}

import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Schedule from './Schedule';
import Profile from './Profile';
import BottomNav from '@/components/BottomNav';

export default function Index() {
  const [currentPage, setCurrentPage] = useState<string>('login');

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} />;
      case 'register':
        return <Register onNavigate={handleNavigate} />;
      case 'home':
        return <Home onNavigate={handleNavigate} />;
      case 'schedule':
        return <Schedule onNavigate={handleNavigate} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} />;
      default:
        return <Login onNavigate={handleNavigate} />;
    }
  };

  const showBottomNav = ['home', 'schedule', 'profile'].includes(currentPage);

  return (
    <div className="relative">
      {renderPage()}
      {showBottomNav && <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />}
    </div>
  );
}

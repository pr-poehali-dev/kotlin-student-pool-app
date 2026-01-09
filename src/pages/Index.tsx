import { useState } from 'react';
import Login from './Login';
import Register from './Register';
import Home from './Home';
import Schedule from './Schedule';
import Profile from './Profile';
import BottomNav from '@/components/BottomNav';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
}

export default function Index() {
  const [currentPage, setCurrentPage] = useState<string>('login');
  const [user, setUser] = useState<User | null>(null);

  const handleNavigate = (page: string) => {
    setCurrentPage(page);
  };

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('home');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'login':
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
      case 'register':
        return <Register onNavigate={handleNavigate} onRegister={handleLogin} />;
      case 'home':
        return <Home onNavigate={handleNavigate} user={user} />;
      case 'schedule':
        return <Schedule onNavigate={handleNavigate} user={user} />;
      case 'profile':
        return <Profile onNavigate={handleNavigate} user={user} onLogout={handleLogout} />;
      default:
        return <Login onNavigate={handleNavigate} onLogin={handleLogin} />;
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

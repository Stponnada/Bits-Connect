
import React from 'react';
import { useApp } from '../../context/AppContext';
import { Navbar } from './Navbar';
import { HomePage } from '../pages/HomePage';
import { ChatPage } from '../pages/ChatPage';
import { ProfilePage } from '../pages/ProfilePage';

export const Layout: React.FC = () => {
  const { currentPage } = useApp();

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage />;
      case 'chat':
        return <ChatPage />;
      case 'profile':
      case 'userProfile':
        return <ProfilePage />;
      default:
        return <HomePage />;
    }
  };

  return (
    <div className="min-h-screen bg-bits-dark text-bits-text">
      <Navbar />
      <main className="pt-16">
        {renderPage()}
      </main>
    </div>
  );
};

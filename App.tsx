
import React from 'react';
import { useApp } from './context/AppContext';
import { AuthPage } from './components/auth/AuthPage';
import { Layout } from './components/core/Layout';
import { ProfileSetup } from './components/onboarding/ProfileSetup';

const AppContent: React.FC = () => {
    const { currentUser } = useApp();

    if (!currentUser) {
        return <AuthPage />;
    }

    // Check if profile is complete (required fields)
    if (!currentUser.profile.name || !currentUser.profile.admissionYear) {
         return <ProfileSetup />;
    }

    return <Layout />;
}


const App: React.FC = () => {
  return (
      <AppContent />
  );
};

export default App;

import React, { useState, useEffect } from 'react';
import { useAuth } from './hooks/useAuth';
import { getUserProfile, UserProfile } from './services/firestoreService';
import AuthPage from './components/AuthPage';
import PersonalizationForm from './components/PersonalizationForm';
import ChatInterface from './components/ChatInterface';

function App() {
  const { user, loading } = useAuth();
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  useEffect(() => {
    if (user) {
      loadUserProfile();
    } else {
      setUserProfile(null);
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    
    setProfileLoading(true);
    try {
      const profile = await getUserProfile(user.uid);
      setUserProfile(profile);
    } catch (error) {
      console.error('Error loading user profile:', error);
      // If there's an error loading profile, treat as no profile exists
      setUserProfile(null);
    } finally {
      setProfileLoading(false);
    }
  };

  const handleProfileComplete = (profile: Omit<UserProfile, 'createdAt'>) => {
    setUserProfile({ ...profile, createdAt: { toDate: () => new Date() } } as UserProfile);
  };

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-100 dark:from-gray-900 dark:via-purple-900 dark:to-indigo-900 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-pink-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-600 dark:text-gray-300 font-medium">Loading your love story... 💕</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <AuthPage />;
  }

  // Always show personalization form if no profile exists, regardless of auth method
  if (!userProfile) {
    return <PersonalizationForm onComplete={handleProfileComplete} />;
  }

  return <ChatInterface userProfile={userProfile} />;
}

export default App;
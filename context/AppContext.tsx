import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Post, ChatMessage, Page } from '../types';
import { mockUsers, mockPosts, mockMessages } from '../data/mockData';

// Helper function to get initial state from localStorage
const getInitialState = <T,>(key: string, defaultValue: T): T => {
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key "${key}":`, error);
    return defaultValue;
  }
};

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  users: User[];
  setUsers: React.Dispatch<React.SetStateAction<User[]>>;
  posts: Post[];
  setPosts: React.Dispatch<React.SetStateAction<Post[]>>;
  messages: ChatMessage[];
  setMessages: React.Dispatch<React.SetStateAction<ChatMessage[]>>;
  currentPage: Page;
  setCurrentPage: (page: Page, options?: { isNavFromLogo?: boolean }) => void;
  activeChatUserId: string | null;
  setActiveChatUserId: (userId: string | null) => void;
  findUserById: (id: string) => User | undefined;
  viewedProfileId: string | null;
  setViewedProfileId: (id: string | null) => void;
  featuredPostId: string | null;
  setFeaturedPostId: React.Dispatch<React.SetStateAction<string | null>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => getInitialState<User | null>('bitsconnect_currentUser', null));
  const [users, setUsers] = useState<User[]>(() => getInitialState<User[]>('bitsconnect_users', mockUsers));
  const [posts, setPosts] = useState<Post[]>(() => getInitialState<Post[]>('bitsconnect_posts', mockPosts));
  const [messages, setMessages] = useState<ChatMessage[]>(() => getInitialState<ChatMessage[]>('bitsconnect_messages', mockMessages));
  const [currentPage, _setCurrentPage] = useState<Page>('home');
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [viewedProfileId, setViewedProfileId] = useState<string | null>(null);
  const [featuredPostId, setFeaturedPostId] = useState<string | null>(null);

  // useEffect hooks to persist state to localStorage
  useEffect(() => {
    try {
      window.localStorage.setItem('bitsconnect_currentUser', JSON.stringify(currentUser));
    } catch (error) {
      console.error('Error saving currentUser to localStorage', error);
    }
  }, [currentUser]);

  useEffect(() => {
    try {
      window.localStorage.setItem('bitsconnect_users', JSON.stringify(users));
    } catch (error) {
      console.error('Error saving users to localStorage', error);
    }
  }, [users]);

  useEffect(() => {
    try {
      // Note: Object URLs for media will not persist across sessions.
      window.localStorage.setItem('bitsconnect_posts', JSON.stringify(posts));
    } catch (error) {
      console.error('Error saving posts to localStorage', error);
    }
  }, [posts]);

  useEffect(() => {
    try {
      window.localStorage.setItem('bitsconnect_messages', JSON.stringify(messages));
    } catch (error) {
      console.error('Error saving messages to localStorage', error);
    }
  }, [messages]);


  const findUserById = (id: string) => users.find(u => u.id === id);

  const setCurrentPage = (page: Page, options: { isNavFromLogo?: boolean } = {}) => {
    if (page === 'profile') {
      setViewedProfileId(null);
    }
    // If navigating away from home OR clicking the logo to go home, clear the featured post.
    if (page !== 'home' || options.isNavFromLogo) {
      setFeaturedPostId(null);
    }
    _setCurrentPage(page);
  };

  const value = {
    currentUser,
    setCurrentUser,
    users,
    setUsers,
    posts,
    setPosts,
    messages,
    setMessages,
    currentPage,
    setCurrentPage,
    activeChatUserId,
    setActiveChatUserId,
    findUserById,
    viewedProfileId,
    setViewedProfileId,
    featuredPostId,
    setFeaturedPostId,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = (): AppContextType => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
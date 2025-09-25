import React, { createContext, useState, useContext, ReactNode, useEffect } from 'react';
import { User, Post, ChatMessage, Page, PostMedia, MediaType } from '../types';
import { supabase } from '../supabaseClient'; // your client
import { fetchPosts } from '../supa/supabaseHelpers';

interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
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
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [currentPage, _setCurrentPage] = useState<Page>('home');
  const [activeChatUserId, setActiveChatUserId] = useState<string | null>(null);
  const [viewedProfileId, setViewedProfileId] = useState<string | null>(null);
  const [featuredPostId, setFeaturedPostId] = useState<string | null>(null);

  // Fetch posts from Supabase on mount
  useEffect(() => {
    const fetchPosts = async () => {
      const postsFromDB = await fetchPosts();
      setPosts(postsFromDB);
    };
    fetchPosts();
  }, []);

  const findUserById = (id: string) => {
    // Optional: fetch user from Supabase if needed
    return null; // placeholder; can implement getUserById in supabaseHelpers
  };

  const setCurrentPage = (page: Page, options: { isNavFromLogo?: boolean } = {}) => {
    if (page === 'profile') {
      setViewedProfileId(null);
    }
    if (page !== 'home' || options.isNavFromLogo) {
      setFeaturedPostId(null);
    }
    _setCurrentPage(page);
  };

  const value: AppContextType = {
    currentUser,
    setCurrentUser,
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

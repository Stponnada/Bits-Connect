import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { ChatIcon, UserIcon, SearchIcon, LogoutIcon } from '../icons';
import { User, Post } from '../../types';

export const Navbar: React.FC = () => {
  const { 
    currentPage, 
    setCurrentPage, 
    currentUser, 
    setCurrentUser, 
    users, 
    posts,
    setViewedProfileId,
    findUserById,
    setFeaturedPostId,
  } = useApp();
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<{ users: User[]; posts: Post[] }>({ users: [], posts: [] });
  const [isSearchActive, setIsSearchActive] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);


  useEffect(() => {
    if (searchQuery.trim() === '') {
      setSearchResults({ users: [], posts: [] });
      return;
    }

    const lowercasedQuery = searchQuery.toLowerCase();
    const filteredUsers = users.filter(user =>
      user.profile.name.toLowerCase().includes(lowercasedQuery) ||
      user.username.toLowerCase().includes(lowercasedQuery)
    );
    const filteredPosts = posts.filter(post =>
      post.content?.toLowerCase().includes(lowercasedQuery)
    );
    setSearchResults({ users: filteredUsers, posts: filteredPosts });
  }, [searchQuery, users, posts]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsSearchActive(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    setCurrentUser(null);
    setDropdownOpen(false);
  }
  
  const handleUserClick = (userId: string) => {
    setViewedProfileId(userId);
    setCurrentPage('userProfile');
    setSearchQuery('');
    setIsSearchActive(false);
  };
  
  const handlePostClick = (postId: string) => {
    setFeaturedPostId(postId);
    setCurrentPage('home');
    setSearchQuery('');
    setIsSearchActive(false);
  };

  const navItems = [
    { name: 'chat', icon: <ChatIcon /> },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 bg-bits-light-dark/80 backdrop-blur-sm border-b border-bits-medium-dark z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <button 
                onClick={() => setCurrentPage('home', { isNavFromLogo: true })} 
                className="text-bits-red font-bold text-2xl transition-opacity hover:opacity-80"
                aria-label="Go to homepage"
              >
                BITS Connect
              </button>
            </div>
          </div>
          <div className="flex-1 flex justify-center px-2 lg:ml-6 lg:justify-center">
            <div ref={searchRef} className="max-w-lg w-full lg:max-w-xs relative">
              <label htmlFor="search" className="sr-only">Search</label>
              <div className="relative text-bits-text-muted focus-within:text-bits-text">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5" />
                </div>
                <input
                  id="search"
                  className="block w-full bg-bits-medium-dark py-2 pl-10 pr-3 border border-transparent rounded-md leading-5 text-bits-text placeholder-bits-text-muted focus:outline-none focus:bg-bits-dark focus:border-bits-red focus:ring-bits-red sm:text-sm"
                  placeholder="Search users or posts"
                  type="search"
                  name="search"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => setIsSearchActive(true)}
                  autoComplete="off"
                />
              </div>
              {isSearchActive && searchQuery && (
                <div className="absolute mt-2 w-full rounded-md shadow-lg bg-bits-light-dark ring-1 ring-black ring-opacity-5 max-h-96 overflow-y-auto">
                  <div className="py-1" role="menu" aria-orientation="vertical" aria-labelledby="options-menu">
                    {searchResults.users.length === 0 && searchResults.posts.length === 0 ? (
                        <div className="px-4 py-2 text-sm text-bits-text-muted">No results found.</div>
                    ) : (
                      <>
                        {searchResults.users.length > 0 && <div className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-bits-red">Users</div>}
                        {searchResults.users.map(user => (
                          <a key={user.id} href="#" onClick={(e) => { e.preventDefault(); handleUserClick(user.id); }} className="flex items-center px-4 py-2 text-sm text-bits-text hover:bg-bits-medium-dark" role="menuitem">
                            <img src={user.profile.avatar} alt={user.profile.name} className="w-8 h-8 rounded-full mr-3"/>
                            <div>
                                <div>{user.profile.name}</div>
                                <div className="text-xs text-bits-text-muted">@{user.username}</div>
                            </div>
                          </a>
                        ))}
                        {searchResults.posts.length > 0 && <div className="px-4 pt-2 pb-1 text-xs font-bold uppercase text-bits-red border-t border-bits-medium-dark mt-1">Posts</div>}
                        {searchResults.posts.map(post => {
                           const author = findUserById(post.authorId);
                           return (
                             <a href="#" key={post.id} onClick={(e) => { e.preventDefault(); handlePostClick(post.id); }} className="block px-4 py-2 text-sm text-bits-text hover:bg-bits-medium-dark" role="menuitem">
                               <div className="text-xs text-white mb-1">
                                 {author?.profile.name || 'Unknown'} <span className="text-bits-text-muted">@{author?.username}</span>
                               </div>
                               <p className="line-clamp-2">{post.content || (post.media ? '[Media Post]' : '')}</p>
                             </a>
                           );
                        })}
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              {navItems.map((item) => (
                <button
                  key={item.name}
                  onClick={() => setCurrentPage(item.name as any)}
                  className={`p-2 rounded-full transition-colors duration-200 ${currentPage === item.name ? 'text-bits-red bg-bits-red/10' : 'text-bits-text-muted hover:text-bits-text hover:bg-bits-medium-dark'}`}
                  aria-current={currentPage === item.name ? 'page' : undefined}
                >
                  {item.icon}
                </button>
              ))}
            </div>
            <div className="ml-4 relative">
              <div>
                <button onClick={() => setDropdownOpen(!isDropdownOpen)} type="button" className="max-w-xs bg-gray-800 rounded-full flex items-center text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-white" id="user-menu-button" aria-expanded="false" aria-haspopup="true">
                  <span className="sr-only">Open user menu</span>
                  <img className="h-8 w-8 rounded-full" src={currentUser?.profile.avatar} alt="" />
                </button>
              </div>
              {isDropdownOpen && (
                <div className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-bits-light-dark ring-1 ring-black ring-opacity-5 focus:outline-none" role="menu" aria-orientation="vertical" aria-labelledby="user-menu-button">
                  <a href="#" onClick={(e) => { e.preventDefault(); setCurrentPage('profile'); setDropdownOpen(false); }} className="flex items-center px-4 py-2 text-sm text-bits-text hover:bg-bits-medium-dark" role="menuitem">
                    <UserIcon className="w-5 h-5 mr-2"/> Your Profile
                  </a>
                  <a href="#" onClick={(e) => { e.preventDefault(); handleLogout(); }} className="flex items-center px-4 py-2 text-sm text-bits-text hover:bg-bits-medium-dark" role="menuitem">
                    <LogoutIcon className="w-5 h-5 mr-2"/> Sign out
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};
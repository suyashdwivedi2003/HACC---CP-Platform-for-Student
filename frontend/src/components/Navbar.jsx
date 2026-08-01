import { React, useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../stores/useAuthStore';
import { useChatStore } from '../stores/useChatStore';
import { notiPermissionOnce } from '../lib/utils';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { authUser, logout } = useAuthStore();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { unreadMessages, clearUnreadMessages } = useChatStore();
  const [showNavbar, setShowNavBar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const controlNavbar = () => {
    if(window.scrollY<=0){
      setShowNavBar(true);
    } else if(window.scrollY > lastScrollY){
      setShowNavBar(false);
    } else{
      setShowNavBar(true);
    }
    setLastScrollY(window.scrollY);
  }

  useEffect(() => {
    window.addEventListener('scroll', controlNavbar);
    return () => window.removeEventListener('scroll', controlNavbar);
  },[lastScrollY]);
  
  const handleLogOut = () => {
    logout(navigate);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
  };
  
  const handleNotificationClick = () => {
    clearUnreadMessages();
    navigate('/chat'); // Navigate to chat page when notification is clicked
    setMobileMenuOpen(false);
  };
  
  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (!e.target.closest('.profile-dropdown')) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-11 bg-black bg-opacity-70 py-4 px-6 transition-transform duration-300 ${showNavbar ? 'translate-y-0' : '-translate-y-100'}`}>
      <div className="container mx-auto px-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">
          <Link to="/" className="flex items-center">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">HACC</span>
          </Link>
        </h1>
        
        {/* Mobile Hamburger Button */}
        <button
          className="md:hidden flex items-center text-white"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            className="h-6 w-6" 
            fill="none" 
            viewBox="0 0 24 24" 
            stroke="currentColor"
          >
            {mobileMenuOpen ? (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M6 18L18 6M6 6l12 12" 
              />
            ) : (
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 6h16M4 12h16M4 18h16" 
              />
            )}
          </svg>
        </button>
        
        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6 items-center">
          <Link to="/" 
                className={`hover:text-blue-400 transition-colors ${isActive('/') ? 'text-blue-400' : 'text-white'}`}>
            Home
          </Link>
          <Link to="/contest-list" 
                className={`hover:text-blue-400 transition-colors ${isActive('/contest-list') ? 'text-blue-400' : 'text-white'}`}>
            Contests
          </Link>
          {authUser && (<Link to="/blogs" 
                className={`hover:text-blue-400 transition-colors ${isActive('/blogs') ? 'text-blue-400' : 'text-white'}`}>
            Blogs
          </Link>)}
          {authUser && (
            <Link to="/createBlog" 
                  className={`hover:text-blue-400 transition-colors ${isActive('/createBlog') ? 'text-blue-400' : 'text-white'}`}>
              CreateBlog
            </Link>
          )}
          {authUser && (
            <Link to="/rankings" 
                  className={`hover:text-blue-400 transition-colors ${isActive('/rankings') ? 'text-blue-400' : 'text-white'}`}>
              Rankings
            </Link>
          )}
          <Link to="/chat" 
                className={`hover:text-blue-400 transition-colors ${isActive('/chat') ? 'text-blue-400' : 'text-white'}`}>
            Community
          </Link>

          <button className="cursor-pointer hover:text-blue-400" onClick={notiPermissionOnce}>
          Notification
          </button>

          {authUser && <div className="relative cursor-pointer" onClick={handleNotificationClick}>
            {/* Bell Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
            
            {/* Notification Badge */}
            {unreadMessages > 0 && (
              <div className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {unreadMessages > 99 ? '99+' : unreadMessages}
              </div>
            )}
          </div>}

          {!authUser ? (
            <div className="flex space-x-2 ml-2">
              <Link to="/login" className="px-4 py-2 rounded-lg text-white hover:bg-gray-800 transition-colors">
                Login
              </Link>
              <Link to="/signup" className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative profile-dropdown">
              <div 
                className="w-10 h-10 rounded-full cursor-pointer border-2 border-blue-400 overflow-hidden flex items-center justify-center hover:border-blue-300 transition-colors"
                onClick={() => setDropdownOpen(!dropdownOpen)}
              >
                {authUser.photoURL ? (
                  <img
                    src={authUser.photoURL}
                    alt="Profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-lg font-bold">
                    {authUser.displayName ? authUser.displayName[0].toUpperCase() : 'U'}
                  </div>
                )}
              </div>
              
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-lg z-10 overflow-hidden">
                  <div className="p-3 border-b border-gray-700">
                    <p className="text-sm font-medium text-white truncate">
                      {authUser.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {authUser.email || ''}
                    </p>
                  </div>
                  <div className="py-1">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                        <circle cx="12" cy="7" r="4"></circle>
                      </svg>
                      Profile
                    </Link>
                    <Link
                      to="/setting"
                      className="flex items-center px-4 py-2 text-sm text-white hover:bg-blue-600 transition-colors"
                      onClick={() => setDropdownOpen(false)}
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="3"></circle>
                        <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                      </svg>
                      Settings
                    </Link>
                    <button
                      onClick={handleLogOut}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-white hover:bg-red-600 transition-colors"
                    >
                      <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                        <polyline points="16 17 21 12 16 7"></polyline>
                        <line x1="21" y1="12" x2="9" y2="12"></line>
                      </svg>
                      Logout
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      
      {/* Mobile Menu - Modified to take less screen space */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute right-0 top-full w-64 max-w-xs bg-black bg-opacity-95 border-t border-l border-gray-800 rounded-bl-lg py-4 shadow-lg">
          <div className="flex flex-col space-y-3 px-4">
            <Link to="/" 
                  className={`py-1 hover:text-blue-400 transition-colors ${isActive('/') ? 'text-blue-400' : 'text-white'}`}>
              Home
            </Link>
            <Link to="/contest-list" 
                  className={`py-1 hover:text-blue-400 transition-colors ${isActive('/contest-list') ? 'text-blue-400' : 'text-white'}`}>
              Contests
            </Link>
            {authUser && (<Link to="/blogs" 
                  className={`py-1 hover:text-blue-400 transition-colors ${isActive('/blogs') ? 'text-blue-400' : 'text-white'}`}>
              Blogs
            </Link>)}
            {authUser && (
              <Link to="/createBlog" 
                    className={`py-1 hover:text-blue-400 transition-colors ${isActive('/createBlog') ? 'text-blue-400' : 'text-white'}`}>
                CreateBlog
              </Link>
            )}
            {authUser && (
              <Link to="/rankings" 
                    className={`py-1 hover:text-blue-400 transition-colors ${isActive('/rankings') ? 'text-blue-400' : 'text-white'}`}>
                Rankings
              </Link>
            )}
            <Link to="/chat" 
                  className={`py-1 hover:text-blue-400 transition-colors ${isActive('/chat') ? 'text-blue-400' : 'text-white'}`}>
              Community
            </Link>
            <button className="py-1 text-left cursor-pointer hover:text-blue-400 transition-colors" onClick={notiPermissionOnce}>
              Notification
            </button>
            
            {authUser && (
              <div className="flex items-center space-x-2 py-1">
                <div className="relative cursor-pointer" onClick={handleNotificationClick}>
                  {/* Bell Icon */}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                  </svg>
                  
                  {/* Notification Badge */}
                  {unreadMessages > 0 && (
                    <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
                      {unreadMessages > 99 ? '99+' : unreadMessages}
                    </div>
                  )}
                </div>
                <span className="text-white text-sm">Notifications</span>
              </div>
            )}
            
            {authUser ? (
              <>
                <div className="flex items-center space-x-2 py-1 border-t border-gray-800 mt-1 pt-2">
                  <div className="w-6 h-6 rounded-full border border-blue-400 overflow-hidden flex items-center justify-center">
                    {authUser.photoURL ? (
                      <img
                        src={authUser.photoURL}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-tr from-blue-600 to-purple-600 flex items-center justify-center text-xs font-bold">
                        {authUser.displayName ? authUser.displayName[0].toUpperCase() : 'U'}
                      </div>
                    )}
                  </div>
                  <div className="text-xs">
                    <p className="font-medium text-white truncate">
                      {authUser.displayName || 'User'}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {authUser.email || ''}
                    </p>
                  </div>
                </div>
                <Link
                  to="/profile"
                  className="py-1 hover:text-blue-400 transition-colors flex items-center text-sm"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                    <circle cx="12" cy="7" r="4"></circle>
                  </svg>
                  Profile
                </Link>
                <Link
                  to="/setting"
                  className="py-1 hover:text-blue-400 transition-colors flex items-center text-sm"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="3"></circle>
                    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
                  </svg>
                  Settings
                </Link>
                <button
                  onClick={handleLogOut}
                  className="py-1 text-left text-white hover:text-red-400 transition-colors flex items-center text-sm"
                >
                  <svg className="w-3 h-3 mr-2" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                    <polyline points="16 17 21 12 16 7"></polyline>
                    <line x1="21" y1="12" x2="9" y2="12"></line>
                  </svg>
                  Logout
                </button>
              </>
            ) : (
              <div className="flex flex-col space-y-2 py-1 border-t border-gray-800 mt-1 pt-2">
                <Link to="/login" className="px-3 py-1 rounded text-white hover:bg-gray-800 transition-colors text-center text-sm">
                  Login
                </Link>
                <Link to="/signup" className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded transition-colors text-center text-sm">
                  Sign Up
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
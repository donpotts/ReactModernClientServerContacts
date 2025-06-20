import React from 'react';

function Navbar({ currentPage, isAuthenticated, onGoToLogin, onLogout, onToggleSideNav, onGoToHome }) {
  return (
    <nav className="fixed top-0 left-0 right-0 z-10 bg-gray-800 bg-opacity-90 backdrop-blur-sm shadow-lg p-4 flex justify-between items-center text-white">
      <div className="flex items-center">
        {isAuthenticated && (currentPage === 'home' || currentPage === 'grid' || currentPage === 'contacts' || currentPage === 'success') && (
          <button
            onClick={onToggleSideNav}
            className="mr-4 text-gray-400 hover:text-white transition-colors duration-200"
            aria-label="Open menu"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="24"
              height="24"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
        )}
        <button
          onClick={onGoToHome}
          className="text-2xl font-bold tracking-wide text-indigo-300 focus:outline-none"
          aria-label="Go to Home Page"
        >
          My Modern App
        </button>
      </div>
      <div>
        {!isAuthenticated ? (
          currentPage !== 'login' && (
            <button
              onClick={onGoToLogin}
              className="px-5 py-2 bg-indigo-600 rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform active:scale-95"
            >
              Login
            </button>
          )
        ) : (
          <button
            onClick={onLogout}
            className="px-5 py-2 bg-red-500 rounded-lg font-semibold shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200 transform active:scale-95"
          >
            Logout
          </button>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
// src/components/SideNav.jsx
import React from 'react';

function SideNav({ isOpen, onClose, onNavigateToGridContent, onNavigateToContactContent }) {
  const handleGridClick = () => {
    onNavigateToGridContent();
    onClose();
  };

  const handleContactsClick = () => {
    onNavigateToContactContent({ contentType: 'contacts' });
    onClose();
  };

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-20 transition-opacity duration-300 ease-in-out"
          onClick={onClose}
        ></div>
      )}

      <div
        className={`fixed top-0 left-0 h-full w-64 bg-gray-900 shadow-xl z-30 transform transition-transform duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="p-6 text-white">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold text-indigo-300">Menu</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors duration-200"
              aria-label="Close menu"
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
                <line x1="18" y1="6" x2="6" y2="18"></line>
                <line x1="6" y1="6" x2="18" y2="18"></line>
              </svg>
            </button>
          </div>
          <nav className="space-y-4">
            <button
              onClick={handleGridClick}
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded-lg w-full text-left transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07L9.5 9.5a3 3 0 0 0 4.24 4.24l1.41-1.41"></path>
                <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07L14.5 14.5a3 3 0 0 0-4.24-4.24l-1.41 1.41"></path>
              </svg>
              View Grid Items
            </button>
            <button
              onClick={handleContactsClick}
              className="flex items-center text-gray-300 hover:text-white hover:bg-gray-700 p-3 rounded-lg w-full text-left transition-colors duration-200"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="mr-3"
              >
                <path d="M22 16.92v3a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-3"></path>
                <path d="m12 15-4-4 4-4"></path>
                <path d="M16 5h-6a2 2 0 0 0-2 2v3"></path>
              </svg>
              View Contacts
            </button>
          </nav>
        </div>
      </div>
    </>
  );
}

export default SideNav;
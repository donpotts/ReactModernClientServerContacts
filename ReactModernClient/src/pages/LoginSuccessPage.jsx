// src/pages/LoginSuccessPage.jsx
import React from 'react';

function LoginSuccessPage({ onOpenSideNavAndNavigate }) {
  return (
    <div className="pt-24 bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full text-center flex flex-col items-center justify-center animate-fade-in">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="48"
        height="48"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="text-emerald-500 mb-4 transform scale-125 transition-transform duration-300 ease-in-out"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
      </svg>
      <h2 className="text-3xl font-extrabold text-gray-800 mb-3">Login Successful!</h2>
      <p className="text-gray-600 mb-6">Welcome to your personalized dashboard.</p>
      <button
        onClick={onOpenSideNavAndNavigate}
        className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg font-semibold text-lg shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 transform active:scale-95"
      >
        OK
      </button>
    </div>
  );
}

export default LoginSuccessPage;

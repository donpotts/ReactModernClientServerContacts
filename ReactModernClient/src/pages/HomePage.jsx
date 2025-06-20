// src/pages/HomePage.jsx
import React from 'react';
import ContentCard from '../components/ContentCard.jsx'; // Import ContentCard

function HomePage({ onGoToLogin }) {
  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-4">Discover Our Features</h2>
        <p className="text-lg text-indigo-100">Explore what our powerful application can do for you.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <ContentCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1z"></path><line x1="4" y1="22" x2="4" y2="15"></line></svg>}
          title="Intuitive Design"
          description="Enjoy a sleek and user-friendly interface designed for optimal experience."
        />
        <ContentCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect><path d="M17 2L12 7L7 2"></path></svg>}
          title="Powerful Features"
          description="Unlock a suite of advanced tools tailored to boost your productivity."
        />
        <ContentCard
          icon={<svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"></path><line x1="12" y1="17" x2="12.01" y2="17"></line></svg>}
          title="Dedicated Support"
          description="Our team is here to assist you with any questions or challenges you face."
        />
      </div>
       <div className="mt-12 text-center">
        <button
          onClick={onGoToLogin}
          className="px-8 py-4 bg-purple-700 text-white rounded-lg font-semibold text-xl shadow-xl hover:bg-purple-800 focus:outline-none focus:ring-4 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-300 transform active:scale-95"
        >
          Get Started Now!
        </button>
      </div>
    </div>
  );
}

export default HomePage;
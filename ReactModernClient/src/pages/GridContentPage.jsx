// src/pages/GridContentPage.jsx
import React from 'react';

// Assuming GRID_DATA is now imported from a central data file or passed as a prop
// For this example, let's keep it hardcoded for simplicity, but ideally it would be imported.
const GRID_DATA = [
    { id: 1, name: "Product A", description: "High-quality product with excellent features.", image: "https://placehold.co/100x100/A78BFA/ffffff?text=ProdA" },
    { id: 2, name: "Service B", description: "Reliable and efficient service tailored for your needs.", image: "https://placehold.co/100x100/60A5FA/ffffff?text=ServB" },
    { id: 3, name: "Solution C", description: "Innovative solution to complex problems.", image: "https://placehold.co/100x100/34D399/ffffff?text=SoluC" },
    { id: 4, name: "Item D", description: "Durable and stylish, a perfect addition.", image: "https://placehold.co/100x100/FACC15/ffffff?text=ItemD" },
    { id: 5, name: "Gadget E", description: "Cutting-edge technology for modern living.", image: "https://placehold.co/100x100/FB923C/ffffff?text=GadgE" },
    { id: 6, name: "Software F", description: "Boost your productivity with our intuitive software.", image: "https://placehold.co/100x100/EF4444/ffffff?text=SoftF" },
];

function GridContentPage() {
  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-4">Explore Our Collection</h2>
        <p className="text-lg text-indigo-100">A showcase of various items available.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {GRID_DATA.map(item => (
          <div key={item.id} className="bg-white rounded-2xl shadow-lg p-4 flex flex-col items-center text-center transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <img
              src={item.image}
              alt={item.name}
              className="w-24 h-24 rounded-full object-cover mb-4 shadow-md"
              onError={(e) => { e.target.onerror = null; e.target.src = `https://placehold.co/100x100/CCCCCC/000000?text=Error`; }}
            />
            <h3 className="text-xl font-bold text-gray-800 mb-2">{item.name}</h3>
            <p className="text-gray-600 text-sm">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default GridContentPage;
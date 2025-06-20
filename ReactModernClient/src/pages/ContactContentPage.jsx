// src/pages/ContactPage.jsx
import React, { useState, useEffect } from 'react';
import { getContacts } from '../api/auth.js';

function ContactContentPage({ authToken, onGoToHome }) {
  const [contactsData, setContactsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (authToken) {
      fetchContacts();
    } else {
      setError("Please log in to view contacts.");
      setContactsData([]);
    }
  }, [authToken]);

  const fetchContacts = async () => {
    setLoading(true);
    setError(null);
    const result = await getContacts(authToken);

    if (result.success) {
      setContactsData(result.data);
      console.log("Contacts fetched successfully:", result.data);
    } else {
      setError(result.message);
      console.error("Failed to fetch contacts:", result.message);
      setContactsData([]);
    }
    setLoading(false);
  };

  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in">
      <div className="text-center mb-10">
        <h2 className="text-4xl font-extrabold text-white mb-4">Your Contacts</h2>
        <p className="text-lg text-indigo-100">Details from the secure API endpoint.</p>
        <button
          onClick={fetchContacts}
          className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200"
          disabled={loading || !authToken}
        >
          {loading ? 'Loading...' : 'Refresh Contacts'}
        </button>
      </div>

      {error && <p className="text-red-400 text-center mb-4">{error}</p>}

      {contactsData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {contactsData.map((contact, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-103 hover:shadow-xl">
              <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.name}</h3>
              <p className="text-gray-600 text-sm">Email: {contact.email}</p>
              <p className="text-gray-600 text-sm">Phone: {contact.phone}</p>
              {contact.address && <p className="text-gray-600 text-sm">Address: {contact.address}</p>}
            </div>
          ))}
        </div>
      ) : (
        !loading && !error && authToken && (
          <p className="text-indigo-200 text-center mt-8">No contacts to display or data is loading.</p>
        )
      )}

      {!authToken && !loading && !error && (
        <div className="text-center mt-8">
          <button
            onClick={onGoToHome}
            className="text-sm text-gray-300 hover:text-white font-medium transition-colors duration-200"
          >
            Go to Home
          </button>
        </div>
      )}
    </div>
  );
}

export default ContactContentPage;

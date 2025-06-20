// src/pages/LoginPage.jsx
import React, { useState } from 'react';
import { loginUser } from '../api/auth';

function LoginPage({ onLoginSuccess, onGoToHome }) {
  const [username, setUsername] = useState('adminuser@example.com');
  const [password, setPassword] = useState('testUser123!');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const loginResult = await loginUser(username, password);

      if (loginResult.success && loginResult.token) {
        onLoginSuccess(loginResult.token);
      } else {
        setError(loginResult.message || 'Login failed. Please try again.');
      }

    } catch (err) {
      setError('Network error: ' + (err.message || 'Could not connect to the login server.'));
      console.error('Login form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full text-center">
      <h2 className="text-3xl font-extrabold text-gray-800 mb-6">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <input
            type="text"
            placeholder="adminuser@example.com"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>
        <div>
          <input
            type="password"
            placeholder="testUser123!"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-200"
            required
          />
        </div>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-3 rounded-lg font-semibold hover:bg-blue-700 transition duration-200"
          disabled={loading}
        >
          {loading ? 'Logging in...' : 'Login'}
        </button>
      </form>
      <button
        onClick={onGoToHome}
        className="mt-4 text-sm text-gray-600 hover:text-gray-800 transition duration-200"
        disabled={loading}
      >
        Back to Home
      </button>
    </div>
  );
}

export default LoginPage;
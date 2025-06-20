// src/api/auth.js

// IMPORTANT: Replace 'https://localhost:5026' with your actual backend base URL
const API_BASE_URL = 'https://localhost:5026';

export async function loginUser(email, password) {
  const RADENDPOINT_LOGIN_URL = `${API_BASE_URL}/identity/login`;

  try {
    const response = await fetch(RADENDPOINT_LOGIN_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      //console.log('API: Login successful. Token (if present):', data.accessToken);
      return {
        success: true,
        message: 'Login successful!',
        token: data.accessToken,
      };
    } else {
      const errorMessage = data.message || data.error || 'Login failed. Please check credentials.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during login call:', error);
    return {
      success: false,
      message: 'Network error. Could not connect to the login server. Ensure it is running and accessible.'
    };
  }
}

export async function validateToken(token) {
  const RADENDPOINT_VALIDATE_TOKEN_URL = `${API_BASE_URL}/identity/validate-token`;

  if (!token) {
    return { success: false, message: "No token provided for validation." };
  }

  try {
    const response = await fetch(RADENDPOINT_VALIDATE_TOKEN_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
      return { success: true };
    } else {
      const errorData = await response.json();
      return { success: false, message: errorData.message || `Token validation failed with status: ${response.status}` };
    }
  } catch (error) {
    console.error('API Error during token validation call:', error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the validation server.'}` };
  }
}

export async function getContacts(token) {
  const CONTACTS_API_URL = `${API_BASE_URL}/api/contacts`;
  console.log('API: Fetching contacts with token:', token ? 'Present' : 'Missing');

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CONTACTS_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (response.ok) {
      return { success: true, data: data };
    } else {
      const errorMessage = data.message || data.error || JSON.stringify(data) || 'Failed to fetch contacts.';
      return { success: false, message: `Failed to fetch contacts: ${errorMessage}` };
    }
  } catch (error) {
    console.error('API Error during contacts call:', error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the contacts server.'}` };
  }
}
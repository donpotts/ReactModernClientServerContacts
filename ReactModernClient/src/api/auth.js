// src/api/auth.js
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

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Login Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Login failed: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Login successful!',
        token: data?.accessToken,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Login failed. Please check credentials.';
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
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Token validation succeeded but response was not valid JSON: ${parseError.message}` };
            }
        } else {
            return { success: true, message: "Token validated successfully (empty response)." };
        }
    } else {
      let errorMessage = `Token validation failed with status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
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

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse contacts data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch contacts: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch contacts. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error('API Error during contacts call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contacts server.'}`
    };
  }
}

export async function registerUser(email, password) {
  const RADENDPOINT_REGISTER_URL = `${API_BASE_URL}/identity/register`;

  try {
    const response = await fetch(RADENDPOINT_REGISTER_URL, {
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

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Register User Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Registration failed: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Registration successful!',
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Registration failed.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during registration call:', error);
    return {
      success: false,
      message: 'Network error. Could not connect to the registration server. Ensure it is running and accessible.'
    };
  }
}

export async function createContact(authToken, contactData) {
  const CONTACTS_API_URL = `${API_BASE_URL}/api/contacts`;

  if (!authToken) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CONTACTS_API_URL, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authToken}`,
      },
      body: JSON.stringify(contactData),
    });

    if (response.status === 204) {
      return { success: true, message: 'Contact created successfully (no content returned).' };
    }

    let data = null;
    const responseText = await response.text();
    if (responseText) {
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Create Contact Response Parse Error:', parseError.message, responseText);
        return { success: false, message: `Failed to create contact: Invalid JSON response from server. (Parse Error: ${parseError.message})` };
      }
    }

    if (response.ok) {
      return {
        success: true,
        message: data?.message || 'Contact created successfully!',
        data: data,
      };
    } else {
      const errorMessage = data?.message || data?.error || 'Failed to create contact.';
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during create contact call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contact creation server.'}`
    };
  }
}

export async function updateContact(token, contactId, updatedContactData) {
  const CONTACT_UPDATE_URL = `${API_BASE_URL}/api/contacts/${contactId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  console.log('URL for PUT:', CONTACT_UPDATE_URL);
  console.log('Incoming updatedData (from form):', JSON.stringify(updatedContactData, null, 2));

  try {
    const getResult = await getContactById(token, contactId);

    if (!getResult.success) {
      return { success: false, message: `Failed to fetch existing contact for update: ${getResult.message}` };
    }
    const existingContact = getResult.data;

    const finalUpdatePayload = {
      ...existingContact,
      ...updatedContactData,
      id: contactId
    };

    console.log('Final Body being sent:', JSON.stringify(finalUpdatePayload, null, 2));
    const headers = {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
    console.log('Headers:', headers);

    const response = await fetch(CONTACT_UPDATE_URL, {
      method: 'PUT',
      headers: headers,
      body: JSON.stringify(finalUpdatePayload),
    });

    if (response.status === 204) {
      return { success: true, message: 'Contact updated successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Update Contact Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Contact updated but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Contact updated successfully!',
        data: data,
      };
    } else {
      let errorMessage = `Failed to update contact. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during update contact call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contact update server.'}`
    };
  }
}

export async function deleteContact(token, contactId) {
  const CONTACT_DELETE_URL = `${API_BASE_URL}/api/contacts/${contactId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }

  try {
    const response = await fetch(CONTACT_DELETE_URL, {
      method: 'DELETE',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 204) {
      return { success: true, message: 'Contact deleted successfully (no content returned).' };
    }

    if (response.ok) {
      let data = null;
      const responseText = await response.text();
      if (responseText) {
        try {
          data = JSON.parse(responseText);
        } catch (parseError) {
          console.error('Delete Contact Response Parse Error:', parseError.message, responseText);
          return { success: false, message: `Contact deleted but response was not valid JSON: ${parseError.message}` };
        }
      }
      return {
        success: true,
        message: data?.message || 'Contact deleted successfully!',
      };
    } else {
      let errorMessage = `Failed to delete contact. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return {
        success: false,
        message: errorMessage
      };
    }
  } catch (error) {
    console.error('API Error during delete contact call:', error);
    return {
      success: false,
      message: `Network error: ${error.message || 'Could not connect to the contact delete server.'}`
    };
  }
}

export async function getContactById(token, contactId) {
  const CONTACT_BY_ID_API_URL = `${API_BASE_URL}/api/contacts/${contactId}`;

  if (!token) {
    return { success: false, message: "No authentication token provided." };
  }
  if (!contactId) {
    return { success: false, message: "No contact ID provided." };
  }

  try {
    const response = await fetch(CONTACT_BY_ID_API_URL, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.ok) {
        const responseText = await response.text();
        if (responseText) {
            try {
                const data = JSON.parse(responseText);
                return { success: true, data: data };
            } catch (parseError) {
                return { success: false, message: `Failed to parse contact data: ${parseError.message}` };
            }
        } else {
            return { success: false, message: "Failed to fetch contact: Empty response." };
        }
    } else {
      let errorMessage = `Failed to fetch contact with ID ${contactId}. Status: ${response.status}.`;
      try {
        const errorText = await response.text();
        const errorData = errorText ? JSON.parse(errorText) : null;
        errorMessage = errorData?.message || errorData?.error || errorText || errorMessage;
      } catch (parseError) {
        errorMessage += ` (Parse Error: ${parseError.message})`;
      }
      return { success: false, message: errorMessage };
    }
  } catch (error) {
    console.error(`API Error during get contact by ID (${contactId}) call:`, error);
    return { success: false, message: `Network error: ${error.message || 'Could not connect to the contact server.'}` };
  }
}

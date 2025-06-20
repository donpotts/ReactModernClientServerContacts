// src/pages/ContactPage.jsx
import React, { useState, useEffect } from 'react';
import { getContacts, createContact, updateContact, deleteContact } from '../api/auth.js';

/**
 * Reusable form component for adding and editing contacts.
 * It handles the form state, submission logic, and calls the appropriate API function.
 *
 * @param {object} props - The component props.
 * @param {object} props.contact - The contact object to pre-fill the form (for edit mode).
 * @param {string} props.mode - The mode of the form ('add' or 'edit').
 * @param {string} props.authToken - The authentication token for API calls.
 * @param {function} props.onSave - Callback function to execute after a successful save.
 * @param {function} props.onCancel - Callback function to execute when the form is cancelled.
 */
function ContactForm({ contact, mode, authToken, onSave, onCancel }) {
  // State to hold the form data, initialized with contact data if in 'edit' mode.
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    address: contact?.address || '',
  });
  const [formError, setFormError] = useState(null); // State for displaying form-specific errors
  const [loading, setLoading] = useState(false);   // State for managing loading status during API calls

  // Effect to update form data when the 'contact' prop changes (relevant for switching between edit contacts)
  useEffect(() => {
    setFormData({
      name: contact?.name || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      address: contact?.address || '',
    });
    setFormError(null); // Clear any previous errors when contact changes or mode changes
  }, [contact, mode]);

  /**
   * Handles changes to form input fields.
   * Updates the formData state based on the input's name and value.
   * @param {object} e - The event object from the input change.
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  /**
   * Handles the form submission.
   * Calls either createContact or updateContact based on the form's mode.
   * @param {object} e - The event object from the form submission.
   */
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setLoading(true);
    setFormError(null);

    let result;
    if (mode === 'add') {
      // Call the API to create a new contact
      result = await createContact(authToken, formData);
    } else if (mode === 'edit') {
      // For editing, explicitly create a new object with only the updatable fields.
      // This ensures the 'id' property is not sent in the request body.
      const dataToUpdate = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      };
      result = await updateContact(authToken, contact.id, dataToUpdate); // Pass contact.id from original prop
    }

    if (result.success) {
      onSave(); // Call the parent's onSave callback to refresh the list and change view
    } else {
      setFormError(result.message); // Display error message from API
    }
    setLoading(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-8 max-w-lg mx-auto mt-8 animate-fade-in-up">
      <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {mode === 'add' ? 'Add New Contact' : 'Edit Contact'}
      </h3>
      {formError && <p className="text-red-500 text-center mb-4">{formError}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700">Address</label>
          <input
            type="text"
            id="address"
            name="address"
            value={formData.address}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div className="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={loading}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-semibold shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            disabled={loading}
          >
            {loading ? (mode === 'add' ? 'Adding...' : 'Updating...') : (mode === 'add' ? 'Add Contact' : 'Save Changes')}
          </button>
        </div>
      </form>
    </div>
  );
}

/**
 * Main Contact Page component managing display of contact list, add form, and edit form.
 *
 * @param {object} props - The component props.
 * @param {string} props.authToken - The authentication token for API calls.
 * @param {function} props.onGoToHome - Callback to navigate to the home page if not authenticated.
 */
function ContactPage({ authToken, onGoToHome }) { // Renamed from ContactContentPage
  const [contactsData, setContactsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list'); // Controls which section to display: 'list', 'add', 'edit'
  const [selectedContact, setSelectedContact] = useState(null); // Stores the contact object for editing

  // Effect to fetch contacts when the component mounts or authToken/viewMode changes to 'list'
  useEffect(() => {
    if (authToken && viewMode === 'list') {
      fetchContacts();
    } else if (!authToken) {
      setError("Please log in to view contacts.");
      setContactsData([]); // Clear contacts if no auth token
    }
  }, [authToken, viewMode]); // Dependency array: re-run when authToken or viewMode changes

  /**
   * Fetches the list of contacts from the API.
   * Updates contactsData, loading, and error states.
   */
  const fetchContacts = async () => {
    setLoading(true);
    setError(null); // Clear previous errors
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

  /**
   * Sets the view mode to 'add' to display the add contact form.
   */
  const handleAddClick = () => {
    setViewMode('add');
    setSelectedContact(null); // Ensure no contact is selected when adding
  };

  /**
   * Sets the view mode to 'edit' and stores the selected contact for editing.
   * @param {object} contact - The contact object to be edited.
   */
  const handleEditClick = (contact) => {
    setViewMode('edit');
    setSelectedContact(contact);
  };

  /**
   * Handles the deletion of a contact.
   * Displays a confirmation dialog before proceeding.
   * @param {string} contactId - The ID of the contact to delete.
   */
  const handleDeleteClick = async (contactId) => {
    // Basic confirmation dialog, consider a custom modal for better UX
    if (!window.confirm("Are you sure you want to delete this contact?")) {
      return; // User cancelled the deletion
    }
    setLoading(true); // Indicate loading while deletion is in progress
    const result = await deleteContact(authToken, contactId);
    if (result.success) {
      console.log("Contact deleted successfully.");
      fetchContacts(); // Refresh the list after successful deletion
    } else {
      setError(result.message || "Failed to delete contact.");
      console.error("Failed to delete contact:", result.message);
    }
    setLoading(false); // Reset loading state
  };

  /**
   * Callback function for ContactForm when a save/update is successful.
   * Resets view to 'list' and refreshes the contacts.
   */
  const handleFormSave = () => {
    setViewMode('list'); // Go back to the contact list view
    fetchContacts(); // Re-fetch contacts to show the newly added/updated contact
  };

  /**
   * Callback function for ContactForm when cancelled.
   * Resets view to 'list' and clears selected contact.
   */
  const handleFormCancel = () => {
    setViewMode('list'); // Go back to the contact list view
    setSelectedContact(null); // Clear selected contact
  };

  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in mx-auto">
      {/* Conditional rendering based on viewMode */}
      {viewMode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">Your Contacts</h2>
            <button
              onClick={handleAddClick}
              className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
            >
              Add Contact
            </button>
          </div>

          <p className="text-lg text-indigo-100 mb-6 text-center">Details from the secure API endpoint.</p>
          <button
            onClick={fetchContacts}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mb-8 block mx-auto"
            disabled={loading || !authToken}
          >
            {loading ? 'Loading...' : 'Refresh Contacts'}
          </button>

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {contactsData.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {contactsData.map((contact, index) => (
                // Use contact.id as key if available, otherwise fallback to index (less ideal but works)
                <div key={contact.id || index} className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-103 hover:shadow-xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.name}</h3>
                    <p className="text-gray-600 text-sm">Email: {contact.email}</p>
                    <p className="text-gray-600 text-sm">Phone: {contact.phone}</p>
                    {contact.address && <p className="text-gray-600 text-sm">Address: {contact.address}</p>}
                  </div>
                  <div className="mt-4 flex justify-end space-x-3">
                    <button
                      onClick={() => handleEditClick(contact)}
                      className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteClick(contact.id)} // Assuming contact.id exists for deletion
                      className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            !loading && !error && authToken && (
              <p className="text-indigo-200 text-center mt-8">No contacts to display. Click "Add Contact" to create one.</p>
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
        </>
      )}

      {/* Render ContactForm for adding a new contact */}
      {viewMode === 'add' && (
        <ContactForm
          mode="add"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {/* Render ContactForm for editing an existing contact */}
      {viewMode === 'edit' && selectedContact && (
        <ContactForm
          contact={selectedContact} // Pass the contact data to pre-fill the form
          mode="edit"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}

export default ContactPage;

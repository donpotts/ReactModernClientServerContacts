// src/pages/ContactPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { getContacts, createContact, updateContact, deleteContact } from '../api/auth.js';

const modalAnimations = `
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes scale-in-fade-in {
    from { transform: scale(0.95); opacity: 0; }
    to { transform: scale(1); opacity: 1; }
  }
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }

  .animate-fade-in {
    animation: fade-in 0.3s ease-out forwards;
  }
  .animate-scale-in-fade-in {
    animation: scale-in-fade-in 0.3s ease-out forwards;
  }
  .animate-fade-in-up {
    animation: fade-in-up 0.4s ease-out forwards;
  }
`;

function ContactForm({ contact, mode, authToken, onSave, onCancel }) {
  const [formData, setFormData] = useState({
    name: contact?.name || '',
    email: contact?.email || '',
    phone: contact?.phone || '',
    // Default leadId to '0' string when adding, otherwise use existing or empty
    leadId: mode === 'add' ? '0' : (contact?.leadId ?? ''),
    role: contact?.role || '',
    // Default addressId to 0 when adding, otherwise use existing or empty
    addressId: mode === 'add' ? 0 : (contact?.addressId ?? ''),
    // Default contactRewardsId to 0 when adding, otherwise use existing or empty
    contactRewardsId: mode === 'add' ? 0 : (contact?.contactRewardsId ?? ''),
    photo: contact?.photo || '',
    notes: contact?.notes || '',
  });
  const [formError, setFormError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setFormData({
      name: contact?.name || '',
      email: contact?.email || '',
      phone: contact?.phone || '',
      leadId: mode === 'add' ? '0' : (contact?.leadId ?? ''),
      role: contact?.role || '',
      addressId: mode === 'add' ? 0 : (contact?.addressId ?? ''),
      contactRewardsId: mode === 'add' ? 0 : (contact?.contactRewardsId ?? ''),
      photo: contact?.photo || '',
      notes: contact?.notes || '',
    });
    setFormError(null);
  }, [contact, mode]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    let newValue = value;

    if (name === 'addressId' || name === 'contactRewardsId') {
      newValue = value === '' ? 0 : Number(value); // Convert empty string to 0 for numeric IDs
    } else if (name === 'leadId') {
      newValue = value === '' ? '0' : value; // Convert empty string to '0' string for Lead ID
    }

    setFormData((prevData) => ({
      ...prevData,
      [name]: newValue,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setFormError(null);

    let result;
    if (mode === 'add') {
      console.log("Attempting to add new contact with data:", formData);
      result = await createContact(authToken, formData);
    } else if (mode === 'edit') {
      const { id: _id, ...dataToUpdate } = formData;
      console.log("Attempting to update contact ID:", contact.id);
      console.log("Payload dataToUpdate:", dataToUpdate);
      result = await updateContact(authToken, contact.id, dataToUpdate);
      console.log("Result from update API call:", result);
    }

    if (result.success) {
      onSave();
    } else {
      setFormError(result.message);
      console.error("Failed to save contact:", result.message || "An unknown error occurred.");
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
          <label htmlFor="leadId" className="block text-sm font-medium text-gray-700">Lead ID</label>
          <input
            type="text"
            id="leadId"
            name="leadId"
            value={formData.leadId}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="role" className="block text-sm font-medium text-gray-700">Role</label>
          <input
            type="text"
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="addressId" className="block text-sm font-medium text-gray-700">Address ID</label>
          <input
            type="number"
            id="addressId"
            name="addressId"
            value={formData.addressId === null ? '' : formData.addressId}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="contactRewardsId" className="block text-sm font-medium text-gray-700">Contact Rewards ID</label>
          <input
            type="number"
            id="contactRewardsId"
            name="contactRewardsId"
            value={formData.contactRewardsId === null ? '' : formData.contactRewardsId}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="photo" className="block text-sm font-medium text-gray-700">Photo URL</label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>
        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
          <textarea
            id="notes"
            name="notes"
            value={formData.notes}
            onChange={handleChange}
            rows="3"
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
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

function DeleteConfirmationModal({ isOpen, contact, onConfirm, onCancel }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-500/20 to-indigo-600/20 flex items-center justify-center z-50 animate-fade-in">
      <div className="bg-white rounded-lg shadow-xl p-8 max-w-sm w-full mx-auto transform transition-transform duration-300 scale-95 opacity-0 animate-scale-in-fade-in">
        <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">Confirm Deletion</h3>
        <p className="text-gray-700 text-center mb-6">
          Are you sure you want to delete contact: <span className="font-semibold">{contact?.name}</span>?
        </p>
        <div className="flex justify-center space-x-4">
          <button
            onClick={onCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
          >
            Cancel
          </button>
          <button
            onClick={() => onConfirm(contact.id)}
            className="px-6 py-2 bg-red-600 text-white rounded-lg font-semibold shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactPage({ authToken, onGoToHome }) {
  const [contactsData, setContactsData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState('list');
  const [selectedContact, setSelectedContact] = useState(null);
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [contactToDelete, setContactToDelete] = useState(null);

  const [currentPage, setCurrentPage] = useState(1);
  const [contactsPerPage, setContactsPerPage] = useState(5);

  const indexOfLastContact = currentPage * contactsPerPage;
  const indexOfFirstContact = indexOfLastContact - contactsPerPage;
  const currentContacts = contactsData.slice(indexOfFirstContact, indexOfLastContact);

  const totalPages = Math.ceil(contactsData.length / contactsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleContactsPerPageChange = (e) => {
    setContactsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    setError(null);
    const result = await getContacts(authToken);

    if (result.success) {
      setContactsData(result.data);
      console.log("Contacts fetched successfully:", result.data);
      setCurrentPage(1);
    } else {
      setError(result.message);
      console.error("Failed to fetch contacts:", result.message);
      setContactsData([]);
    }
    setLoading(false);
  }, [authToken, setCurrentPage, setContactsData, setLoading, setError]);

  useEffect(() => {
    if (authToken && viewMode === 'list') {
      fetchContacts();
    } else if (!authToken) {
      setError("Please log in to view contacts.");
      setContactsData([]);
    }
  }, [authToken, viewMode, fetchContacts]);

  const handleAddClick = () => {
    setViewMode('add');
    setSelectedContact(null);
  };

  const handleEditClick = (contact) => {
    setViewMode('edit');
    setSelectedContact(contact);
  };

  const handleDeleteClick = (contact) => {
    setContactToDelete(contact);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async (contactId) => {
    setIsDeleteModalOpen(false);
    setLoading(true);
    const result = await deleteContact(authToken, contactId);
    if (result.success) {
      console.log("Contact deleted successfully.");
      fetchContacts();
    } else {
      setError(result.message || "Failed to delete contact.");
      console.error("Failed to delete contact:", result.message);
    }
    setLoading(false);
    setContactToDelete(null);
  };

  const handleCancelDelete = () => {
    setIsDeleteModalOpen(false);
    setContactToDelete(null);
  };

  const handleFormSave = () => {
    setViewMode('list');
    fetchContacts();
    setShowSuccessMessage(true);
    setTimeout(() => setShowSuccessMessage(false), 3000);
  };

  const handleFormCancel = () => {
    setViewMode('list');
    setSelectedContact(null);
  };

  return (
    <div className="pt-24 pb-8 w-full max-w-4xl px-4 animate-fade-in mx-auto">
      <style>{modalAnimations}</style>

      {viewMode === 'list' && (
        <>
          <div className="flex justify-between items-center mb-10">
            <h2 className="text-4xl font-extrabold text-white mb-4">Your Contacts</h2>
            <div className="flex space-x-4">
              <button
                onClick={handleAddClick}
                className="px-6 py-2 bg-green-500 text-white rounded-lg font-semibold shadow-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all duration-200"
              >
                Add Contact
              </button>
            </div>
          </div>

          <p className="text-lg text-indigo-100 mb-6 text-center">Details from the secure API endpoint.</p>
          <button
            onClick={fetchContacts}
            className="mt-4 px-6 py-2 bg-purple-600 text-white rounded-lg font-semibold shadow-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 mb-8 block mx-auto"
            disabled={loading || !authToken}
          >
            {loading ? 'Loading...' : 'Refresh Contacts'}
          </button>

          {showSuccessMessage && (
            <p className="text-green-400 text-center mb-4 animate-fade-in">
              Contact saved successfully!
            </p>
          )}

          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {contactsData.length > 0 ? (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {currentContacts.map((contact, index) => (
                  <div key={contact.id || index} className="bg-white rounded-2xl shadow-lg p-6 transform transition-transform duration-300 hover:scale-103 hover:shadow-xl flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-2">{contact.name}</h3>
                      <p className="text-gray-600 text-sm">Email: {contact.email}</p>
                      <p className="text-gray-600 text-sm">Phone: {contact.phone}</p>
                      <p className="text-gray-600 text-sm">Lead ID: {contact.leadId}</p>
                      <p className="text-gray-600 text-sm">Role: {contact.role}</p>
                      <p className="text-gray-600 text-sm">Address ID: {contact.addressId != null ? contact.addressId : ''}</p>
                      <p className="text-gray-600 text-sm">Rewards ID: {contact.contactRewardsId != null ? contact.contactRewardsId : ''}</p>
                      <p className="text-gray-600 text-sm">Photo: {contact.photo}</p>
                      <p className="text-gray-600 text-sm">Notes: {contact.notes}</p>
                    </div>
                    <div className="mt-4 flex justify-end space-x-3">
                      <button
                        onClick={() => handleEditClick(contact)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteClick(contact)}
                        className="px-4 py-2 bg-red-500 text-white rounded-lg text-sm font-medium shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-all duration-200"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-col sm:flex-row justify-center items-center space-y-4 sm:space-y-0 sm:space-x-4 mt-8 text-white">
                <div className="flex items-center space-x-2">
                  <label htmlFor="contactsPerPage" className="text-sm font-medium">Contacts per page:</label>
                  <select
                    id="contactsPerPage"
                    value={contactsPerPage}
                    onChange={handleContactsPerPageChange}
                    className="bg-indigo-700 text-white rounded-lg shadow-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                    <option value={contactsData.length}>All</option>
                  </select>
                </div>
                {totalPages > 1 && (
                  <div className="flex space-x-2">
                    <button
                      onClick={() => paginate(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 bg-indigo-700 rounded-lg shadow-md hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Previous
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => (
                      <button
                        key={i + 1}
                        onClick={() => paginate(i + 1)}
                        className={`px-4 py-2 rounded-lg shadow-md transition-colors duration-200 ${
                          currentPage === i + 1 ? 'bg-indigo-500 text-white' : 'bg-indigo-700 hover:bg-indigo-800 text-white'
                        }`}
                      >
                        {i + 1}
                      </button>
                    ))}
                    <button
                      onClick={() => paginate(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 bg-indigo-700 rounded-lg shadow-md hover:bg-indigo-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-200"
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            </>
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

      {viewMode === 'add' && (
        <ContactForm
          mode="add"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      {viewMode === 'edit' && selectedContact && (
        <ContactForm
          contact={selectedContact}
          mode="edit"
          authToken={authToken}
          onSave={handleFormSave}
          onCancel={handleFormCancel}
        />
      )}

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        contact={contactToDelete}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </div>
  );
}

export default ContactPage;

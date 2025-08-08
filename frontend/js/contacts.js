// contacts.js - CRUD operations for contacts
import { apiRequest, getToken, redirectToLogin } from './utils.js';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    redirectToLogin();
    return;
  }
  
  // Initialize based on current page
  const path = window.location.pathname;
  if (path.includes('list.html')) {
    initContactsList();
  } else if (path.includes('create.html')) {
    initCreateContact();
  } else if (path.includes('edit.html')) {
    initEditContact();
  } else if (path.includes('details.html')) {
    initContactDetails();
  }
});

// Initialize contacts list page
async function initContactsList() {
  try {
    await loadContacts();
    setupPagination();
  } catch (error) {
    console.error('Error initializing contacts list:', error);
    showError('Failed to load contacts');
  }
}

// Load and display contacts with pagination and sorting
async function loadContacts(page = 1, limit = 10, sortBy = 'createdAt', sortOrder = 'desc') {
  try {
    const response = await apiRequest(`/contacts?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    displayContacts(response.data);
    updatePaginationInfo(response);
  } catch (error) {
    console.error('Error loading contacts:', error);
    showError('Failed to load contacts');
  }
}

// Display contacts in the table
function displayContacts(contacts) {
  const tbody = document.querySelector('table tbody');
  if (!tbody) return;

  tbody.innerHTML = '';
  
  if (contacts.length === 0) {
    tbody.innerHTML = '<tr><td colspan="4">No contacts found</td></tr>';
    return;
  }

  contacts.forEach(contact => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td><a href="details.html?id=${contact.id}">${escapeHtml(contact.name)}</a></td>
      <td>${escapeHtml(contact.phoneNumber)}</td>
      <td>${contact.tags ? contact.tags.join(', ') : ''}</td>
      <td>
        <a href="edit.html?id=${contact.id}">Edit</a> ·
        <button onclick="deleteContact(${contact.id})" class="delete-btn">Delete</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

// Update pagination information
function updatePaginationInfo(response) {
  const pagination = document.querySelector('nav[aria-label="Contacts pagination"] ul');
  if (!pagination) return;

  pagination.innerHTML = '';
  
  // Previous button
  if (response.hasPrev) {
    pagination.innerHTML += `<li><a href="#" onclick="loadContacts(${response.page - 1})">Prev</a></li>`;
  }
  
  // Page numbers
  for (let i = 1; i <= response.totalPages; i++) {
    const current = i === response.page ? ' aria-current="page"' : '';
    pagination.innerHTML += `<li><a href="#" onclick="loadContacts(${i})"${current}>${i}</a></li>`;
  }
  
  // Next button
  if (response.hasNext) {
    pagination.innerHTML += `<li><a href="#" onclick="loadContacts(${response.page + 1})">Next</a></li>`;
  }
}

// Initialize create contact page
function initCreateContact() {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const contactData = {
      name: formData.get('name').trim(),
      phoneNumber: formData.get('phone').trim(),
      tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : []
    };

    try {
      const response = await apiRequest('/contacts/', 'POST', contactData);
      showSuccess('Contact created successfully!');
      setTimeout(() => {
        window.location.href = `details.html?id=${response.id}`;
      }, 1000);
    } catch (error) {
      console.error('Error creating contact:', error);
      showError('Failed to create contact: ' + error.message);
    }
  });
}

// Initialize edit contact page
async function initEditContact() {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get('id');
  
  if (!contactId) {
    showError('Contact ID not provided');
    return;
  }

  try {
    // Load existing contact data
    const contact = await apiRequest(`/contacts/${contactId}`);
    populateEditForm(contact);
    
    // Setup form submission
    const form = document.querySelector('form');
    if (form) {
      form.addEventListener('submit', async (e) => {
        e.preventDefault();
        await updateContact(contactId, form);
      });
    }
  } catch (error) {
    console.error('Error loading contact for edit:', error);
    showError('Failed to load contact data');
  }
}

// Populate edit form with existing contact data
function populateEditForm(contact) {
  const nameInput = document.getElementById('name');
  const phoneInput = document.getElementById('phone');
  const tagsInput = document.getElementById('tags');

  if (nameInput) nameInput.value = contact.name;
  if (phoneInput) phoneInput.value = contact.phoneNumber;
  if (tagsInput) tagsInput.value = contact.tags ? contact.tags.join(', ') : '';
}

// Update contact
async function updateContact(contactId, form) {
  const formData = new FormData(form);
  const contactData = {
    name: formData.get('name').trim(),
    phoneNumber: formData.get('phone').trim(),
    tags: formData.get('tags') ? formData.get('tags').split(',').map(tag => tag.trim()).filter(tag => tag) : []
  };

  try {
    await apiRequest(`/contacts/${contactId}`, 'PUT', contactData);
    showSuccess('Contact updated successfully!');
    setTimeout(() => {
      window.location.href = `details.html?id=${contactId}`;
    }, 1000);
  } catch (error) {
    console.error('Error updating contact:', error);
    showError('Failed to update contact: ' + error.message);
  }
}

// Initialize contact details page
async function initContactDetails() {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get('id');
  
  if (!contactId) {
    showError('Contact ID not provided');
    return;
  }

  try {
    const contact = await apiRequest(`/contacts/${contactId}`);
    displayContactDetails(contact);
    
    // Update edit link
    const editLink = document.querySelector('a[href="edit.html"]');
    if (editLink) {
      editLink.href = `edit.html?id=${contactId}`;
    }
  } catch (error) {
    console.error('Error loading contact details:', error);
    showError('Failed to load contact details');
  }
}

// Display contact details
function displayContactDetails(contact) {
  const nameElement = document.querySelector('dd:nth-of-type(1)');
  const phoneElement = document.querySelector('dd:nth-of-type(2)');
  const tagsElement = document.querySelector('dd:nth-of-type(3)');

  if (nameElement) nameElement.textContent = contact.name;
  if (phoneElement) phoneElement.textContent = contact.phoneNumber;
  if (tagsElement) tagsElement.textContent = contact.tags ? contact.tags.join(', ') : 'No tags';
  
  // Update page title
  document.title = `OutreachHub – ${contact.name}`;
}

// Delete contact
async function deleteContact(contactId) {
  if (!confirm('Are you sure you want to delete this contact?')) {
    return;
  }

  try {
    await apiRequest(`/contacts/${contactId}`, 'DELETE');
    showSuccess('Contact deleted successfully!');
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  } catch (error) {
    console.error('Error deleting contact:', error);
    showError('Failed to delete contact: ' + error.message);
  }
}

// Setup pagination event handlers
function setupPagination() {
  // This function can be extended for more advanced pagination features
  // Currently handled inline in updatePaginationInfo
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  // Remove existing messages
  removeMessages();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'message error';
  errorDiv.textContent = message;
  
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(errorDiv, main.firstChild);
  }
}

function showSuccess(message) {
  // Remove existing messages
  removeMessages();
  
  const successDiv = document.createElement('div');
  successDiv.className = 'message success';
  successDiv.textContent = message;
  
  const main = document.querySelector('main');
  if (main) {
    main.insertBefore(successDiv, main.firstChild);
  }
}

function removeMessages() {
  const messages = document.querySelectorAll('.message');
  messages.forEach(msg => msg.remove());
}

// Make functions globally available for inline event handlers
window.loadContacts = loadContacts;
window.deleteContact = deleteContact;

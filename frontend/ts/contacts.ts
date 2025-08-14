interface Contact {
  id: number;
  name: string;
  phoneNumber: string;
  tags?: string[];
  createdAt: string;
}

interface PaginatedResponse<T> {
  data: T[];
  page: number;
  limit: number;
  totalPages: number;
  totalResults: number;
  hasNext: boolean;
  hasPrev: boolean;
}

import { apiRequest, getToken, redirectToLogin } from './utils';

// Check authentication on page load
document.addEventListener('DOMContentLoaded', () => {
  if (!getToken()) {
    redirectToLogin();
    return;
  }
  
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

async function initContactsList(): Promise<void> {
  try {
    await loadContacts();
    setupPagination();
  } catch (error) {
    console.error('Error initializing contacts list:', error);
    showError('Failed to load contacts');
  }
}

async function loadContacts(page: number = 1, limit: number = 10, sortBy: string = 'createdAt', sortOrder: string = 'desc'): Promise<void> {
  try {
    const response = await apiRequest<PaginatedResponse<Contact>>(`/contacts?page=${page}&limit=${limit}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
    displayContacts(response.data);
    updatePaginationInfo(response);
  } catch (error) {
    console.error('Error loading contacts:', error);
    showError('Failed to load contacts');
  }
}

function displayContacts(contacts: Contact[]): void {
  const tbody = document.querySelector('table tbody') as HTMLTableSectionElement | null;
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

function updatePaginationInfo(response: PaginatedResponse<Contact>): void {
  const pagination = document.querySelector('nav[aria-label="Contacts pagination"] ul') as HTMLUListElement | null;
  if (!pagination) return;

  pagination.innerHTML = '';
  
  if (response.hasPrev) {
    pagination.innerHTML += `<li><a href="#" onclick="loadContacts(${response.page - 1})">Prev</a></li>`;
  }
  
  for (let i = 1; i <= response.totalPages; i++) {
    const current = i === response.page ? ' aria-current="page"' : '';
    pagination.innerHTML += `<li><a href="#" onclick="loadContacts(${i})"${current}>${i}</a></li>`;
  }
  
  if (response.hasNext) {
    pagination.innerHTML += `<li><a href="#" onclick="loadContacts(${response.page + 1})">Next</a></li>`;
  }
}

function initCreateContact(): void {
  const form = document.querySelector('form') as HTMLFormElement | null;
  if (!form) return;

  form.addEventListener('submit', async (e: Event) => {
    e.preventDefault();
    
    const formData = new FormData(form);
    const contactData = {
      name: (formData.get('name') as string).trim(),
      phoneNumber: (formData.get('phone') as string).trim(),
      tags: (formData.get('tags') as string | null)?.split(',').map(tag => tag.trim()).filter(tag => tag) || []
    };

    try {
      const response = await apiRequest<Contact>('/contacts/', 'POST', contactData);
      showSuccess('Contact created successfully!');
      setTimeout(() => {
        window.location.href = `details.html?id=${response.id}`;
      }, 1000);
    } catch (error) {
      console.error('Error creating contact:', error);
      showError('Failed to create contact: ' + (error as Error).message);
    }
  });
}

async function initEditContact(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get('id');
  
  if (!contactId) {
    showError('Contact ID not provided');
    return;
  }

  try {
    const contact = await apiRequest<Contact>(`/contacts/${contactId}`);
    populateEditForm(contact);
    
    const form = document.querySelector('form') as HTMLFormElement | null;
    if (form) {
      form.addEventListener('submit', async (e: Event) => {
        e.preventDefault();
        await updateContact(contactId, form);
      });
    }
  } catch (error) {
    console.error('Error loading contact for edit:', error);
    showError('Failed to load contact data');
  }
}

function populateEditForm(contact: Contact): void {
  const nameInput = document.getElementById('name') as HTMLInputElement | null;
  const phoneInput = document.getElementById('phone') as HTMLInputElement | null;
  const tagsInput = document.getElementById('tags') as HTMLInputElement | null;

  if (nameInput) nameInput.value = contact.name;
  if (phoneInput) phoneInput.value = contact.phoneNumber;
  if (tagsInput) tagsInput.value = contact.tags ? contact.tags.join(', ') : '';
}

async function updateContact(contactId: string, form: HTMLFormElement): Promise<void> {
  const formData = new FormData(form);
  const contactData = {
    name: (formData.get('name') as string).trim(),
    phoneNumber: (formData.get('phone') as string).trim(),
    tags: (formData.get('tags') as string | null)?.split(',').map(tag => tag.trim()).filter(tag => tag) || []
  };

  try {
    await apiRequest(`/contacts/${contactId}`, 'PUT', contactData);
    showSuccess('Contact updated successfully!');
    setTimeout(() => {
      window.location.href = `details.html?id=${contactId}`;
    }, 1000);
  } catch (error) {
    console.error('Error updating contact:', error);
    showError('Failed to update contact: ' + (error as Error).message);
  }
}

async function initContactDetails(): Promise<void> {
  const urlParams = new URLSearchParams(window.location.search);
  const contactId = urlParams.get('id');
  
  if (!contactId) {
    showError('Contact ID not provided');
    return;
  }

  try {
    const contact = await apiRequest<Contact>(`/contacts/${contactId}`);
    displayContactDetails(contact);
    
    const editLink = document.querySelector('a[href="edit.html"]') as HTMLAnchorElement | null;
    if (editLink) {
      editLink.href = `edit.html?id=${contactId}`;
    }
  } catch (error) {
    console.error('Error loading contact details:', error);
    showError('Failed to load contact details');
  }
}

function displayContactDetails(contact: Contact): void {
  const nameElement = document.querySelector('dd:nth-of-type(1)') as HTMLElement | null;
  const phoneElement = document.querySelector('dd:nth-of-type(2)') as HTMLElement | null;
  const tagsElement = document.querySelector('dd:nth-of-type(3)') as HTMLElement | null;

  if (nameElement) nameElement.textContent = contact.name;
  if (phoneElement) phoneElement.textContent = contact.phoneNumber;
  if (tagsElement) tagsElement.textContent = contact.tags ? contact.tags.join(', ') : 'No tags';
  
  document.title = `OutreachHub – ${contact.name}`;
}

async function deleteContact(contactId: number): Promise<void> {
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
    showError('Failed to delete contact: ' + (error as Error).message);
  }
}

// Utility functions
function escapeHtml(text: string | number | null | undefined): string {
  if (text === null || text === undefined) return '';
  const div = document.createElement('div');
  div.textContent = String(text);
  return div.innerHTML;
}

function showError(message: string): void {
  removeMessages();
  
  const errorDiv = document.createElement('div');
  errorDiv.className = 'message error';
  errorDiv.textContent = message;
  
  const main = document.querySelector('main') as HTMLElement | null;
  if (main) {
    main.insertBefore(errorDiv, main.firstChild);
  }
}

function showSuccess(message: string): void {
  removeMessages();
  
  const successDiv = document.createElement('div');
  successDiv.className = 'message success';
  successDiv.textContent = message;
  
  const main = document.querySelector('main') as HTMLElement | null;
  if (main) {
    main.insertBefore(successDiv, main.firstChild);
  }
}

function removeMessages(): void {
  const messages = document.querySelectorAll('.message');
  messages.forEach(msg => msg.remove());
}

// Make functions globally available for inline event handlers
(window as any).loadContacts = loadContacts;
(window as any).deleteContact = deleteContact;

function setupPagination() {
    throw new Error('Future.');
}

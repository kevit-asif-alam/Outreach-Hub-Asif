// auth.js
import { apiRequest, setToken } from './utils.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('form');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const username = form.username?.value.trim() || form.email?.value.trim();
    const password = form.password.value.trim();

    try {
      const res = await apiRequest('/auth/login', 'POST', { username, password });
      if (res.access_token) {
        setToken(res.access_token);
        window.location.href = 'home.html';
      } else {
        alert('Login failed. Please try again.');
      }
    } catch (err) {
      alert(err.message || 'Login error');
    }
  });
});

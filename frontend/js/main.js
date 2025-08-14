// Commented for typescript conflict
// import { getToken, clearToken, redirectToLogin } from './utils.js';

// document.addEventListener('DOMContentLoaded', () => {
//   // Protect every page except login
//   if (!getToken() && !window.location.pathname.includes('login.html')) {
//     redirectToLogin();
//     return;
//   }

//   // Attach logout handler
//   const logoutLink = document.querySelector('a[href="login.html"]');
//   if (logoutLink) {
//     logoutLink.addEventListener('click', (e) => {
//       e.preventDefault();
//       clearToken();
//       window.location.href = 'login.html';
//     });
//   }
// });

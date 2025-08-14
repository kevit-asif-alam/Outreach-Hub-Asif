import { getToken, clearToken, redirectToLogin } from './utils';

document.addEventListener('DOMContentLoaded', () => {
  if (!getToken() && !window.location.pathname.includes('login.html')) {
    redirectToLogin();
    return;
  }

  const logoutLink = document.querySelector('a[href="login.html"]') as HTMLAnchorElement | null;
  if (logoutLink) {
    logoutLink.addEventListener('click', (e: Event) => {
      e.preventDefault();
      clearToken();
      window.location.href = 'login.html';
    });
  }
});
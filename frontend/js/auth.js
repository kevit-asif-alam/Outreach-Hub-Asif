// import { apiRequest, setToken } from './utils.js';

// document.addEventListener('DOMContentLoaded', () => {
//   const form = document.querySelector('form');
//   if (!form) return;

//   form.addEventListener('submit', async (e) => {
//     e.preventDefault();
//     const username = form.username?.value.trim() || form.email?.value.trim();
//     const password = form.password.value.trim();

//     try {
//       const res = await apiRequest('/auth/login', 'POST', { username, password });
//       if (res.access_token) {
//         setToken(res.access_token);
//         window.location.href = 'home.html';
//       } else {
//         alert('Login failed. Please try again.');
//       }
//     } catch (err) {
//       alert(err.message || 'Login error');
//     }
//   });
// });


let loginForm = document.getElementById("login-form");
let loginNameInput = document.getElementById("login-name");
let loginPasswordInput = document.getElementById("login-password");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  try {
    const response = await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: loginNameInput.value,
        password: loginPasswordInput.value,
      }),
    });

    let data = await response.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "./home.html"; // use "../home" if your file structure requires it
    } else {
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Something went wrong. Please try again.");
  }
});

let loginForm = document.getElementById("login-form") as HTMLFormElement;
let loginNameInput = document.getElementById("login-name") as HTMLInputElement;
let loginPasswordInput = document.getElementById("login-password") as HTMLInputElement;

loginForm.addEventListener("submit", async (e: Event) => {
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

    if (!response.ok) {
      throw new Error("Login failed with status: " + response.status);
    }

    let data: { access_token?: string } = await response.json();

    if (data.access_token) {
      localStorage.setItem("token", data.access_token);
      window.location.href = "./home.html";
    } else {
      alert("Login failed. Please check your credentials.");
    }
  } catch (error) {
    console.error("Error during login:", error);
    alert("Something went wrong. Please try again.");
  }
});
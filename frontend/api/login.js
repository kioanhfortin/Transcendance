import { getCookie } from "./cookie";

async function loginUser(username, password) {

  const csrftoken = getCookie('csrftoken');
  const response = await fetch('http://localhost:8000/api/token/', {
    
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },

    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  if (response.ok) {
    const data = await response.json();
    // Stockez les tokens JWT dans le stockage local ou les cookies
    localStorage.setItem('access_token', data.access);
    localStorage.setItem('refresh_token', data.refresh);
    console.log('Login successful:', data);
    // Fermez le modal de login
    // const modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    // modal.hide();
  } else {
    const errorData = await response.json();
    console.error('Error logging in:', errorData);
    alert('Login failed: ' + errorData.detail);
  }
}

export function setupLogin() {
document.getElementById('validate-btn-login').addEventListener('click', () => {
  const username = document.getElementById('inputLoginLog').value;
  const password = document.getElementById('inputPasswordLogin').value;
  loginUser(username, password);
  });
}
import { getCookie } from "./cookie";

async function loginUser(username, password) {

  const csrftoken = getCookie('csrftoken');
  const response = await fetch('http://localhost:8000/api/login/', {
    
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

    document.cookie = `access_token=${data.access_token}; Secure; SameSite=Strict`;
    document.cookie = `refresh_token=${data.refresh_token}; Secure; SameSite=Strict`;

    //close modal here?
  
  } else {
    const errorData = await response.json();
    console.error('Error logging in:', errorData);
    alert('Login failed: ' + errorData.detail);
  }
}

export function setupLogin() {
document.getElementById('validate-btn-login').addEventListener('click', () => {
  const username = document.getElementById('login').value;
  const password = document.getElementById('password').value;
  loginUser(username, password);
  });
}
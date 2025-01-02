import { getCookie } from "./cookie";

async function registerUser(username, password, confirmPassword) {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const csrftoken = getCookie('csrftoken');
    const response = await fetch('http://localhost:8000/api/register/', {
    
    method: 'POST',

    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrftoken,
    },

    body: JSON.stringify({
      username: username,
      password1: password,
      password2: confirmPassword,
    }),
    });

  if(response.ok) {
    const data = await response.json();
    console.log('register successful:', data);
    
    // close modal login here?

    } else {
    const errorData = await response.json();
    console.error('Error logging in:', errorData);
    alert('Login failed: ' + errorData.detail);
    }
}

export function setupRegister() {
document.getElementById('validate-btn-register').addEventListener('click', () => {
  const username = document.getElementById('inputLoginRegister').value;
  const password = document.getElementById('inputPasswordRegister').value;
  const confirmPassword = document.getElementById('inputPasswordConfirmRegister').value;
  registerUser(username, password, confirmPassword);
});
}
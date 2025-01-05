import { getCookie } from "./cookie";

export function closeModal(modalElement) {
  if (modalElement) {
      modalElement.classList.remove('show');
      modalElement.style.display = 'none';
  }

  // Remove modal-open class from the body
  document.body.classList.remove('modal-open');

  // Remove lingering modal backdrops
  const backdrop = document.querySelector('.modal-backdrop');
  if (backdrop) {
    backdrop.remove();
  }
}

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
    alert('register successful');
    console.log('register successful:', data);
    
    const registerModal = document.getElementById('registerModal')

    closeModal(registerModal);

    } else {
    const errorData = await response.json();
    console.error('Error logging in:', errorData);
    alert('Login failed: ' + errorData.detail);
    }
}

export function setupRegister() {
document.getElementById('register-save-btn').addEventListener('click', () => {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  registerUser(username, password, confirmPassword);
});
}
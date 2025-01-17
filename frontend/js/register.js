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

async function registerUser(username, password, confirmPassword, email) {
    if (password !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    const checkbox = document.getElementById('myCheckbox');
    
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
        email: email,
        has_accepted_terms: checkbox.checked,
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
      console.error(errorData);

      // Traite les erreurs pour les afficher dans une alerte ou la console
      if (errorData.username) {
          alert(errorData.username.join(', '));
      }

      if (errorData.email) {
          alert(errorData.email.join(', '));
      }

      if (errorData.password1) {
          alert(errorData.password1.join(', '));
      }

      if (errorData.has_accepted_terms) {
          alert(errorData.has_accepted_terms.join(', '));
      }
    }
}

export function setupRegister() {
document.getElementById('register-save-btn').addEventListener('click', () => {
  const username = document.getElementById('register-username').value;
  const password = document.getElementById('register-password').value;
  const confirmPassword = document.getElementById('register-confirm-password').value;
  const email = document.getElementById('register-email').value;
  // registerUser(username, password, confirmPassword, email);
  const checkbox = document.getElementById('myCheckbox');

    if (!checkbox.checked) {
      alert('You must agree to the terms and conditions to register.');
      return; // Ne pas continuer si la checkbox n'est pas cochée
    }

    registerUser(username, password, confirmPassword, email);
});
}
import { getCookie } from "./cookie";
import { closeModal } from "../js/ui.js";
import { updateStatus } from "./updateStatus"
import { sendOtp } from "./2FA";  // Fonction d'envoi de l'OTP
import { validateOtp } from "./2FA";


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
      console.log(data.access_token);
      console.log(data.refresh_token);

      // Fermer la modal de login
      const loginModal = document.getElementById('exampleModal');
      closeModal(loginModal);

      const otpModal = document.getElementById('otpModal');
      if (otpModal) {
        console.log("Opening OTP modal...");
        otpModal.style.display = 'block';
        otpModal.style.opacity = '1';
        otpModal.style.zIndex = '1050';
      } else {
        console.error("OTP modal not found.");
      }

      await sendOtp(username);
      document.getElementById('validate-otp-btn').addEventListener('click', async () => {
        const otp = document.getElementById('otp-input').value;

        const otpValid = await validateOtp(otp);
        if (otpValid) {
              // L'OTP est validé, procéder à la connexion
              document.cookie = `access_token=${data.access_token}; Secure; SameSite=Strict`;
              document.cookie = `refresh_token=${data.refresh_token}; Secure; SameSite=Strict`;
              console.log(data.access_token);
              console.log(data.refresh_token);
      
              const otpModal = document.getElementById('otpModal');
              closeModal(otpModal);
              
              // Cacher le "preliminary-step" et afficher le "main-content"
              const preliminaryStep = document.getElementById('preliminary-step');
              const mainContent = document.getElementById('main-content');
              preliminaryStep.style.display = 'none';
              mainContent.style.display = 'block';
      
              // Si un canvas est présent, l'afficher aussi
              const canvas = document.getElementById('bg');
              if (canvas) {
                canvas.style.display = "block";
                canvas.classList.add('visible');
              }
              const Icon = document.getElementById("tournament-icon");
              Icon.style.display = "none";
              updateStatus("isOnline", true);
        } else {
          alert('Invalid or expired OTP. Please try again.');
        }
      });
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
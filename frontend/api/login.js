import { getCookie } from "./cookie";
import { closeModal } from "../js/ui.js";
import { updateStatus } from "./updateStatus"
import { sendOtp } from "./2FA";  // Fonction d'envoi de l'OTP
import { validateOtp } from "./2FA";

//rien pour passer 2FA a true, a prevoir


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

    if (data.is2Fa) {
      // Si 2FA est activé, appeler sendOtp
      await sendOtp(username); // Fonction pour envoyer l'OTP

      // Afficher un prompt pour entrer l'OTP
      const otp = prompt("Please enter the OTP sent to your device:");

      // Valider l'OTP
      const otpValid = await validateOtp(otp);
      if (otpValid) {
        // L'OTP est validé, procéder à la connexion
        document.cookie = `access_token=${data.access_token}; Secure; SameSite=Strict`;
        document.cookie = `refresh_token=${data.refresh_token}; Secure; SameSite=Strict`;
        alert('Login successful!');
        console.log(data.access_token);
        console.log(data.refresh_token);

        // Fermer la modal de login
        const loginModal = document.getElementById('exampleModal');
        closeModal(loginModal);  // Appelle la fonction pour fermer la modal

        // Cacher le "preliminary-step" et afficher le "main-content"
        const preliminaryStep = document.getElementById('preliminary-step');
        const mainContent = document.getElementById('main-content');
        preliminaryStep.style.display = 'none'; // Masquer le pré-content
        mainContent.style.display = 'block';    // Afficher le contenu principal

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
        alert("Invalid OTP. Please try again.");
      }
    } else {
      // Si 2FA n'est pas activé, continuer la connexion normalement
      document.cookie = `access_token=${data.access_token}; Secure; SameSite=Strict`;
      document.cookie = `refresh_token=${data.refresh_token}; Secure; SameSite=Strict`;
      alert('Login successful!');
      console.log(data.access_token);
      console.log(data.refresh_token);

      // Fermer la modal de login
      const loginModal = document.getElementById('exampleModal');
      closeModal(loginModal);  // Appelle la fonction pour fermer la modal

      // Cacher le "preliminary-step" et afficher le "main-content"
      const preliminaryStep = document.getElementById('preliminary-step');
      const mainContent = document.getElementById('main-content');
      preliminaryStep.style.display = 'none'; // Masquer le pré-content
      mainContent.style.display = 'block';    // Afficher le contenu principal

      // Si un canvas est présent, l'afficher aussi
      const canvas = document.getElementById('bg');
      if (canvas) {
        canvas.style.display = "block";
        canvas.classList.add('visible');
      }
      const Icon = document.getElementById("tournament-icon");
      Icon.style.display = "none";
      updateStatus("isOnline", true);
    }
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
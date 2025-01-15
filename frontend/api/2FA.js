import { getCookie } from "./cookie";


export async function sendOtp(username) {
    const csrftoken = getCookie('csrftoken');
    const data = { username: username };

    const response = await fetch('http://localhost:8000/api/send-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    
    if (response.status === 200) {
        console.log("OTP sent to your email.");
        alert("OTP sent to your email.");
        document.getElementById('otp-step').style.display = 'block';
    } else {
        console.error("Erreur lors de l'envoi de l'OTP:", responseData.error);
        alert(responseData.error || "Une erreur est survenue.");
    }
}

export async function validateOtp(otp) {
    const csrftoken = getCookie('csrftoken'); // Récupère le CSRF token

    if (!csrftoken) {
        console.error("CSRF token is missing.");
        return false;
    }

    const jwtToken = getCookie('access_token'); // Récupère le token JWT
    if (!jwtToken) {
        console.error("JWT token is missing.");
        return false;
    }

    if (!otp) {
        alert('Please enter the OTP.');
        return;
    }

    const response = await fetch('/api/validate-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ otp: otp }),
    });

    const responseData = await response.json();

    if (response.status === 200) {
        console.log("OTP validé avec succès");
        alert('OTP validated successfully. You are logged in.');
        document.getElementById('otp-step').style.display = 'none';
        return true;
    } else {
        console.error("Erreur de validation OTP:", responseData.message);
        alert(responseData.message || "L'OTP est invalide ou expiré.");
        return false;
    }
}

// document.getElementById('validate-btn-login').addEventListener('click', validateOtp);
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
    } else {
        console.error("Erreur lors de l'envoi de l'OTP:", responseData.error);
        alert(responseData.error || "Une erreur est survenue.");
    }
}

export async function validateOtp(otp) {
    // const csrftoken = getCookie('csrftoken'); // Récupère le CSRF token

    // if (!csrftoken) {
    //     console.error("CSRF token is missing.");
    //     return false;
    // }

    // const jwtToken = getCookie('access_token'); // Récupère le token JWT
    // if (!jwtToken) {
    //     console.error("JWT token is missing.");
    //     return false;
    // }

    if (!otp) {
        alert('Please enter the OTP.');
        return;
    }

    const response = await fetch('http://localhost:8000/api/validate-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${document.cookie
                    .split('; ')
                    .find((row) => row.startsWith('access_token='))
                    ?.split('=')[1]}`,
            // 'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify({ otp: otp }),
    });

    if (!response.ok) {
        const text = await response.text();
        alert(error.message || 'Invalid OTP or expired.');
        console.error('OTP Validation Failed:', error);
        return;
    }

    const responseData = await response.json();

    if (response.status === 200) {
        console.log("OTP validé avec succès");
        alert('OTP validated successfully. You are logged in.');
        return true;
    } else {
        console.error("Erreur de validation OTP:", responseData.message);
        alert(responseData.message || "L'OTP est invalide ou expiré.");
        return false;
    }
}

// document.getElementById('validate-btn-login').addEventListener('click', validateOtp);
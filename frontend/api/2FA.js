import { getCookie } from "./cookie";


export async function sendOtp(username) {
    const data = { username: username };

    const response = await fetch('/api/send-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();
    
    if (response.status === 200) {
        console.log("OTP envoyé avec succès");
        alert("Un OTP a été envoyé à votre adresse e-mail.");
    } else {
        console.error("Erreur lors de l'envoi de l'OTP:", responseData.error);
        alert(responseData.error || "Une erreur est survenue.");
    }
}

export async function validateOtp(otp) {
    const data = { otp: otp };

    const response = await fetch('/api/validate-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
        },
        body: JSON.stringify(data),
    });

    const responseData = await response.json();

    if (response.status === 200) {
        console.log("OTP validé avec succès");
        alert("OTP validé avec succès. Authentification réussie.");
    } else {
        console.error("Erreur de validation OTP:", responseData.message);
        alert(responseData.message || "L'OTP est invalide ou expiré.");
    }
}
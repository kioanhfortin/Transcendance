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
    const jwtToken = getCookie('access_token');
    const csrftoken = getCookie('csrftoken');
    if (!otp) {
        alert('Please enter the OTP.');
        return;
    }

    const response = await fetch('http://localhost:8000/api/validate-otp/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'X-CSRFToken': csrftoken,
            'Authorization': `Bearer ${jwtToken}`,
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
        return true;
    } else {
        console.error("Erreur de validation OTP:", responseData.message);
        alert(responseData.message || "L'OTP est invalide ou expiré.");
        return false;
    }
}
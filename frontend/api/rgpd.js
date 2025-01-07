import { getCookie } from "./cookie";

async function updateUserData(updatedData) {
    const jwtToken = getCookie('access_token');
    const csrfToken = getCookie('csrftoken');

    // Vérifie si les tokens sont présents
    if (!jwtToken || !csrfToken) {
        alert('Authentication tokens are missing.');
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/user/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(updatedData), // Données mises à jour à envoyer
        });

        if (response.ok) {
            const data = await response.json();
            alert('Your data has been updated successfully.');
            console.log('Updated data:', data);
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to update data: ' + errorData.detail);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred while updating your data. Please try again later.');
    }
}


async function deleteUserAccount() {
    const jwtToken = getCookie('access_token');
    const csrfToken = getCookie('csrftoken');

    // Vérifie si les tokens sont présents
    if (!jwtToken || !csrfToken) {
        alert('Authentication tokens are missing.');
        return;
    }

    // Confirmation avant suppression
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/user/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            alert('Your account has been successfully deleted.');
            // Optionnel : Rediriger vers la page d'accueil ou de déconnexion
            window.location.href = '/';
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to delete account: ' + errorData.detail);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred while deleting your account. Please try again later.');
    }
}

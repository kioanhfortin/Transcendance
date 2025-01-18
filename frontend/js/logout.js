import { getCookie } from "./cookie";
import { updateStatus } from "./updateStatus";

async function logout() {
    const jwtToken = getCookie('access_token');
	const refreshJwtToken = getCookie('refresh_token');

    const response = await fetch('http://localhost:8000/api/logout/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },
		body: JSON.stringify({
			refresh: refreshJwtToken,
		})
    });

    if (response.ok) {
        console.log('Déconnexion réussie');
        document.cookie = 'access_token=; Max-Age=0';  // Supprimez le token côté client
    } else {
        const errorData = await response.json();
        console.error('Erreur de déconnexion:', errorData);
    }
}

export function logoutUser() {
	document.getElementById('logoutModal').addEventListener('click', () => {
        updateStatus("isOnline", false);
		logout();
	});
}
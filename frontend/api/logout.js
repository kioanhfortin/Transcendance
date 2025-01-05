import { getCookie } from "./cookie";

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
        alert('Vous êtes déconnecté');
        document.cookie = 'access_token=; Max-Age=0';  // Supprimez le token côté client
    } else {
        const errorData = await response.json();
        console.error('Erreur de déconnexion:', errorData);
        alert('Erreur lors de la déconnexion');
    }
}

export function logoutUser() {
	document.getElementById('logoutModal').addEventListener('click', () => {
		logout();
	  });
	}
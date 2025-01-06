import { getCookie } from "./cookie";

export async function updatePlayerStatistics(gameType, result) {
    const jwtToken = getCookie('access_token');

    const response = await fetch('http://localhost:8000/api/update-statistics/', {

        method: 'PATCH',

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,  // Envoie le token JWT dans l'en-tête Authorization
        },

        body: JSON.stringify({
            game_type: gameType,  // 'solo', '1VS1', '2VS2', 'tournoi'
            result: result,       // 'V' pour victoire, 'L' pour défaite
        }),
    });

    if (response.ok) {
        console.log('Statistics updated successfully!');
    } else {
        const errorData = await response.json();
        console.error('Error updating statistics:', errorData);
        alert('Failed to update statistics: ' + errorData.detail);
    }
}
import { getCookie } from "./cookie";
import { addHistory } from "./history";

export async function updatePlayerStatistics(gameType, result) {
    const jwtToken = getCookie('access_token');

    const response = await fetch('http://localhost:8000/api/statistics/', {

        method: 'PATCH',

        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${jwtToken}`,
        },

        body: JSON.stringify({
            game_type: gameType,  // 'solo', '1VS1', '2VS2', 'tournoi'
            result: result,       // 'V' pour 'Victory', 'L' pour 'Lose'
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

export function updateStatsGameMode(game, points) {
    let gameMode;

    if (game.isFourPlayer)
        gameMode = '2VS2';
    else if (game.isSinglePlayer)
        gameMode = 'solo';
    else
        gameMode = '1VS1';
    
    let playerOneWins = points.lastScorer == 1 ? 'V' : 'L';
    updatePlayerStatistics(gameMode, playerOneWins);
    addHistory(gameMode, playerOneWins);
}
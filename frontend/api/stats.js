import { getCookie } from "./cookie";


async function fetchUserStatistics() {
    const jwtToken = getCookie('access_token');
    const csrfToken = getCookie('csrftoken');
    console.log(jwtToken);

    const response = await fetch('http://localhost:8000/api/statistics/', {

            method: 'GET',
            
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        // Vérifiez si la réponse est correcte (status 200)
        if (response.ok) {
            const data = await response.json();
            displayStatistics(data);
        } else {
        const errorData = await response.json();
        console.error('you are not log:', errorData);
        alert('stats file failed: ' + errorData.detail);
      }
}

function displayStatistics(data) {
    // Affichez les statistiques dans votre modal ou ailleurs dans votre page
    console.log(data);
}

export function setupStats() {
document.getElementById('statisticsBtn').addEventListener('click', function() {
	fetchUserStatistics();
});
}

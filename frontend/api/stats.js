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
    // Affichez les statistiques dans modal ou ailleurs dans votre page
    console.log(data);
    document.getElementById('single-victory').textContent = data.nb_victoires_solo || 0;
    document.getElementById('single-defeat').textContent = data.nb_defaites_solo || 0;
    document.getElementById('single-total').textContent = data.nb_parties_solo || 0;

    document.getElementById('multi-victory').textContent = data.nb_victoires_1VS1 || 0;
    document.getElementById('multi-defeat').textContent = data.nb_defaites_1VS1 || 0;
    document.getElementById('multi-total').textContent = data.nb_parties_1VS1 || 0;

    document.getElementById('team-victory').textContent = data.nb_victoires_2VS2 || 0;
    document.getElementById('team-defeat').textContent = data.nb_defaites_2VS2 || 0;
    document.getElementById('team-total').textContent = data.nb_parties_2VS2 || 0;

    document.getElementById('tournament-victory').textContent = data.nb_victoires_tournois || 0;
    document.getElementById('tournament-defeat').textContent = data.nb_defaites_tournois || 0;
    document.getElementById('tournament-total').textContent = data.nb_parties_tournois || 0;
}

export function setupStats() {
document.getElementById('statisticsBtn').addEventListener('click', function() {
	fetchUserStatistics();
});
}

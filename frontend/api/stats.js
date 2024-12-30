import { getCookie } from "./cookie";


function fetchUserStatistics() {
	const jwtToken = getCookie('jwt'); // Assurez-vous que vous avez une fonction pour obtenir le cookie JWT
	const csrfToken = getCookie('csrftoken');
	
    fetch('/api/statistics/', {

        method: 'GET',
        
		headers: {
			'Content-Type': 'application/json',
			'X-CSRFToken': csrfToken,
            'Authorization': `Bearer ${jwtToken}`,
        }
    })
	
    .then(response => response.json())
    .then(data => {
        if (data.error) {
			alert(data.error);
        } else {
			displayStatistics(data);
        }
    })
    .catch(error => {
		console.error('Error fetching statistics:', error);
    });
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

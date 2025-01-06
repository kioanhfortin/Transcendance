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
    
    const gameModes = ["Single Player", "Multi Player", "2 v 2", "Tournament"];
    const victories = [
        data.nb_victoires_solo || 0,
        data.nb_victoires_1VS1 || 0,
        data.nb_victoires_2VS2 || 0,
        data.nb_victoires_tournois || 0
    ];
    const defeats = [
        data.nb_defaites_solo || 0,
        data.nb_defaites_1VS1 || 0,
        data.nb_defaites_2VS2 || 0,
        data.nb_defaites_tournois || 0
    ];
    const totalGames = [
        data.nb_parties_solo || 0,
        data.nb_parties_1VS1 || 0,
        data.nb_parties_2VS2 || 0,
        data.nb_parties_tournois || 0
    ];

    const ctx = document.getElementById("statsChart").getContext("2d");
    // if (window.statsChart) {
    //     window.statsChart.destroy(); // Supprimez l'ancien graphique pour en créer un nouveau
    // }

    window.statsChart = new Chart(ctx, {
        type: "bar",
        data: {
            labels: gameModes,
            datasets: [
                {
                    label: "Victory",
                    data: victories,
                    backgroundColor: "rgb(172, 21, 49)",
                    borderWidth: 1,
                },
                {
                    label: "Defeat",
                    data: defeats,
                    backgroundColor: "rgb(21, 49, 172)",
                    borderWidth: 1,
                },
                {
                    label: "Total Game",
                    data: totalGames,
                    backgroundColor: "rgb(21, 172, 132)",
                    borderWidth: 1,
                },
            ],
        },
        options: {
            responsive: true,
            plugins: {
                legend: {
                    position: "top",
                    align: "start", 
                    labels: {
                        font: {
                            size: 14,
                            family: "'Arial', sans-serif",
                            weight: "bold",
                        },
                        color: "#333",
                    },
                },
                tooltip: {
                    titleFont: {
                        size: 14,
                        family: "'Arial', sans-serif",
                        weight: "bold",
                    },
                    bodyFont: {
                        size: 12,
                        family: "'Arial', sans-serif",
                    },
                },
            },
            layout: {
                padding: {
                    top: 10,
                    bottom: 10,
                    right: 10,
                    left: 10,
                },
            },
            scales: {
                x: {
                    ticks: {
                        font: {
                            size: 12,
                            family: "'Arial', sans-serif",
                        },
                    },
                    grid: {
                        display: false,
                    },
                },
                y: {
                    beginAtZero: true,
                    ticks: {
                        font: {
                            size: 12,
                            family: "'Arial', sans-serif",
                        },
                    },
                    grid: {
                        color: "rgba(200, 200, 200, 0.3)",
                    },
                },
            },
        },
    });
}

export function setupStats() {
document.getElementById('statisticsBtn').addEventListener('click', function() {
	fetchUserStatistics();
});
}

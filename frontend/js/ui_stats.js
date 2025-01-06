// document.addEventListener("DOMContentLoaded", () => {
//     // Ajouter un événement pour le modal
//     document.getElementById("statisticModal").addEventListener("shown.bs.modal", () => {
//         // Une fois que le modal est visible, on initialise le graphique
//         const ctx = document.getElementById("statsChart").getContext("2d");

//         const gameModes = ["Single Player", "Multi Player", "2 v 2", "Tournament"];
//         const victories = [0, 0, 0, 0];
//         const defeats = [0, 0, 0, 0];
//         const totalGames = [0, 0, 0, 0];

//         // Mise à jour des données à partir du tableau
//         const tableRows = document.querySelectorAll("#statisticModal tbody tr");
//         tableRows.forEach((row, index) => {
//             victories[index] = parseInt(
//                 row.querySelector(`#${gameModes[index].toLowerCase().replace(/\s/g, '-')}-victory`).textContent
//             );
//             defeats[index] = parseInt(
//                 row.querySelector(`#${gameModes[index].toLowerCase().replace(/\s/g, '-')}-defeat`).textContent
//             );
//             totalGames[index] = parseInt(
//                 row.querySelector(`#${gameModes[index].toLowerCase().replace(/\s/g, '-')}-total`).textContent
//             );
//         });

//         // Création du graphique
//         new Chart(ctx, {
//             type: "bar",
//             data: {
//                 labels: gameModes,
//                 datasets: [
//                     {
//                         label: "Victories",
//                         data: victories,
//                         backgroundColor: "rgba(75, 192, 192, 0.8)",
//                         borderColor: "rgba(75, 192, 192, 1)",
//                         borderWidth: 1,
//                     },
//                     {
//                         label: "Defeats",
//                         data: defeats,
//                         backgroundColor: "rgba(255, 99, 132, 0.8)",
//                         borderColor: "rgba(255, 99, 132, 1)",
//                         borderWidth: 1,
//                     },
//                     {
//                         label: "Total Games",
//                         data: totalGames,
//                         backgroundColor: "rgba(54, 162, 235, 0.8)",
//                         borderColor: "rgba(54, 162, 235, 1)",
//                         borderWidth: 1,
//                     },
//                 ],
//             },
//             options: {
//                 responsive: true,
//                 plugins: {
//                     legend: {
//                         position: "top",
//                     },
//                     tooltip: {
//                         enabled: true,
//                     },
//                 },
//                 scales: {
//                     y: {
//                         beginAtZero: true,
//                     },
//                 },
//             },
//         });
//     });
// });
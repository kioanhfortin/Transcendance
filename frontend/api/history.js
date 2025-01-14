import { getCookie } from "./cookie";

export async function addHistory(game_mode, result) {
	const jwtToken = getCookie('access_token');
	try {
		const response = await fetch('http://localhost:8000/api/user-history/', {

			method: 'POST',

			headers: {

				'Content-Type': 'application/json',
				'Authorization': `Bearer ${jwtToken}`,
			},
			body: JSON.stringify({
				game_mode: game_mode, // 'solo', '1VS1', '2VS2', 'tournoi'
				result: result  // 'win' 'lose'
			}),
		});

		if (response.ok) {
			const data = await response.json();
			console.log("Add game in history", data);
		} else {
			const errorData = await response.json();
			console.error('Error:', errorData);
			alert('Failed to post history ' + errorData.detail);
		}
	} catch (error) {
		console.error('Network error:', error);
		alert('An error occurred while updating your data. Please try again later.');
	}
}

export async function getHistory() {
	const jwtToken = getCookie('access_token');
	console.log("i'm here");
	try {
		const response = await fetch('http://localhost:8000/api/user-history/', {

			method: 'GET',

			headers: {

				'Content-Type': 'application/json',
				'Authorization': `Bearer ${jwtToken}`,
			},
		});

		if (response.ok) {
			const data = await response.json();
			console.log("list History: ", data);
		} else {
			const errorData = await response.json();
			console.error('Error:', errorData);
			alert('Failed to get history :  ' + errorData.detail);
		}
	} catch (error) {
		console.error('Network error:', error);
		alert('An error occurred while updating your list. Please try again later.');
	}
}

export function handleHistory() {
	document.getElementById('historyBtn').addEventListener('click', function() {
		getHistory();
	});
}

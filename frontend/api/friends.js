import { getCookie } from "./cookie";

export async function addFriend(username) {
    const jwtToken = getCookie('access_token');

    try {
        const response = await fetch('http://localhost:8000/api/add-friend/', {

            method: 'POST',

            headers: {

                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                username: username,
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Add Friends success ", data);
            getFriend() //TO DEBUG
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to update Status ' + errorData.detail);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred while updating your data. Please try again later.');
    }
}


export async function getFriend() {
    const jwtToken = getCookie('access_token');

    try {
        const response = await fetch('http://localhost:8000/api/friends/', {

            method: 'GET',

            headers: {

                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            console.log("list Friends: ", data);
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to get listFriends :  ' + errorData.detail);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred while updating your list. Please try again later.');
    }
}

export function handleFriend() {
    document.getElementById('add-friend').addEventListener('click', function() {
        const username = document.getElementById('register-friend').value;
        addFriend(username);
    });
}



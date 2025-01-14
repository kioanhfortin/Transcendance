import { getCookie } from "./cookie";
// import { currentUser } from "./updateProfile";

export async function addFriend(username) {
    // if (username === currentUser) {
    //     alert("You cannot add yourself as a friend!");
    //     return;
    // }

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
            getFriend();
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
            console.log("Friend list fetched successfully: ", data);
            populateFriendTab(data);
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

export function populateFriendTab(data) {
    // console.log("Data passed to populateFriendTab:", data);
    const friendTableBody = document.getElementById('friendTableBody');
    // friendTableBody = document.getElementById('profileModal').addEventListener('show.bs.modal', fetchUserData);
    // console.log("Table body found:", friendTableBody);
    if (!friendTableBody) {
        console.error("friendTableBody element not found in DOM!");
        return;
    }
    friendTableBody.innerHTML = "";
    const currentUser = data.username;
    const friends = data.friends || [];
    // console.log("Friends array to populate:", friends);

    friends
        .filter(friend => friend.username !== currentUser)
        .forEach(friend => {
            const row = document.createElement('tr');
            row.innerHTML = `
                    <td>${friend.username}</td>
                    <td>${friend.isOnline ? 'Online' : 'Offline'}</td>
                    <td>${friend.isInGame ? 'In Game' : 'N/A'}</td>
                `;
            friendTableBody.appendChild(row);
    });
}
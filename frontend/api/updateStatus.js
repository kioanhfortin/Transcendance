import { getCookie } from "./cookie";

export async function updateStatus(status, state) {
    const jwtToken = getCookie('access_token');

    try {
        const response = await fetch('http://localhost:8000/api/user/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify({
                [status]: state,
                //status = 'isOnline' or 'isIngame' and state = 'true' or 'false'
            }),
        });

        if (response.ok) {
            const data = await response.json();
            console.log("Updated status success ", data);
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
import { getCookie } from "./cookie";
// export const currentUser = "";


export async function fetchUserData() {
    const jwtToken = getCookie('access_token');
    const csrfToken = getCookie('csrftoken');
    console.log(jwtToken);

    try {
        const response = await fetch('http://localhost:8000/api/user/', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${jwtToken}`,
            },
        });

        if (response.ok) {
            const data = await response.json();
            displayProfil(data);
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to update data: ' + errorData.detail);
        }
    } catch (error) {
        console.error('Network error:', error);
        console.error('Error:', errorData, 'Status Code:', response.status);
        alert('Failed to delete account: ' + errorData.detail);
        alert('An error occurred while updating your data. Please try again later.');
    }
}

export function displayProfil(data) {
    // Affichez les statistiques dans modal ou ailleurs dans votre page
    // currentUser = data.username;
    console.log(data);
    document.getElementById('login-username').value = data.username || '';
    document.getElementById('email-profile').value = data.email || '';
    const avatarImg = document.querySelector(".avatar-img");
    avatarImg.src = data.avatar ? 'http://localhost:8000' + data.avatar : 'http://localhost:8000/static/images/default_avatar.png';
}

export function setupProfile() {
    document.getElementById('profileModal').addEventListener('show.bs.modal', fetchUserData);
}

export async function updateUserData() {
    const jwtToken = getCookie('access_token');
    const csrfToken = getCookie('csrftoken');
    // console.log(jwtToken);

    const updatedUsername = document.getElementById('login-username').value;
    const updatedEmail = document.getElementById('email-profile').value;

    const updatedData = {
        username: updatedUsername,
        email: updatedEmail,
    };
    try {
        const response = await fetch('http://localhost:8000/api/user/', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${jwtToken}`,
            },
            body: JSON.stringify(updatedData),
        });

        if (response.ok) {
            const data = await response.json();
            alert("your account has been updated successfully !")
            console.log("nouvelles donnees: ", data);

        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to update data: ' + errorData.detail);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('error occurred while updating your data. Please try again later.');
    }
}

export function saveProfile() {
    document.getElementById('save-changes-profile').addEventListener('click', updateUserData);
}

async function deleteUserAccount() {
    const jwtToken = getCookie('access_token');
    const csrfToken = getCookie('csrftoken');

    // Vérifie si les tokens sont présents
    if (!jwtToken || !csrfToken) {
        alert('Authentication tokens are missing.');
        return;
    }

    // Confirmation avant suppression
    const confirmDelete = confirm("Are you sure you want to delete your account? This action cannot be undone.");
    if (!confirmDelete) {
        return;
    }

    try {
        const response = await fetch('http://localhost:8000/api/user/', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRFToken': csrfToken,
                'Authorization': `Bearer ${jwtToken}`,
            },
        });
        
        if (response.ok) {
            alert('Your account has been successfully deleted.');
            document.cookie = 'access_token=; Max-Age=0; path=/;';
            document.cookie = 'refresh_token=; Max-Age=0; path=/;';
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to delete account: ' + errorData.detail);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred while deleting your account. Please try again later.');
    }
}

export function deleteProfile() {
    document.getElementById('delete-profile').addEventListener('click', deleteUserAccount);
}

document.getElementById('general-conditions-link1').addEventListener('click', (event) => {
    event.preventDefault();
    const pdfPath = '/assets/rgpd.pdf';
    window.open(pdfPath, '_blank');
});
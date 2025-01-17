import { getCookie } from "./cookie";
import { fetchUserData } from "./updateProfile";

// Fonction pour télécharger l'avatar
async function uploadUserAvatar() {
    const jwtToken = getCookie('access_token');
    const csrfToken = getCookie('csrftoken');
    const fileInput = document.getElementById("uploadAvatar");
    const formData = new FormData();

    // Vérification qu'un fichier a été sélectionné
    if (fileInput.files.length === 0) {
        alert("Please select an image to upload.");
        return;
    }

    formData.append("avatar", fileInput.files[0]);

    try {
        const response = await fetch('http://localhost:8000/api/update-avatar/', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${jwtToken}`,
                'X-CSRFToken': csrfToken,
            },
            body: formData,
        });

        if (response.ok) {
            const data = await response.json();
            // Mise à jour de l'image d'avatar dans le DOM
            fetchUserData();
            updateAvatarPreview(data.avatar);
            alert("Avatar updated successfully!");
        } else {
            const errorData = await response.json();
            console.error('Error:', errorData);
            alert('Failed to upload avatar: ' + errorData.message);
        }
    } catch (error) {
        console.error('Network error:', error);
        alert('An error occurred while uploading the avatar. Please try again later.');
    }
}

// Fonction pour mettre à jour l'avatar dans l'élément d'image
function updateAvatarPreview(avatar) {
    // Met à jour l'élément d'image avec la nouvelle URL de l'avatar
    document.querySelector(".avatar-img").src = "http://localhost:8000/"+ avatar;
}

// Exposer la fonction de téléchargement d'avatar pour l'utiliser ailleurs
export function setupAvatarUpload() {
    document.getElementById("uploadAvatar").addEventListener("change", uploadUserAvatar);
}

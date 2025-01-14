import { getCookie } from "./cookie";
document.getElementById("uploadAvatar").addEventListener("change", async function () {
    const fileInput = this;
    const formData = new FormData();
    formData.append("avatar", fileInput.files[0]);

    try {
        const response = await fetch("/update-avatar/", {
            method: "POST",
            headers: {
                'X-CSRFToken': getCookie('csrftoken'), // CSRF Token pour Django
            },
            body: formData
        });

        const data = await response.json();  // Await pour attendre le parsing JSON

        if (data.status === 'success') {
            document.querySelector(".avatar-img").src = data.avatar_url;
        } else {
            alert("Erreur lors de l'upload de l'image.");
        }
    } catch (error) {
        console.error("Erreur lors de la requête :", error);
        alert("Une erreur est survenue lors de l'envoi de l'image.");
    }
});

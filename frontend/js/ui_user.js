
//Reset password
document.addEventListener("DOMContentLoaded", function() {
    const resetPasswordLink = document.getElementById('reset-password-link');
    resetPasswordLink.addEventListener('click', function(event) {
        event.preventDefault();
        alert('Redirecting to password reset page...');
        // You can replace the alert with an actual redirect:
        // window.location.href = '/reset-password';
    })
});

//Load new image for avatar
document.addEventListener("DOMContentLoaded", function() {
    const uploadAvatarInput = document.getElementById('uploadAvatar');
    const profilePicture = document.querySelector('.avatar-img');
    const profileButton = document.getElementById("profileButton");

    uploadAvatarInput.addEventListener('change', function() {
        const file = uploadAvatarInput.files[0];

        if (file) {
            const reader = new FileReader();
            reader.onload = function (e) {
                profilePicture.src = e.target.result;
                profileButton.innerHTML = `<img src="${e.target.result}" alt="Avatar" style="width: 30px; height: 30px; object-fit: cover; border-radius: 50%;">`;
                profileButton.classList.remove("btn-primary");
                profileButton.style.background = "transparent";
                profileButton.style.border = "none";
            };
            reader.readAsDataURL(file);
        }
    });
});

document.addEventListener("DOMContentLoaded", function () {
  const logoutButton = document.getElementById('logoutModal');
  const preliminaryStep = document.getElementById('preliminary-step');
  const mainContent = document.getElementById('main-content');

  function handleLogout() {
      if (canvas) {
          canvas.style.display = "none";
          canvas.classList.remove('visible');
      }
      preliminaryStep.style.display = 'flex';
      mainContent.style.display = 'none';

      // Reset the game state
      if (window.game) {
          window.game.isactive = false;
          window.game.isPlaying = false;
      }
  }

  logoutButton.addEventListener('click', handleLogout);
});


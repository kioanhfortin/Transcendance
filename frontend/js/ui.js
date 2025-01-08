import { resetBallSettings } from './ball';
import { hideGame } from './utils';
import { setDifficultyAIplayer } from './game.js';
// import { newnbBall } from './game.js'

const menu = document.getElementById('menu');
const canvas = document.getElementById('bg');

// le bouton single player
export function singlePlayer(game) {
    document.getElementById('singlePlayer').addEventListener('click', () => {
        game.isSinglePlayer = true;
        typeGame(game);
    });
}

// bouton multijoueur
export function multiPlayer(game) {
    document.getElementById('multiPlayer').addEventListener('click', () => {
        game.isSinglePlayer = false;
        typeGame(game);
    });
}

// bouton pour commencer la game une fois le jeux initaliser
export function start(game) {
    document.getElementById('start').addEventListener('click', () => {
        game.isPlaying = true;
        document.getElementById('start').style.display = 'none';
        document.getElementById('restart').style.display = 'block';
    });
}

// bouton qui actionne le jeux a 4 joueur
export function isFourPlayer(game) {
    document.getElementById('isFourPlayer').addEventListener('click', () => {
        game.isFourPlayer = true;
        game.isSinglePlayer = false;
        typeGame(game);
    });
}


// restart avec le ui
export function restart(balls, game, points, realPoints, dirBalls) {
    document.getElementById('restart').addEventListener('click', () => {
        initStart(balls, game, points, realPoints, dirBalls);
        document.getElementById('start').style.display = 'block';
        document.getElementById('restart').style.display = 'none';
    });
    document.getElementById('start-tournament').addEventListener('click', () => {
        initStart(balls, game, points, realPoints, dirBalls);
        game.isSinglePlayer = false;
        game.isTournament = true;
        typeGame(game);
    });
}

// get the speed and the acceleration of the ball
export function setSpeedAcc(dirBall) {
    document.getElementById('validate-btn-Stgs').addEventListener('click', () => {
        let speed = document.getElementById('speed-input-ball').value / 100;
        if (speed > 1) {
            speed = 1;
            document.getElementById('speed-input-ball').value = 100;
        }
        dirBall.ySpeed = speed;
        dirBall.xSpeed = speed;
        dirBall.xSpeedOrigin = speed;
        dirBall.ySpeedOrigin = speed;

        let acc = document.getElementById('acceleration-input-ball').value / 200;
        if (acc > 0.5) {
            acc = 0.5;
            document.getElementById('acceleration-input-ball').value = 100;
        }
        dirBall.acceleration = acc;
    });
}

export function setDifficultyAI(difficultyAI) {
    document.getElementById('validate-btn-Stgs').addEventListener('click', () => {
        let difficulty = parseInt(document.getElementById('difficulty-input-ai').value, 10);
        if (isNaN(difficulty) || difficulty < 10) {
            difficulty = 10;
            document.getElementById('difficulty-input-ai').value = 10;
        } else if (difficulty > 50) {
            difficulty = 50;
            document.getElementById('difficulty-input-ai').value = 50;
        }
        setDifficultyAIplayer(difficulty);
        console.log("AI Difficulty updated to:", difficulty);
    });
}

function initStart(balls, game, points, realPoints, dirBalls) {
    game.isactive = true;
    game.needInit = true;        
    game.isPlaying = false;

    realPoints[points.playerOne].playerOne.visible = false;
    realPoints[points.playerTwo].playerTwo.visible = false;
    for (let i in points) {
        points[i] = 0;       
    }
    for (let i in realPoints[0]) {
        realPoints[0][i].visible = true;
    }
    points.lastScorer = 0;
    balls.forEach((ball, index) => { 
        const dirBall = dirBalls[index];

        const randomNumber = Math.floor(Math.random() * 2) + 1;
        randomNumber == 1 ? dirBall.x = 1 : dirBall.x = -1;
        dirBall.y = 1;
        resetBallSettings(dirBall);
        
         ball.position.set(0,0,0);
    });
}

export function finishTournament(walls, players, balls, game, realPoints) {
    document.getElementById('finishTournament').addEventListener('click', () => {
        game.isTournament = false;
        game.isPlaying = false;
        game.isactive = false;
        hideGame(walls, players, balls);
        realPoints[0].playerOne.visible = false;
        realPoints[0].playerTwo.visible = false;
    });
}

export function closeModal(modalElement) {
    if (modalElement) {
        modalElement.classList.remove('show');
        modalElement.style.display = 'none';
    }

    // Remove modal-open class from the body
    document.body.classList.remove('modal-open');

    // Remove lingering modal backdrops
    const backdrop = document.querySelector('.modal-backdrop');
    if (backdrop) {
        backdrop.remove();
    }
}

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

//Logout
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

// cache le menu une fois cliquer sur un des menus genre single player..... etc
export function typeGame(game) {
    game.isactive = true;
    game.needInit = true;
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    canvas.classList.add('visible');
    document.getElementById('start').style.display = 'block';
}


const tournamentIcon = document.getElementById("tournament-icon");

tournamentIcon.addEventListener("click", function () {
    const panel = document.getElementById("tournament-info");

    // Vérifier si le tournoi est actif
    if (!document.body.classList.contains("tournament-active")) {
        return;
    }

    const isCollapsed = panel.classList.contains("tournament-collapsed");
    if (isCollapsed) {
        panel.classList.remove("tournament-collapsed");
        panel.classList.add("tournament-expanded");
        this.style.right = "325px";
    } else {
        panel.classList.remove("tournament-expanded");
        panel.classList.add("tournament-collapsed");
        this.style.right = "0";
    }
});

tournamentIcon.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
        event.preventDefault(); // Empêche les comportements par défaut
        this.click(); // Simule un clic pour déclencher l'action
    }
});



//Resize font size with rem
document.getElementById('validate-btn-Stgs').addEventListener('click', () => {
    const textSize = document.getElementById('text-size-selection').value;
    document.documentElement.style.setProperty('--base-font-size', `${textSize}px`);
});

//Empecher la navigation tab en dehors des modal
document.querySelectorAll('.modal').forEach(modal=> {
    modal.addEventListener('show.bs.modal', () => {
        document.body.setAttribute('aria-hidden', 'true');
    });
    modal.addEventListener('hidden.bs.modal', () => {
        document.body.removeAttribute('aria-hidden');
    });
});


// Manage navigation in chrome and pong
document.addEventListener("DOMContentLoaded", () => {
    const focusableSelectors = `a[href], area[href], input:not([disabled]), select:not([disabled]), 
    textarea:not([disabled]), button:not([disabled]), iframe, 
    [tabindex]:not([tabindex="-1"]), [contenteditable]`;

    function trapFocus(container) {
        const focusableElements = container.querySelectorAll(focusableSelectors);
        if (focusableElements.lenght === 0)
            return;
        const firstElement = focusableElements[0];
        const lastElement = focusableElements[focusableElements.length - 1];
        container.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                if (e.shiftKey) {
                    // Shift + Tab
                    if (document.activeElement === firstElement) {
                        e.preventDefault();
                        lastElement.focus();
                    }
                } else {
                    // Tab
                    if (document.activeElement === lastElement) {
                        e.preventDefault();
                        firstElement.focus();
                    }
                }
            }
        });
    }
    const appContainer = document.body;
    trapFocus(appContainer);
});

export function setNbBall() {
    document.getElementById('validate-btn-Stgs').addEventListener('click', () => {
        let nbrBall = parseInt(document.getElementById('nbr-input-ball').value, 10);
        if (isNaN(nbrBall) || nbrBall< 1) {
            nbrBall = 1;
            document.getElementById('nbr-input-ball').value = 1;
        } else if (nbrBall > 5) {
            nbrBall = 5;
            document.getElementById('nbr-input-ball').value = 5;
        }
        newNbBall(nbrBall);
        console.log("Nbr of Ball updated to:", nbBall);
    });
}


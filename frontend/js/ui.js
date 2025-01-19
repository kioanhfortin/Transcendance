import { resetBallSettings } from './ball';
import { hideGame } from './utils';
import { resetBalls, Game } from './game';
import { resetGame, setDifficultyAIplayer, nbBall } from './game.js';
import { resetTournament, endTournament } from './tournament.js';
import { yLimit, speed } from './PlayerCtrl.js';
import { getFriend } from '../js/friends.js';
import { changeLanguage } from './language.js';

const menu = document.getElementById('menu');
const canvas = document.getElementById('bg');

export function SaveSettings(difficultyAI, nbBall) {
    document.getElementById('validate-btn-Stgs').addEventListener('click', () => {
        if (document.getElementById('menu').style.display != 'none') {
            setDifficultyAI(difficultyAI);
            setBallSettings(nbBall);
            changeLanguage();
            const textSize = document.getElementById('text-size-selection').value;
            document.documentElement.style.setProperty('--base-font-size', `${textSize}px`);
        } else {
            alert('Cannot change game settings during a game !');
            return;
        }

    });
}

// reset les points lorsque on disconect et affiche le bon menu
export function logout( points, game, walls, players, ball) {
    document.getElementById('logoutModal').addEventListener('click', () => {
        resetGame(walls, players, ball, game, points);
        if( game.isTournament)
        {
            endTournament();
            resetTournament();
            game.isTournament = false;
            game.isPlaying = false;
            game.isactive = false;
            hideGame(walls, players, ball);
            document.getElementById(`menu`).style.display = 'block';

        }
    });
}

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
export function restart(balls, game, points, dirBalls, scene) {
    document.getElementById('restart').addEventListener('click', () => {
        initStart(balls, game, points, dirBalls, scene);
        document.getElementById('start').style.display = 'block';
        document.getElementById('restart').style.display = 'none';
    });
    document.getElementById('start-tournament').addEventListener('click', () => {
        initStart(balls, game, points, dirBalls, scene);
        game.isSinglePlayer = false;
        game.isTournament = true;
        typeGame(game);
    });
}



function setDifficultyAI(difficultyAI) {
    let difficulty = parseInt(document.getElementById('difficulty-input-ai').value, 10);
    if (isNaN(difficulty) || difficulty < 10) {
        difficulty = 10;
        document.getElementById('difficulty-input-ai').value = 10;
    } else if (difficulty > 50) {
        difficulty = 50;
        document.getElementById('difficulty-input-ai').value = 50;
    }
    setDifficultyAIplayer(difficulty);
}

// get the speed and the acceleration of the ball
function getSpeed() {
    let speed = document.getElementById('speed-input-ball').value / 100;
    if (speed > 1) {
        speed = 1;
        document.getElementById('speed-input-ball').value = 100;
    }
    else if (speed <= 0) {
        speed = 0.01;
        document.getElementById('speed-input-ball').value = 1;
    }
    return speed;
}

function getAcc() {
    let acc = document.getElementById('acceleration-input-ball').value / 200;
    if (acc > 0.5) {
        acc = 0.5;
        document.getElementById('acceleration-input-ball').value = 100;
    }
    else if (acc <= 0) {
        acc = 0.01;
        document.getElementById('acceleration-input-ball').value = 1;
    }
    return acc;
}


function setBallSettings(nbBall) {
    let nbrBall = parseInt(document.getElementById('nbr-input-ball').value, 10);
    if (isNaN(nbrBall) || nbrBall < 1) {
        nbBall.nb = 1;
        document.getElementById('nbr-input-ball').value = 1;
    } else if (nbrBall > 5) {
        nbBall.nb = 5;
        document.getElementById('nbr-input-ball').value = 5;
    } else {
        nbBall.nb = nbrBall;
    }
    let speed = getSpeed();
    let acc = getAcc();
    resetBalls(window.scene, window.balls, window.dirBalls, nbBall.nb, speed, acc);
}

function initStart(balls, game, points, dirBalls, scene) {
    game.isactive = true;
    game.needInit = true;        
    game.isPlaying = false;

    
    document.getElementById('alignment-container-points').style.display = 'block';
    document.getElementById('PPlayerOne').textContent = '0';
    document.getElementById('PPlayerTwo').textContent = '0';


    for (let i in points) {
        points[i] = 0;       
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
    // resetBalls(scene, balls, dirBalls, nbBall);
}

export function finishTournament(walls, players, balls, game) {
    document.getElementById('finishTournament').addEventListener('click', () => {
        game.isTournament = false;
        game.isPlaying = false;
        game.isactive = false;
        hideGame(walls, players, balls);
        document.getElementById('alignment-container-points').style.display = 'none';
        document.getElementById('PPlayerOne').textContent = '0';
        document.getElementById('PPlayerTwo').textContent = '0';
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
// document.addEventListener("DOMContentLoaded", function() {
//     const resetPasswordLink = document.getElementById('reset-password-link');
//     resetPasswordLink.addEventListener('click', function(event) {
//         event.preventDefault();
//         alert('Redirecting to password reset page...');
//         // You can replace the alert with an actual redirect:
//         // window.location.href = '/reset-password';
//     })
// });

//Load new image for avatar
// document.addEventListener("DOMContentLoaded", function() {
//     const uploadAvatarInput = document.getElementById('uploadAvatar');
//     const profilePicture = document.querySelector('.avatar-img');
//     const profileButton = document.getElementById("profileButton");

//     uploadAvatarInput.addEventListener('change', function() {
//         const file = uploadAvatarInput.files[0];

//         if (file) {
//             const reader = new FileReader();
//             reader.onload = function (e) {
//                 profilePicture.src = e.target.result;
//                 profileButton.innerHTML = `<img src="${e.target.result}" alt="Avatar" style="width: 30px; height: 30px; object-fit: cover; border-radius: 50%;">`;
//                 profileButton.classList.remove("btn-primary");
//                 profileButton.style.background = "transparent";
//                 profileButton.style.border = "none";
//             };
//             reader.readAsDataURL(file);
//         }
//     });
// });

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

// deleteUserAccount
document.addEventListener("DOMContentLoaded", function () {
    const deleteProfile = document.getElementById('delete-profile');
    const preliminaryStep = document.getElementById('preliminary-step');
    const mainContent = document.getElementById('main-content');
    const profileUser = document.getElementById('profileModal');

    function handleDeleteUser() {
        if (canvas) {
            canvas.style.display = "none";
            canvas.classList.remove('visible');
        }
        mainContent.style.display = 'none';
        profileUser.style.display = 'none';
        preliminaryStep.style.display = 'flex';

        // Reset the game state
        if (window.game) {
            window.game.isactive = false;
            window.game.isPlaying = false;
        }
    }
    deleteProfile.addEventListener('click', handleDeleteUser);
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
        event.preventDefault();
        this.click(); 
    }
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

export function checkNewTournament(game) {
    document.getElementById(`tournamentBtn`).addEventListener('click', () => {
        if (game.isTournament) {
            resetTournament();
        }
    });
}

export let moveUp = false;
export let moveDown = false;
let moveSpeed = 0.0035;

export function updatePlayerMouvement(players) {
    if (!players || !players[0]) {
        return;
    }
    if (moveUp && players[0].position.y < yLimit) {
        players[0].position.y += moveSpeed;
    } else if (moveDown && players[0].position.y > -yLimit) {
        players[0].position.y -= moveSpeed;
    }

    if (players[0].position.y > yLimit) players[0].position.y = yLimit;
    if (players[0].position.y < -yLimit) players[0].position.y = -yLimit;
 
    requestAnimationFrame(() => updatePlayerMouvement(players));
}

export function initMobileControls(players) {
    const btnUp = document.getElementById('mobile-play-left');
    const btnDown = document.getElementById('mobile-play-right');
    btnUp.addEventListener('touchstart', (event) => {
        event.preventDefault();
        moveUp = true;
        updatePlayerMouvement(players);
    });
    btnUp.addEventListener('touchend', (event) => {
        event.preventDefault();
        moveUp = false;
    });
    
    btnDown.addEventListener('touchstart', (event) => {
        event.preventDefault();
        moveDown = true;
        updatePlayerMouvement(players);
    });
    btnDown.addEventListener('touchend', (event) => {
        event.preventDefault();
        moveDown = false;
    });
    btnUp.addEventListener('mousedown', (event) => {
        event.preventDefault();
        moveUp = true;
        updatePlayerMouvement(players);

    });
    btnUp.addEventListener('mouseup', (event) => {
        event.preventDefault();
        moveUp = false;
    });
    btnDown.addEventListener('mousedown', (event) => {
        event.preventDefault();
        moveDown = true;
        updatePlayerMouvement(players);
    });
    btnDown.addEventListener('mouseup', (event) => {
        event.preventDefault();
        moveDown = false;
    });
    // requestAnimationFrame(() => updatePlayerMouvement(players));

}

document.addEventListener('DOMContentLoaded', () => {
    document.getElementById('profileModal').addEventListener('show.bs.modal', getFriend);
});

document.querySelector('.btn-primary.mt-3').addEventListener('click', () => {
    document.getElementById('uploadAvatar').click();
});

document.addEventListener("DOMContentLoaded", function() {
    const premilinaryStep = document.getElementById('preliminary-step');
    const mainContent = document.getElementById('main-content');
    const canvas = document.getElementById('bg');

    function showPreliminaryStep() {
        premilinaryStep.style.display = 'flex';
        mainContent.style.display = 'none';
        if (canvas) {
            canvas.style.display = "none";
            canvas.classList.remove('visible');
        }
        // Reset the game state
        if (window.game) {
            window.game.isactive = false;
            window.game.isPlaying = false;
        }
        const Icon = document.getElementById("tournament-icon");
        Icon.style.display = "none";
    }
    function showMainContent() {
        premilinaryStep.style.display = 'none';
        mainContent.style.display = 'block';
        if (canvas) {
            canvas.style.display = "block";
            canvas.classList.add('visible');
        }
        // Reset the game state
        if (window.game) {
            window.game.isactive = true;
            window.game.isPlaying = true;
        }
        const Icon = document.getElementById("tournament-icon");
        Icon.style.display = "none";
    }

    const validateOtpButton = document.getElementById('validate-otp-btn');
    const logoutButton = document.getElementById('logoutModal');

    validateOtpButton.addEventListener('click', () => {
        history.pushState({ page: 'main' }, '', '#main-content');
    });

    logoutButton.addEventListener('click', () => {
        history.pushState({ page: 'preliminary' }, '', '#preliminary-step');
    });

    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page === 'main') {
            showMainContent();
        } else {
            showPreliminaryStep();
        }
    });

    if (window.location.hash === '#main-content') {
        showMainContent();
    } else {
        showPreliminaryStep();
    }
});

// document.addEventListener("DOMContentLoaded", () => {
//     const modals = document.querySelectorAll('.modal');

//     modals.forEach(modal => {
//         modal.addEventListener('show.bs.modal', () => {
//             const inputs = modal.querySelectorAll('input');
//             inputs.forEach(input => input.value = '');
//             const checkboxes = modal.querySelectorAll('input[type=>"checkbox"]');
//             checkboxes.forEach(checkbox => checkbox.checked = false);
//         });
//     });
// });
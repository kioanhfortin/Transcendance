import { resetBallSettings } from './ball';
import { hideGame } from './utils';
import { setDifficultyAIplayer } from './game.js';

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
export function restart(ball, game, points, realPoints, dirBall) {
    document.getElementById('restart').addEventListener('click', () => {
        initStart(ball, game, points, realPoints, dirBall);
        document.getElementById('start').style.display = 'block';
        document.getElementById('restart').style.display = 'none';
    });
    document.getElementById('start-tournament').addEventListener('click', () => {
        initStart(ball, game, points, realPoints, dirBall);
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
        if (isNaN(difficulty) || difficulty < 1) {
            difficulty = 1;
            document.getElementById('difficulty-input-ai').value = 1;
        } else if (difficulty > 50) {
            difficulty = 50;
            document.getElementById('difficulty-input-ai').value = 50;
        }
        setDifficultyAIplayer(difficulty);
        console.log("AI Difficulty updated to:", difficulty);
    });
}

function initStart(ball, game, points, realPoints, dirBall) {
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
    const randomNumber = Math.floor(Math.random() * 2) + 1;
    randomNumber == 1 ? dirBall.x = 1 : dirBall.x = -1;
    dirBall.y = 1;
    resetBallSettings(dirBall);
    ball.position.set(0,0,0);
}

export function finishTournament(walls, players, ball, game, realPoints) {
    document.getElementById('finishTournament').addEventListener('click', () => {
        game.isTournament = false;
        game.isPlaying = false;
        game.isactive = false;
        hideGame(walls, players, ball);
        realPoints[0].playerOne.visible = false;
        realPoints[0].playerTwo.visible = false;
    });
}


document.addEventListener("DOMContentLoaded", function () {
    const validateLoginButton = document.getElementById('validate-btn-login');
    const validateRegisterButton = document.getElementById('validate-btn-register');
    const preliminaryStep = document.getElementById('preliminary-step');
    const mainContent= document.getElementById('main-content');
    
    function showMainContent() {
        preliminaryStep.style.display = 'none';
        mainContent.style.display = 'block';

        const modalInstance = bootstrap.Modal.getInstance(document.querySelector('.modal.show'));
        if (modalInstance) {
            modalInstance.hide();
        }
        const backdrop = document.querySelector('.modal-backdrop');
        if (backdrop) {
            backdrop.remove();
        }
    }
    validateLoginButton.addEventListener('click', showMainContent);
    validateRegisterButton.addEventListener('click', showMainContent);
});

document.addEventListener("DOMContentLoaded", function () {
    const logoutButton = document.getElementById('logoutModal');
    const preliminaryStep = document.getElementById('preliminary-step');
    const mainContent= document.getElementById('main-content');

    logoutButton.addEventListener('click', function() {
        const activeModal = document.querySelector('.modal.show');
        if (activeModal) {
            activeModal.classList.remove('show');
            activeModal.style.display = 'none';
            document.body.classList.remove('modal-open');
            const backdrop = document.querySelector('.modal-backdrop');
            if (backdrop)
                backdrop.remove();
        }
        preliminaryStep.style.display = 'block';
        mainContent.style.display = 'none';
    });
});

document.getElementById("logoutModal").addEventListener("click", function () {

    const preliminaryStep = document.getElementById("preliminary-step");
    const mainContent = document.getElementById("main-content");


    if (window.game && window.game.isPlaying) {
        console.log("Cannot logout during an active game.");
        return; // Empêche le logout si une partie est en cours
    }
    if (canvas) {
        canvas.style.display = "none";
    }
    if (preliminaryStep) {
        preliminaryStep.style.display = "flex";
    }
    if (mainContent) {
        mainContent.style.display = "none";
    }
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
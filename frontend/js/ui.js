import { resetBallSettings } from './ball';

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
    });
}

// enleve les bouton start et restart au loading
export function startRestart() {
    window.onload = () => {
        document.getElementById('startRestart').style.display = 'none';
    };
}

// get the speed and the acceleration of the ball
export function setSpeedAcc(dirBall) {
    document.getElementById('validate-btn').addEventListener('click', () => {
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

// side bar menu 
// export function sideBarMenu() {
//     document.getElementById('validate-btn').addEventListener('click', () => {
//     });
// }



// cache le menu une fois cliquer sur un des menus genre single player..... etc
function typeGame(game) {
    game.isactive = true;
    game.needInit = true;
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    canvas.classList.add('visible');

    document.getElementById('startRestart').style.display = 'block';
}

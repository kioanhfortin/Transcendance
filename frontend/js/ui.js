import { resetBallSettings } from './ball';

const menu = document.getElementById('menu');
const canvas = document.getElementById('bg');

export function singlePlayer(game) {
    document.getElementById('singlePlayer').addEventListener('click', () => {
        game.isSinglePlayer = true;
        typeGame(game);
    });
}

export function multiPlayer(game) {
    document.getElementById('multiPlayer').addEventListener('click', () => {
        game.isSinglePlayer = false;
        typeGame(game);
    });
}

export function start(game) {
    document.getElementById('start').addEventListener('click', () => {
        game.isPlaying = true;
    });
}

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

export function startRestart() {
    window.onload = () => {
        document.getElementById('startRestart').style.display = 'none';
    };
}

function typeGame(game) {
    game.isactive = true;
    game.needInit = true;
    document.getElementById('menu').style.display = 'none';
    canvas.style.display = 'block';
    canvas.classList.add('visible');

    document.getElementById('startRestart').style.display = 'block';
}
import { resetBallSettings } from './ball';
import { resetGame } from './game'

const menu = document.getElementById('menu');
const canvas = document.getElementById('bg');



export function singlePlayer(game) {
    document.getElementById('singlePlayer').addEventListener('click', () => {
        game.isSinglePlayer = true;
        game.isactive = true;
        game.needInit = true;
        document.getElementById('menu').style.display = 'none';
        canvas.style.display = 'block';
        canvas.classList.add('visible');

        document.getElementById('startRestart').style.display = 'block';
    });
}

export function multiPlayer(game) {
    document.getElementById('multiPlayer').addEventListener('click', () => {
        game.isSinglePlayer = false;
        game.isactive = true;
        game.needInit = true;
        document.getElementById('menu').style.display = 'none';
        canvas.style.display = 'block';
        canvas.classList.add('visible');

        document.getElementById('startRestart').style.display = 'block';
    });
}

export function start(game) {
    document.getElementById('start').addEventListener('click', () => {
        game.isPlaying = true;
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
	    points.playerOne = 0;
	    points.playerTwo = 0;
        realPoints[0].playerOne.visible = true;
	    realPoints[0].playerTwo.visible = true;
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
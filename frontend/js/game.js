import { playerControl } from './PlayerCtrl' //a enlever sest jsute pour appuyer sur t
import { initPlayer, createGameBall, createGameLimit } from './init'
import { setBallPos } from './utils';
import { showGame, hideGame } from './utils';
import * as THREE from 'three';
import { ballMouvement, ballSettings, resetBallSettings } from './ball'
import * as display from './ui'
import { newGame, removeLoser } from './tournament'
import { initMobileControls } from './ui.js';
import { updateStatsGameMode } from './update-stats.js'
import { updateStatus } from './updateStatus.js'

let lastAIUpdate = 0;
export let nbBall = {nb : 1};	
window.balls = [];
window.dirBalls = [];
window.game = null;
let difficultyAI = 10;

export function getDifficultyAI() {
	return difficultyAI;
}

export function setDifficultyAIplayer(newDifficulty) {
	difficultyAI = newDifficulty;
}

// MAIN LOOP GAME
export function Game(game, keys, scene, camera) {
	if (!game.isactive) {
		game.isactive = true;
	}

	// init les items de jeux
	let walls = createGameLimit(scene, camera);
	let players = initPlayer(scene);
	initMobileControls(players);

	let balls = [];
	let dirBalls = [];
	window.balls = balls;
	window.dirBalls = dirBalls;
	window.scene = scene;
	let points = {playerOne: 0, playerTwo: 0, lastScorer: 1};
	
	for(let i = 0; i < nbBall.nb; i++) {
		const newBall = createGameBall(scene);
		balls.push(newBall);
		dirBalls.push({
			x: Math.random() < 0.5 ? -1 : 1,
			y: Math.random() < 0.5 ? -1 : 1,
			xSpeed: 0.4,
			ySpeed: 0.4,
			acceleration: 0.1,
			xSpeedOrigin: 0.4,
			ySpeedOrigin: 0.4,
		});
	}
	// vitess inital et acceleration 
	balls.forEach((ball, index) => {
		const dirBall = dirBalls[index];
		ballSettings(0.4, 0.1, dirBall);
	});

	hideGame(walls, players, balls);

	// tout les bouton de ui start restart menu.....
	UiAll(game, balls, points, dirBalls, difficultyAI, walls, players, scene);

	// fameuse loop
	function gameLoop(timestamp) {
		// console.log("Game loop running, players' positions:", players.map(p => p.position.y));
		// game need init est changer lorsque on appui sur le bouton restart ou start
		// la fonction startGame change initalise le tout, les points, montre le jeux, etc..
		if (game.needInit)
			StartGame(game, walls, players, balls, camera, dirBalls);
			//repositionne balls
		// si le jeux est entrin de jouer les players control sont activer, la ball bouge, et regarde si score
		else if (game.isPlaying)
		{
			playerControl(players, keys, game, balls, camera, lastAIUpdate, timestamp);
			// detect les collision avec les joueur ici
			ballMouvement(balls, players, dirBalls, game.isFourPlayer);
			// check si la balle est rendu a un endroit hors du jeux et mets le points a la sois dite personne ou equipe aillant marquer
			if (hasScored(camera, balls, points))
				resetRound(balls, points, game, dirBalls); // set tout les points a 0, remet la ball au centre
				//repositionne balls
			// si un joueur a fait 3 points la game arrete a changer au desir!
			const maxPoints = 3;
			if (points.playerOne == maxPoints || points.playerTwo == maxPoints || points.playerThree == maxPoints || points.playerFour == maxPoints)
				resetGame(walls, players, balls, game, points);
				//recreate balls
		}
		requestAnimationFrame(gameLoop);
	}
	gameLoop();
}

// regarde si la ball a depenser les boundary et assigne le points
function hasScored(camera, balls, points) {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

	const distanceScored = 35;
	const distanceY = 25;
	let scored = false;
	for(let ball in balls ) {
		const toObject = new THREE.Vector3().subVectors(balls[ball].position, camera.position);
		const crossProduct = new THREE.Vector3().crossVectors(cameraDirection, toObject);
		if (crossProduct.y > distanceScored) {
            points.playerTwo += 1;
            points.lastScorer = 2;
            scored = true;
        } else if (crossProduct.y < -distanceScored) {
            points.playerOne += 1;
            points.lastScorer = 1;
            scored = true;
        }
        if (balls[ball].position.y > distanceY) {
            points.playerOne += 1;
            points.lastScorer = 1;
            scored = true;
        } else if (balls[ball].position.y < -distanceY) {
            points.playerTwo += 1;
            points.lastScorer = 2;
            scored = true;
        }
		if (scored)
			return scored;
	}
	// return scored;
}

export function resetBalls(scene, balls, dirBalls, nbBall, speed, acc) {
	balls.forEach(ball => {
        if (ball) {
            if (ball.geometry) ball.geometry.dispose();
            if (ball.material) ball.material.dispose();
        }
    });

    balls.length = 0;
    dirBalls.length = 0;

    for (let i = 0; i < nbBall; i++) {
        const newBall = createGameBall(scene);
        balls.push(newBall);
        dirBalls.push({
            x: Math.random() < 0.5 ? -1 : 1,
            y: Math.random() < 0.5 ? -1 : 1,
            xSpeed: speed,
            ySpeed: speed,
            acceleration: acc,
            xSpeedOrigin: speed,
            ySpeedOrigin: speed,
        });
    }

    // balls.forEach((ball, index) => {
    //     const dirBall = dirBalls[index];
    //     ballSettings(0.4, 0.1, dirBall);
    // });
}


// reset tous a 0 et cache le jeux
export function resetGame(walls, players, balls, game, points) {
    game.isPlaying = false;
	document.getElementById('PPlayerOne').textContent = '0';
	document.getElementById('PPlayerTwo').textContent = '0';

	// resetBalls(scene, balls, dirBalls, nbBall);
	if (game.isTournament) {
		removeLoser(points.lastScorer);
		newGame();
	}
	else {
		updateStatsGameMode(game, points);
		updateStatus('isIngame', 'false');
		game.isactive = false;
		hideGame(walls, players, balls, game);
		document.getElementById('start').style.display = 'none';
		document.getElementById('restart').style.display = 'none';
		document.getElementById('menu').style.display = 'block';
		document.getElementById('alignment-container-points').style.display = 'none';

		game.isFourPlayer = false;
	}
	points.playerOne = 0;
	points.playerTwo = 0;
	points.lastScorer = 0;

}

// change le point reel 3d et remet la ball en place avec settings inital
function resetRound(balls, points, game, dirBalls) {
	game.isPlaying = false;

	balls.forEach((ball, index) => { 
		const dirBall = dirBalls[index];

		points.lastScorer == 2 ? (dirBall.x = -1) : (dirBall.x = 1); 
		dirBall.y = Math.random() < 0.5 ? -1 : 1;
		resetBallSettings(dirBall);
		setBallPos(ball, points.lastScorer);
	});

	setPoints(points);
	document.getElementById('start').style.display = 'block';
	document.getElementById('restart').style.display = 'none';
}

// prepare le debut de la game
export function StartGame(game, walls, players, balls, camera, dirBalls) {
	updateStatus('isIngame', 'true');
	game.needInit = false;
	balls.forEach((ball, index) => {
		const dirBall = dirBalls[index];
		const randomNumber = Math.floor(Math.random() * 2) + 1;
		randomNumber == 1 ? dirBall.x = 1 : dirBall.x = -1;
		dirBall.y = 1;
	});
	showGame(walls, players, balls, camera, game.isFourPlayer);
}

// change les points quand une equipe a fait des points
function setPoints(points) {
	switch(points.lastScorer) {
		case 1:
			document.getElementById('PPlayerOne').textContent = points.playerOne;
		break;
		case 2:
			document.getElementById('PPlayerTwo').textContent = points.playerTwo;
		break;
	}
}

function UiAll(game, balls, points, dirBalls, difficultyAI, walls, players, scene) {
	display.restart( balls, game, points, dirBalls, scene);
    display.start(game);
	display.finishTournament(walls, players, balls, game, );
	display.logout(points, game, walls, players, balls);
	display.checkNewTournament(game);
	display.SaveSettings(difficultyAI, nbBall);
}

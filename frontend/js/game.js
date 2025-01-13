import { playerControl } from './PlayerCtrl' //a enlever sest jsute pour appuyer sur t
import { initPlayer, createGameBall, createGameLimit, createPoints } from './init'
import { setBallPos } from './utils';
import { showGame, hideGame } from './utils';
import * as THREE from 'three';
import { ballMouvement, ballSettings, resetBallSettings } from './ball'
import * as display from './ui'
import { newGame, removeLoser } from './tournament'
import { initMobileControls } from './ui.js';
import { updateStatsGameMode } from '../api/update-stats.js'
import { updateStatus } from '../api/updateStatus.js'


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
	let realPoints = createPoints(scene);
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
	UiAll(game, balls, points, realPoints, dirBalls, difficultyAI, walls, players, scene);

	// fameuse loop
	function gameLoop(timestamp) {
		// console.log("Game loop running, players' positions:", players.map(p => p.position.y));
		// game need init est changer lorsque on appui sur le bouton restart ou start
		// la fonction startGame change initalise le tout, les points, montre le jeux, etc..
		if (game.needInit)
			StartGame(game, walls, players, balls, camera, realPoints, dirBalls);
			//repositionne balls
		// si le jeux est entrin de jouer les players control sont activer, la ball bouge, et regarde si score
		else if (game.isPlaying)
		{
			playerControl(players, keys, game, balls, camera, lastAIUpdate, timestamp);
			// detect les collision avec les joueur ici
			ballMouvement(balls, players, dirBalls, game.isFourPlayer);
			// check si la balle est rendu a un endroit hors du jeux et mets le points a la sois dite personne ou equipe aillant marquer
			if (hasScored(camera, balls, points))
				resetRound(balls, points, game, realPoints, dirBalls); // set tout les points a 0, remet la ball au centre
				//repositionne balls
			// si un joueur a fait 3 points la game arrete a changer au desir!
			const maxPoints = 3;
			if (points.playerOne == maxPoints || points.playerTwo == maxPoints || points.playerThree == maxPoints || points.playerFour == maxPoints)
				resetGame(walls, players, balls, game, points, realPoints);
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

export function resetBalls(scene, balls, dirBalls, nbBall) {
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
            xSpeed: 0.4,
            ySpeed: 0.4,
            acceleration: 0.1,
            xSpeedOrigin: 0.4,
            ySpeedOrigin: 0.4,
        });
    }

    balls.forEach((ball, index) => {
        const dirBall = dirBalls[index];
        ballSettings(0.4, 0.1, dirBall);
    });
}


// reset tous a 0 et cache le jeux
export function resetGame(walls, players, balls, game, points, realPoints) {
    game.isPlaying = false;
	game.isFourPlayer = false;
	if (points.playerOne != 3)
		realPoints[points.playerOne].playerOne.visible = false;
	if (points.playerTwo != 3)
		realPoints[points.playerTwo].playerTwo.visible = false;
	updateStatsGameMode(game, points);
	// resetBalls(scene, balls, dirBalls, nbBall);
	if (game.isTournament) {
		removeLoser(points.lastScorer);
		newGame();
		for (let i in realPoints[0]) 
			realPoints[0][i].visible = true;
	}
	else {
		updateStatus('isIngame', 'false');
		game.isactive = false;
		hideGame(walls, players, balls, game);
		document.getElementById('start').style.display = 'none';
		document.getElementById('restart').style.display = 'none';
		document.getElementById('menu').style.display = 'block';
	}
	points.playerOne = 0;
	points.playerTwo = 0;
	points.lastScorer = 0;

}

// change le point reel 3d et remet la ball en place avec settings inital
function resetRound(balls, points, game, realPoints, dirBalls) {
	game.isPlaying = false;

	balls.forEach((ball, index) => { 
		const dirBall = dirBalls[index];

		points.lastScorer == 2 ? (dirBall.x = -1) : (dirBall.x = 1); 
		dirBall.y = Math.random() < 0.5 ? -1 : 1;
		resetBallSettings(dirBall);
		setBallPos(ball, points.lastScorer);
	});

	setPoints(points, realPoints);
	document.getElementById('start').style.display = 'block';
	document.getElementById('restart').style.display = 'none';
}

// prepare le debut de la game
export function StartGame(game, walls, players, balls, camera, realPoints, dirBalls) {
	updateStatus('isIngame', 'true');
	game.needInit = false;
	balls.forEach((ball, index) => {
		const dirBall = dirBalls[index];
		const randomNumber = Math.floor(Math.random() * 2) + 1;
		randomNumber == 1 ? dirBall.x = 1 : dirBall.x = -1;
		dirBall.y = 1;
	});
	showGame(walls, players, balls, camera, realPoints, game.isFourPlayer);
}

// change les points quand une equipe a fait des points
function setPoints(points, realPoints) {
	function set(i, player) {
		realPoints[i - 1][player].visible = false;
		if (i != 3)
			realPoints[i][player].visible = true;
	}
	switch(points.lastScorer) {
		case 1:
			set(points.playerOne, "playerOne");
		break;
		case 2:
			set(points.playerTwo, "playerTwo");
		break;
	}
}

function UiAll(game, balls, points, realPoints, dirBalls, difficultyAI, walls, players, scene) {
	display.restart( balls, game, points, realPoints, dirBalls, scene);
    display.start(game);
	display.setSpeedAcc(dirBalls);
	display.finishTournament(walls, players, balls, game, realPoints);
	display.setDifficultyAI(difficultyAI);
	display.logout(realPoints, points, game, walls, players, balls);
	display.checkNewTournament(game);
	display.setNbBall(nbBall, scene);
}

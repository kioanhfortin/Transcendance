import { playerControl } from './PlayerCtrl' //a enlever sest jsute pour appuyer sur t
import { initPlayer, createGameBall, createGameLimit, createPoints } from './init'
import { setBallPos } from './utils';
import { showGame, hideGame } from './utils';
import * as THREE from 'three';
import { ballMouvement, ballSettings, resetBallSettings } from './ball'
import * as display from './ui'

let dirBall = {
	x: -1, y: 1, xSpeed: 1, ySpeed: 1, acceleration: 1,
	xSpeedOrigin:1, ySpeedOrigin:1
};

// MAIN LOOP GAME
export function Game(game, keys, scene, camera) {

	// init les items de jeux
	let walls = createGameLimit(scene, camera);
	let players = initPlayer(scene);
	let ball = createGameBall(scene);
	let realPoints = createPoints(scene);
	let points = {playerOne: 0, playerTwo: 0, lastScorer: 1};

	// vitess inital et acceleration 
	ballSettings(0.4, 0.1, dirBall);
	hideGame(walls, players, ball);
	// les bouton de start et restart
	display.restart( ball, game, points, realPoints, dirBall);
    display.start(game);

	// fameuse loop
	function gameLoop() {
		// game need init est changer lorsque on appui sur le bouton restart ou start
		// la fonction startGame change initalise le tout, les points, montre le jeux, etc..
		if (game.needInit)
			StartGame(game, walls, players, ball, camera, realPoints);
		// si le jeux est entrin de jouer les players control sont activer, la ball bouge, et regarde si score
		else if (game.isPlaying)
		{
			playerControl(players, keys, game, ball, camera);
			// detect les collision avec les joueur ici
			ballMouvement(ball, players, dirBall, game.isFourPlayer);
			// check si la balle est rendu a un endroit hors du jeux et mets le points a la sois dite personne ou equipe aillant marquer
			if (hasScored(camera, ball, points))
				resetRound(ball, points, game, realPoints); // set tout les points a 0, remet la ball au centre
			// si un joueur a fait 3 points la game arrete a changer au desir!
			const maxPoints = 3
			if (points.playerOne == maxPoints || points.playerTwo == maxPoints || points.playerThree == maxPoints || points.playerFour == maxPoints)
				resetGame(walls, players, ball, game, points, realPoints);
		}
		requestAnimationFrame(gameLoop);
	}
	gameLoop();
}

// regarde si la ball a depenser les boundary et assigne le points
function hasScored(camera, ball, points) {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const toObject = new THREE.Vector3().subVectors(ball.position, camera.position);
    const crossProduct = new THREE.Vector3().crossVectors(cameraDirection, toObject);
	const distanceScored = 35;
	const distanceY = 25;
	crossProduct.y > distanceScored ? (points.playerTwo += 1, points.lastScorer = 2) :
		crossProduct.y < -distanceScored ? (points.playerOne += 1, points.lastScorer = 1) : false;
	
	ball.position.y > distanceY ? (points.playerOne += 1, points.lastScorer = 1) :
		ball.position.y < -distanceY ? 	(points.playerTwo += 1, points.lastScorer = 2) : false;

	return crossProduct.y > distanceScored || crossProduct.y < -distanceScored || ball.position.y > distanceY || ball.position.y < -distanceY;
}

// reset tous a 0 et cache le jeux
export function resetGame(walls, players, ball, game, points, realPoints) {
	game.isactive = false;
    game.isPlaying = false;
	realPoints[points.playerOne].playerOne.visible = false;
	realPoints[points.playerTwo].playerTwo.visible = false;
	points.playerOne = 0;
	points.playerTwo = 0;
	hideGame(walls, players, ball, game);
}

// change le point reel 3d et remet la ball en place avec settings inital
function resetRound(ball, points, game, realPoints) {
	points.lastScorer == 2 ? dirBall.x = -1 : dirBall.x = 1; 
	dirBall.y = 1;
	game.isPlaying = false;
	resetBallSettings(dirBall);
	setPoints(points, realPoints);
	setBallPos(ball, points.lastScorer);
}

// prepare le debut de la game
export function StartGame(game, walls, players, ball, camera, realPoints) {
		game.needInit = false
		const randomNumber = Math.floor(Math.random() * 2) + 1;
		randomNumber == 1 ? dirBall.x = 1 : dirBall.x = -1;
		dirBall.y = 1;
		showGame(walls, players, ball, camera, realPoints, game.isFourPlayer);
}

// change les points quand une equipe a fait des points
function setPoints(points, realPoints) {
	function set(i, player) {
		realPoints[i - 1][player].visible = false;
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


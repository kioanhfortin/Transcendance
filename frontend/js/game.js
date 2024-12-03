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
export function Game(game, keys, scene, camera) {

	let walls = createGameLimit(scene, camera);
	let players = initPlayer(scene, game);
	let ball = createGameBall(scene, camera);
	let realPoints = createPoints(scene);
	let points = {playerOne: 0, playerTwo: 0, playerThree:0, playerFour:0, lastScorer: 1};

	ballSettings(0.4, 0.1, dirBall);
	hideGame(walls, players, ball);
	display.restart( ball, game, points, realPoints, dirBall);
    display.start(game);

	function gameLoop() {
		if (game.needInit)
			StartGame(game, walls, players, ball, camera, realPoints);
		else if (game.isPlaying)
		{
			playerControl(players, keys, game, ball, camera);
			ballMouvement(ball, players, dirBall, game.isFourPlayer);
			if (hasScored(camera, ball, points))
				resetRound(ball, points, game, realPoints);
			if (points.playerOne == 3 || points.playerTwo == 3 || points.playerThree == 3 || points.playerFour == 3)
				resetGame(walls, players, ball, game, points, realPoints);
		}
		requestAnimationFrame(gameLoop);
	}
	gameLoop();
}

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

export function resetGame(walls, players, ball, game, points, realPoints) {
	game.isactive = false;
    game.isPlaying = false;
	realPoints[points.playerOne].playerOne.visible = false;
	realPoints[points.playerTwo].playerTwo.visible = false;
	points.playerOne = 0;
	points.playerTwo = 0;
	hideGame(walls, players, ball, game);
}

function resetRound(ball, points, game, realPoints) {
	points.lastScorer == 2 ? dirBall.x = -1 : dirBall.x = 1; 
	dirBall.y = 1;
	game.isPlaying = false;
	resetBallSettings(dirBall);
	setPoints(points, realPoints);
	setBallPos(ball, points.lastScorer);
}

export function StartGame(game, walls, players, ball, camera, realPoints) {
		game.needInit = false
		const randomNumber = Math.floor(Math.random() * 2) + 1;
		randomNumber == 1 ? dirBall.x = 1 : dirBall.x = -1;
		dirBall.y = 1;
		showGame(walls, players, ball, camera, realPoints, game.isFourPlayer);
}

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
		case 3:
			set(points.playerThree, "playerThree");
		break;
		case 4:
			set(points.playerFour, "playerFour");
    	break;
	}

}


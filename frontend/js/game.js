import { startGame, playerControl, pressStart } from './PlayerCtrl' //a enlever sest jsute pour appuyer sur t
import { initPlayer, createGameBall, createGameLimit } from './init'
import { setBallPos } from './utils';
import { showGame, hideGame } from './utils';
import * as THREE from 'three';
import { ballMouvement } from './ball'

let dirBall = {x: -0.2, y: 0.2};

export function Game(game, keys, scene, camera) {
	console.log(camera instanceof THREE.PerspectiveCamera);
	let walls = createGameLimit(scene, camera);
	let players = initPlayer(scene, camera);
	let ball = createGameBall(scene, camera);
	// last scorer 1 for player one et 2 player two
	let points = {playerOne: 0, playerTwo: 0, lastScorer: 1};
	hideGame(walls, players, ball, game);

	// faire une fonction nested a cause des truc declarer
	function gameLoop() {
		if (!game.isactive)
			checkStartGame(game, keys, walls, players, ball, camera);
		else if (game.isactive && !game.isPlaying)
			game.isPlaying = pressStart(keys);
		else
		{
			playerControl(players, keys, game, ball);
			ballMouvement(ball, players, dirBall);
			if (hasScored(camera, ball, points))
				resetRound(ball, points, game);
			if (points.playerOne == 3 || points.playerTwo == 3)
				resetGame(walls, players, ball, game, points)
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
	const distanceScored = 25;
	
	crossProduct.y > distanceScored ? (points.playerTwo += 1, points.lastScorer = 2) :
		crossProduct.y < -distanceScored ? (points.playerOne += 1, points.lastScorer = 1) : false;
	
	return crossProduct.y > distanceScored || crossProduct.y < -distanceScored;
}

export function resetGame(walls, players, ball, game, points) {
	game.isactive = false;
    game.isPlaying = false;
	points.playerOne = 0;
	points.playerTwo = 0;
	hideGame(walls, players, ball, game);
}

function resetRound(ball, points, game) {
	points.lastScorer == 2 ? dirBall.x = -0.2 : dirBall.x = 0.2; 
	dirBall.y = 0.2;
	game.isPlaying = false;
	setBallPos(ball, points.lastScorer);
}

function checkStartGame(game, keys, walls, players, ball, camera) {
	game.isactive = startGame(keys);
	if (game.isactive){
		const randomNumber = Math.floor(Math.random() * 2) + 1;
		randomNumber == 1 ? dirBall.x = 0.2 : dirBall.x = -0.2;
		dirBall.y = 0.2;
		showGame(walls, players, ball, camera);
	}
}
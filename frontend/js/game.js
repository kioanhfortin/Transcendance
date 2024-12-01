import { startGame, playerControl, pressStart } from './PlayerCtrl'
import { initPlayer, createGameBall, createGameLimit, createPoints } from './init'
import { setBallPos } from './utils';
import { showGame, hideGame } from './utils';
import * as THREE from 'three';
import { ballMouvement } from './ball'

let dirBall = {x: -0.2, y: 0.2};

export function Game(game, keys, scene, camera) {

	let walls = createGameLimit(scene, camera);
	let players = initPlayer(scene, camera);
	let ball = createGameBall(scene, camera);
	
	let realPoints = createPoints(scene);

	let points = {playerOne: 0, playerTwo: 0, lastScorer: 1};
	hideGame(walls, players, ball);

	// faire une fonction nested a cause des truc declarer
	function gameLoop() {


		if (!game.isactive)
			checkStartGame(game, keys, walls, players, ball, camera, realPoints);
		else if (game.isactive && !game.isPlaying)
			game.isPlaying = pressStart(keys);
		else
		{
			playerControl(players, keys, game, ball);
			ballMouvement(ball, players, dirBall);
			if (hasScored(camera, ball, points))
				resetRound(ball, points, game, realPoints);
			if (points.playerOne == 3 || points.playerTwo == 3)
				resetGame(walls, players, ball, game, points, realPoints)
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
	
	crossProduct.y > distanceScored ? (points.playerTwo += 1, points.lastScorer = 2) :
		crossProduct.y < -distanceScored ? (points.playerOne += 1, points.lastScorer = 1) : false;
	
	return crossProduct.y > distanceScored || crossProduct.y < -distanceScored;
}

function resetGame(walls, players, ball, game, points, realPoints) {
	game.isactive = false;
    game.isPlaying = false;
	realPoints[points.playerOne].playerOne.visible = false;
	realPoints[points.playerTwo].playerTwo.visible = false;
	points.playerOne = 0;
	points.playerTwo = 0;
	hideGame(walls, players, ball, game);
}

function resetRound(ball, points, game, realPoints) {
	points.lastScorer == 2 ? dirBall.x = -0.2 : dirBall.x = 0.2; 
	dirBall.y = 0.2;
	game.isPlaying = false;
	setPoints(points, realPoints);
	setBallPos(ball, points.lastScorer);
}

function checkStartGame(game, keys, walls, players, ball, camera, realPoints) {
	game.isactive = startGame(keys);
	if (game.isactive){
		const randomNumber = Math.floor(Math.random() * 2) + 1;
		randomNumber == 1 ? dirBall.x = 0.2 : dirBall.x = -0.2;
		dirBall.y = 0.2;
		showGame(walls, players, ball, camera, realPoints);
	}
}

function setPoints(points, realPoints) {
	if (points.lastScorer == 1)
	{
		realPoints[points.playerOne - 1].playerOne.visible = false;
		realPoints[points.playerOne].playerOne.visible = true;
	}
	else
	{
		realPoints[points.playerTwo - 1].playerTwo.visible = false;
		realPoints[points.playerTwo].playerTwo.visible = true;
	}
}


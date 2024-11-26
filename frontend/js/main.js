import '/assets/css/style.css'
import * as THREE from 'three';
import * as STARS from './stars'
import { startGame, playerControl } from './PlayerCtrl'
import { initScene, initPlayer, createGameBall, createGameLimit } from './init'
import { ballMouvement } from './game'


const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

let game = false;


document.addEventListener("DOMContentLoaded", function() {
    game = false;
});

//if the game is running
const keys = {};
const stars = [];
const matrix = new THREE.Matrix4();

initScene(scene, camera, renderer);

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;  // Mark the key as pressed
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;  // Mark the key as released
});

// use to rotate the cam 0.002 best
matrix.makeRotationY(0.002);
camera.applyMatrix4(matrix);

let players;
let ball;
// animate the scene like stars
function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
	if (!game) { camera.applyMatrix4(matrix); }
	STARS.animateStars(stars, scene, camera);
}
animate();
// when the game is running
function gameLoop() {
	if (!game) {game = startGame(keys);}
	if (game && !players && !ball)
	{
		console.log('bab');
		createGameLimit(scene, camera);
		players = initPlayer(scene, camera);
		ball = createGameBall(scene, camera);
	}
	if (game)
	{
		playerControl(players, keys);
		ballMouvement(ball, players);
	}

	requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

//create a flying stars every 5s (5000ml)
setInterval(() => {
    STARS.createFstar(scene, camera, '/assets/obj/star.stl', stars);
}, 5000);


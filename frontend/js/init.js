import * as THREE from 'three';
import * as STARS from './stars'
import { backgroundSkybox } from './skybox'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { cubeMaterial } from './utils';

// rgba(191, 23, 54, 1);

// init la scene de base les etoiles, skybox, camera pos, etc
export function initScene(scene, camera, renderer) {
	renderer.setPixelRatio(window.devicePixelRatio);
	// renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.setSize(700, 700);
	document.body.appendChild(renderer.domElement);

	camera.position.setZ(30);
	
	// add stars and the skybox
	STARS.manyStars(scene, '/assets/obj/star.stl');
	backgroundSkybox(scene);
}

// creer les joueurs
export function initPlayer(scene) {
	const players = [];
	const geometry = new THREE.BoxGeometry(0.5,8,0.5); 

	for (let i = 0; i < 4;i++) {
		const player = cubeMaterial(geometry);
		scene.add(player);
		players[i] = player;
		if (i === 2 || i === 3) {
			players[i].scale.set(0.5, 2, 3); // Paddles des côtés (gauche/droite)
        } else {
			players[i].scale.set(1,1,1.5);
        }
	}

	const distance = 18.5;
	players[2].position.y = distance;
	players[3].position.y = -distance;
	
	return players;
}

// creer les limits pour 1v1 et 2v2 
export function createGameLimit(scene, camera) {
	let walls = [];
	const geometry = new THREE.BoxGeometry(55,1,1.5);
	walls[0] = cubeMaterial(geometry);
	walls[1] = cubeMaterial(geometry);

	for (let i = 2; i < 6; i++)
		walls[i] = createDelimitation2V2();

	for (let i in walls)
		scene.add(walls[i]);

	if (camera.rotation.x != 0 && camera.rotation.y != 0)
	{
		walls[1].rotation.x = camera.rotation.x;
		walls[1].rotation.z = camera.rotation.z;
	}
	walls[1].rotation.y = camera.rotation.y;

	walls[0].position.y = 19;
	walls[1].position.y = -19;
	return walls;
}


function createDelimitation2V2() {
	const geometry = new THREE.BoxGeometry(0.5,4,1.5);
	const mesh = cubeMaterial(geometry);
	return mesh;
}

// creer la balle de jeux
export function createGameBall(scene) {
	// const geometry = new THREE.DodecahedronGeometry(0.5);
	const geometry = new THREE. IcosahedronGeometry(0.7);
	
	const ball = cubeMaterial(geometry);
	ball.scale.set(1.8,1,1);
	ball.velocity = new THREE.Vector3(0.2, 0.2, 0);
	scene.add(ball);
	
	// change on who starts with the ball
	return ball;
}




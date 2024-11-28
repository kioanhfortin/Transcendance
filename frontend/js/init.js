import * as THREE from 'three';
import * as STARS from './stars'
import { backgroundSkybox } from './skybox'

export function initScene(scene, camera, renderer) {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerWidth);

	document.body.appendChild(renderer.domElement);

	camera.position.setZ(30);

	// add stars and the skybox
	STARS.manyStars(scene, '/assets/obj/star.stl');
	backgroundSkybox(scene);
}

export function initPlayer(scene, camera) {
	const players = [];
	const geometry = new THREE.BoxGeometry(0.5,8,0.5); 
	const material = new THREE.MeshPhongMaterial({
		color: 0xD8D3E2,
		emissive: 0xD8D3E2,
		emissiveIntensity: 0.9,
		specular: 0xFFFFFF,
		shininess: 100,
	});
	const player = new THREE.Mesh(geometry, material);
	const playerTwo = new THREE.Mesh(geometry, material);

	scene.add(player);
	scene.add(playerTwo);

	players[0] = player;
	players[1] = playerTwo;


	return players;
}

export function createGameLimit(scene, camera) {
	let walls = [];
	const geometry = new THREE.BoxGeometry(35,0.2,0.5); 
	const material = new THREE.MeshPhongMaterial({
		color: 0xD8D3E2,
		emissive: 0xD8D3E2,
		emissiveIntensity: 0.9,
		specular: 0xFFFFFF,
		shininess: 100,
	});
	// 0 == le mur up et 1 == mur down
	walls[0] = new THREE.Mesh(geometry, material);
	walls[1] = new THREE.Mesh(geometry, material);

	scene.add(walls[0]);
	scene.add(walls[1]);

	if (camera.rotation.x != 0 && camera.rotation.y != 0)
	{
		walls[1].rotation.x = camera.rotation.x;
		walls[1].rotation.z = camera.rotation.z;
	}
	walls[1].rotation.y = camera.rotation.y;

	walls[0].position.y = 18;
	walls[1].position.y = -18;
	return walls;
}

export function createGameBall(scene, camera) {
	const geometry = new THREE.SphereGeometry(0.5, 32);
	const material = new THREE.MeshPhongMaterial({
		color: 0xD8D3E2,
		emissive: 0xD8D3E2,
		emissiveIntensity: 0.9,
		specular: 0xFFFFFF,
		shininess: 100,
	});
	const ball = new THREE.Mesh(geometry, material);
	scene.add(ball);
	// change on who starts with the ball
	return ball;
}

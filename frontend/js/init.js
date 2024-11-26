import * as THREE from 'three';
import * as STARS from './stars'
import { backgroundSkybox } from './skybox'

export function initScene(scene, camera, renderer) {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerWidth);

	document.body.appendChild(renderer.domElement);

	camera.position.setZ(30);

	// two horizontal bar
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


	player.position.x = (camera.position.z * -1) / 1.7;
	player.position.z = (camera.position.x * 1) / 1.7;

	playerTwo.position.x = (camera.position.z * 1) / 1.7;
	playerTwo.position.z = (camera.position.x * -1) / 1.7;

	player.rotation.y = camera.rotation.y;
	playerTwo.rotation.y = camera.rotation.y;

	players[0] = player;
	players[1] = playerTwo;


	return players;
}

export function createGameLimit(scene, camera) {
	const geometry = new THREE.BoxGeometry(35,0.2,0.5); 
	const material = new THREE.MeshPhongMaterial({
		color: 0xD8D3E2,
		emissive: 0xD8D3E2,
		emissiveIntensity: 0.9,
		specular: 0xFFFFFF,
		shininess: 100,
	});
	const up = new THREE.Mesh(geometry, material);
	const down = new THREE.Mesh(geometry, material);

	scene.add(up);
	scene.add(down);

	if (camera.rotation.x != 0 && camera.rotation.y != 0)
	{
		down.rotation.x = camera.rotation.x;
		down.rotation.z = camera.rotation.z;
	}
	down.rotation.y = camera.rotation.y;
	up.quaternion.copy(down.quaternion);

	up.position.y = 18;
	down.position.y = -18;
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
	ball.quaternion.copy(camera.quaternion);
	ball.translateX(10);
	return ball;
}

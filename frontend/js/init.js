import * as THREE from 'three';
import * as STARS from './stars'
import { backgroundSkybox } from './skybox'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';


export function initScene(scene, camera, renderer) {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerWidth);

	document.body.appendChild(renderer.domElement);

	camera.position.setZ(30);

	// createPoints(scene);
	// add stars and the skybox
	STARS.manyStars(scene, '/assets/obj/star.stl');
	backgroundSkybox(scene);
}

export function initPlayer(scene, game) {
	const players = [];
	const geometry = new THREE.BoxGeometry(0.5,8,0.5); 
	const material = new THREE.MeshPhongMaterial({
		color: 0xD8D3E2,
		emissive: 0xD8D3E2,
		emissiveIntensity: 0.9,
		specular: 0xFFFFFF,
		shininess: 100,
	});

	for (let i = 0; i != 4;i++) {
		const player = new THREE.Mesh(geometry, material);
		scene.add(player);
		players[i] = player;
	}
	players[2].scale.set(1,2,0.5);
	players[3].scale.set(1,2,0.5);

	return players;
}

export function createGameLimit(scene, camera) {
	let walls = [];
	const geometry = new THREE.BoxGeometry(55,0.2,0.5); 
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
	ball.scale.set(1.8,1,1);
	scene.add(ball);
	// change on who starts with the ball
	return ball;
}


let points = [];

function importNumber(scene, pathNumber) {
	const material = new THREE.MeshPhongMaterial({
		color: 0xD8D3E2,
		emissive: 0xD8D3E2,
		emissiveIntensity: 0.9,
		specular: 0xFFFFFF,
		shininess: 100,
	});
  
	const loader = new STLLoader();
	loader.load(pathNumber, function (geometry) {
	const nbr = {
		playerOne: new THREE.Mesh(geometry, material),
		playerTwo: new THREE.Mesh(geometry, material),
		// playerThree: new THREE.Mesh(geometry, material),
		// playerFour: new THREE.Mesh(geometry, material),
	};

	for (let key in nbr) {
		nbr[key].rotation.set(Math.PI / 2, 0, 0);      
	}

	for (let key in nbr) {
		scene.add(nbr[key]);        
	}
	
	for (let key in nbr) {
		nbr[key].visible = false;
	}
	  points.push(nbr);
	});
  }
  
  

  export function createPoints(scene) {
	const paths = [
		"/assets/obj/NUMBER0.stl",
		"/assets/obj/NUMBER1.stl",
		"/assets/obj/NUMBER2.stl",
		"/assets/obj/NUMBER3.stl",
	];

	paths.forEach((path) => {
		importNumber(scene, path);
	});
	return points;
  }




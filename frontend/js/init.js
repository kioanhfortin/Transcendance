import * as THREE from 'three';
import * as STARS from './stars'
import { backgroundSkybox } from './skybox'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';
import { cubeMaterial } from './utils';

// init la scene de base les etoiles, skybox, camera pos, etc
export function initScene(scene, camera, renderer) {
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth * 0.8, window.innerWidth * 0.8);
	document.body.appendChild(renderer.domElement);

	camera.position.set(0, 0, 30);
	camera.lookAt(0, 0, 0);

	// const aspectRatio = window.innerWidth / window.innerHeight;
	// const visibleHeight = 2 * Math.tan((camera.fov * Math.PI) / 360) * camera.position.z;
    // const visibleWidth = visibleHeight * SVGPreserveAspectRatio;
    
    // wall[0].position.y = visibleHeight;
    // wall[1].position.y = -visibleHeight;

    // players[2].position.y = visibleHeight - 1.5;
    // players[3].position.y = -visibleHeight + 1.5;
	// createPoints(scene);
	// add stars and the skybox
	STARS.manyStars(scene, '/assets/obj/star.stl');
	backgroundSkybox(scene);
}

function calculateVisibleBounds(camera) {
    const visibleHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    const visibleWidth = visibleHeight * camera.aspect;

    return { visibleHeight, visibleWidth };
}

// creer les joueurs
export function initPlayer(scene, camera, visibleHeight) {
	const players = [];
	const geometry = new THREE.BoxGeometry(0.5,8,0.5); 
	const material = new THREE.MeshPhongMaterial({
		color: 0xD8D3E2,
		emissive: 0xD8D3E2,
		emissiveIntensity: 0.9,
		specular: 0xFFFFFF,
		shininess: 100,
	});

	const { visibleWidth } = calculateVisibleBounds(camera);
	// camera.position.set(0, 0, 30);
	// camera.lookAt(0, 0, 0);
	const player = new THREE.Mesh(geometry, material);
	const playerTwo = new THREE.Mesh(geometry, material);
	
	
	for (let i = 0; i != 4;i++) {
		const player = cubeMaterial(geometry);
		scene.add(player);
		players[i] = player;
		players[i].scale.set(1,1,1.5);
	}
	
	players[0].position.set(-visibleWidth / 2 + 2, 0, 0);
    players[1].position.set(visibleWidth / 2 - 2, 0, 0);
	
	scene.add(player);
	scene.add(playerTwo);

	players.push(player, playerTwo);

	const distance = 18.5;
	players[2].scale.set(0.5,2,3);
	players[3].scale.set(0.5,2,3);
	players[2].position.y = distance;
	players[3].position.y = -distance;

	return players;
}



// creer les limits pour 1v1 et 2v2 
export function createGameLimit(scene, camera, visibleHeight) {
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

	// visibleHeight = camera.top || 19;
	walls[0].position.set(0, visibleHeight / 2 - 3, 0);  // Mur du haut
    walls[1].position.set(0, -visibleHeight / 2 + 3, 0); // Mur du bas
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


let points = [];

// load les stl pour la variable realPoints
function importNumber(scene, pathNumber) {
	const loader = new STLLoader();
	loader.load(pathNumber, function (geometry) {
	const nbr = {
		playerOne: cubeMaterial(geometry),
		playerTwo: cubeMaterial(geometry),
	};
	for (let key in nbr)
		nbr[key].scale.set(1,1,10); 

	for (let key in nbr)
		nbr[key].rotation.set(Math.PI / 2, 0, 0);      

	for (let key in nbr)
		scene.add(nbr[key]);        
	
	for (let key in nbr)
		nbr[key].visible = false;

	  points.push(nbr);
	});
}
  
  
// retournes les points
// points est un array avec chaque nombre 0 = le 0 en 3d.... 
// et chaque nombre a des proprieter qui equivaut a chaque joueur
// ex: points[0].playerOne
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




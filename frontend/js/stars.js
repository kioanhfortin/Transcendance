import * as THREE from 'three';
import {notLooking, getRandomValue, createRandomVec3, createRandomRot} from './starsH.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

export function animateStars(stars, scene, camera) {
	stars.forEach((star, index) => {
		
		star.material.opacity = Math.random();
		if (index % 2 == 0)
			star.position.z -= 0.1;
		star.position.x -= 0.1;
		star.rotation.z -= 0.1;
		if ((star.position.x <= -101 || star.position.z <= -101) && notLooking(camera, star))
			deleteStar(scene, stars, star, index);
	});
}

function deleteStar(scene, stars, star, index) {
	scene.remove(star);
	if (star.geometry) star.geometry.dispose();
    if (star.material) {
        if (star.material.map) star.material.map.dispose();
        star.material.dispose();
    }
    if (index > -1) {
        stars.splice(index, 1);
    }
}

export function createFstar(scene, camera, pathStar, stars) {
	const loader = new STLLoader();
	loader.load(pathStar, function (geometry) {
		const material = new THREE.MeshPhongMaterial({
			color: 0xFFFF80,
			emissive: 0xFFFF80,
			emissiveIntensity: 0.9,
			specular: 0xFFFFFF,
			shininess: 100,
		  });
		const star = new THREE.Mesh(geometry, material);
		star.scale.set(2,2,2);
		scene.add(star);

		while (!notLooking(camera, star))
		star.position.set(
			getRandomValue(100, -100),
			getRandomValue(100, -100),
			getRandomValue(0, -500),
		)
		stars.push(star);
	});
}

export function importStar(scene, pathStar, position, rotation) {
	const loader = new STLLoader();
	loader.load(pathStar, function (geometry){
		const material = new THREE.MeshPhongMaterial({
			color: 0xFFFACD,
			emissive: 0xFFFFE0,
			emissiveIntensity: 0.9,
			specular: 0xFFFFFF,
			shininess: 100,
			});
		const star = new THREE.Mesh(geometry, material);
		star.position.copy(position);
		star.rotation.copy(rotation);
		scene.add(star);
	});
}

export function manyStars(scene, pathStar) {

	for (let i = 0; i < 750; ++i)
		importStar(scene, pathStar, createRandomVec3(), createRandomRot());
}
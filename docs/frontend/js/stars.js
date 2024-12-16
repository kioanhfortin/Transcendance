import * as THREE from 'three';
import {createRandomVec3, createRandomRot, randomFStarPos} from './starsH.js'
import { STLLoader } from 'three/examples/jsm/loaders/STLLoader.js';

// delete les etoiles et libere la memoire
export function deleteStar(scene, stars, star, index) {
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

// creer les etoiles filantes et leurs assignes une random position
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

		setInterval(() => {
			const star = new THREE.Mesh(geometry, material);
		star.scale.set(2,2,2);
		scene.add(star);

		randomFStarPos(camera, star, 5);
		star.rotation.copy(camera.rotation);
		
		stars.push(star);
		}, 5000);
		
	});
}

// load le stl
export function importStar(scene, position, rotation, geometry) {
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
}

// import toutes les petites etoiles
export function manyStars(scene, pathStar) {
	const loader = new STLLoader();

	loader.load(pathStar, function (geometry){
		for (let i = 0; i < 750; ++i)
			importStar(scene, createRandomVec3(), createRandomRot(), geometry);
	});
}
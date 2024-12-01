import * as THREE from 'three';
import { notLooking } from './utils';
import { deleteStar } from './stars';

export function animate(game, scene, camera, matrix, renderer, stars) {

    function animateLoop() {
        requestAnimationFrame(animateLoop);
        renderer.render(scene, camera);
        if (!game.isactive) { camera.applyMatrix4(matrix); }
        animateStars(stars, scene, camera);
    }
    animateLoop();
}

export function camRot(camera) {
    const matrix = new THREE.Matrix4();
    matrix.makeRotationY(0.003);
    camera.applyMatrix4(matrix);
    return matrix;
}

function animateStars(stars, scene, camera) {
	stars.forEach((star, index) => {
		star.material.opacity = Math.random();
		if (index % 2 == 0)
			star.position.z -= 0.1;
		star.position.x -= 0.1;
		star.rotation.z -= 0.1;
		if ((star.position.x <= -101 || star.position.z <= -101) && notLooking(camera, star) || (star.position.x <= -250 || star.position.z <= -250))
			deleteStar(scene, stars, star, index);
	});
}
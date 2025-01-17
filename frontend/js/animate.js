import * as THREE from 'three';
import { deleteStar } from './stars';

// export le rendu et anime les etoiles
export function animate(game, scene, camera, renderer, stars) {
    function animateLoop() {
        requestAnimationFrame(animateLoop);
        renderer.render(scene, camera);
        // if (!game.isactive) { camera.applyMatrix4(matrix); }
        animateStars(stars, scene, camera);
    }
    animateLoop();
}

// fait la rotation de la cams
// export function camRot(camera) {
//     const matrix = new THREE.Matrix4();
//     matrix.makeRotationY(0.003);
//     camera.applyMatrix4(matrix);
//     return matrix;
// }

// anime les etoiles filantes
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

// surtout pour les etoiles filante quand on regarder pas
function notLooking(camera, object, threshold = 0.5) {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const objectPosition = new THREE.Vector3();
    object.getWorldPosition(objectPosition);
    const toObject = objectPosition.clone().sub(camera.position).normalize();
    const dot = cameraDirection.dot(toObject);
    return dot < threshold; // Return true if not looking
}
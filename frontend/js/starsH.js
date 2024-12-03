import * as THREE from 'three';

export function getRandomValue(min, max) {
	return (Math.random() * (max - min) + min);
}

export function createRandomVec3() {
	const val = 200
	const randomPos = new THREE.Vector3(getRandomValue(-val, val), getRandomValue(-val, val), getRandomValue(-val, val));
	return randomPos;
}

export function createRandomRot()
{
	const rotation = new THREE.Euler(0, getRandomValue(0, 90), getRandomValue(0, 90));
	return rotation;
}

// random pos au etoiles
export function randomFStarPos(camera, star) {
    const cameraForward = new THREE.Vector3();
    camera.getWorldDirection(cameraForward);

    const cameraRight = new THREE.Vector3();
    cameraRight.copy(cameraForward).cross(camera.up).normalize();

    const leftDirection = cameraRight.negate();

		const position = camera.position.clone()
        .add(leftDirection.multiplyScalar(randomLeftOrRight())) // Move 10 units to the left of the camera
        .add(cameraForward.multiplyScalar(getRandomValue(5, 100))); // Move forward by a random distance
		position.y = getRandomValue(-50, 100);
    	star.position.copy(position);

}

function randomLeftOrRight() {
	return Math.random() < 0.5 ? 150 : -150
}
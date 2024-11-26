import * as THREE from 'three';

export function notLooking(camera, object, threshold = 0.5) {
    // Get the camera direction
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    // Get the position of the object
    const objectPosition = new THREE.Vector3();
    object.getWorldPosition(objectPosition);

    // Calculate the vector from the camera to the object
    const toObject = objectPosition.clone().sub(camera.position).normalize();

    // Calculate the dot product to find the angle
    const dot = cameraDirection.dot(toObject);
    
    // If the dot product is less than the threshold, the camera is not looking at the object
    return dot < threshold; // Return true if not looking
}

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
import * as THREE from 'three';

export function notLooking(camera, object, threshold = 0.5) {
    const cameraDirection = new THREE.Vector3();
    camera.getWorldDirection(cameraDirection);

    const objectPosition = new THREE.Vector3();
    object.getWorldPosition(objectPosition);
    const toObject = objectPosition.clone().sub(camera.position).normalize();
    const dot = cameraDirection.dot(toObject);
    return dot < threshold; // Return true if not looking
}

export function hideGame(walls, players, ball, game) {
	function setInvisible(obj) {
		obj.visible = false;
	}
	setInvisible(ball);
	players.forEach(setInvisible);
	walls.forEach(setInvisible);
}

export function showGame(walls, players, ball, camera) {
	function setVisible(obj) {
		obj.visible = true;
        obj.quaternion.copy(camera.quaternion);
	}
	setVisible(ball);
	players.forEach(setVisible);
	walls.forEach(setVisible);

    // qui commence avec la ball???
    setBallPos(ball, 0);

    players[0].position.x = (camera.position.z * -1) / 1.7;
	players[0].position.z = (camera.position.x * 1) / 1.7;

	players[1].position.x = (camera.position.z * 1) / 1.7;
	players[1].position.z = (camera.position.x * -1) / 1.7;
}

export function setBallPos(ball, wichPlayer) {
    ball.position.set(0, 0, 0);
    wichPlayer == 1 ? ball.translateX(-10) : wichPlayer == 2 ? ball.translateX(10) : false;
}
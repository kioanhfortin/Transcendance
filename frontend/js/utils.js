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

export function hideGame(walls, players, ball) {
	function setInvisible(obj) {
		obj.visible = false;
	}
	setInvisible(ball);
	players.forEach(setInvisible);
	walls.forEach(setInvisible);
}

export function showGame(walls, players, ball, camera, realPoints) {
	function setVisible(obj) {
		obj.visible = true;
        obj.quaternion.copy(camera.quaternion);
	}
	setVisible(ball);
	players.forEach(setVisible);
	walls.forEach(setVisible);

    // qui commence avec la ball???
    setBallPos(ball, 0);

	let offset = 1.8;
    players[0].position.x = (camera.position.z * -1);
	players[0].position.z = (camera.position.x * 1);
	players[1].position.x = (camera.position.z * 1);
	players[1].position.z = (camera.position.x * -1);


	
	realPoints.forEach((point) => {
		point.playerOne.position.x = (camera.position.z * -1) / offset;
		point.playerOne.position.z = (camera.position.x * 1) / offset;
		point.playerTwo.position.x = (camera.position.z * 1) / offset;
		point.playerTwo.position.z = (camera.position.x * -1) / offset;
		
		point.playerOne.lookAt(camera.position);
		point.playerOne.up.set(0, 1, 0);
		point.playerTwo.lookAt(camera.position);
		point.playerTwo.up.set(0, 1, 0);
	})
	realPoints[0].playerOne.visible = true;
	realPoints[0].playerTwo.visible = true;

}

export function setBallPos(ball, wichPlayer) {
    ball.position.set(0, 0, 0);
    wichPlayer == 1 ? ball.translateX(-10) : wichPlayer == 2 ? ball.translateX(10) : false;
}
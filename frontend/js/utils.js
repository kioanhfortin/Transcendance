import * as THREE from 'three';

// quand la game se termine tout cacher
export function hideGame(walls, players, ball) {
	function setInvisible(obj) {
		obj.visible = false;
	}
	setInvisible(ball);
	players.forEach(setInvisible);
	walls.forEach(setInvisible);
}

// sert a montrer les elements du jeux
export function showGame(walls, players, ball, camera, realPoints, isFourPlayer) {
	function setVisible(obj) {
		obj.visible = true;
        obj.quaternion.copy(camera.quaternion);
	}
	setVisible(ball);

	players.forEach(setVisible);
	players[2].rotateZ(Math.PI / 2);
	players[3].rotateZ(Math.PI / 2);

	if (!isFourPlayer)
	{
		setVisible(walls[0]);
		setVisible(walls[1]);
		for (let i = 2; i != 6; i++) {
			walls[i].visible = false;
		}
		players[3].visible = false;
		players[2].visible = false;
	}
	else {
		walls.forEach(setVisible);
		setWall2v2PosRot(walls, camera);
		for (let i = 2; i != 4; i++) {
			players[i].position.x = 0;
			players[i].position.z = 0;
		}
	}
    setBallPos(ball, 0);
	// la distance pour les jouers 3 et 4
    players[0].position.x = (camera.position.z * -1);
	players[0].position.z = (camera.position.x * 1);
	players[1].position.x = (camera.position.z * 1);
	players[1].position.z = (camera.position.x * -1);

	setPosPoints(realPoints, isFourPlayer, camera);

	for (let i in realPoints[0]) {
		realPoints[0][i].visible = true;
	}
}

export function setBallPos(ball, wichPlayer) {
    ball.position.set(0, 0, 0);
    wichPlayer == 1 ? ball.translateX(-10) : wichPlayer == 2 ? ball.translateX(10) : false;
}

//set the position of all the points in 3D
function setPosPoints(realPoints, isFourPlayer, camera) {
	const offset = 1.8;
	realPoints.forEach((point) => {
		point.playerOne.position.x = (camera.position.z * -1) / offset;
		point.playerOne.position.z = (camera.position.x * 1) / offset;
		point.playerTwo.position.x = (camera.position.z * 1) / offset;
		point.playerTwo.position.z = (camera.position.x * -1) / offset;
		if (isFourPlayer)
		{
			const yOffset = 8;
			point.playerOne.position.y = -yOffset;
			point.playerTwo.position.y = yOffset;
		}
		for (let i in point) {
			point[i].lookAt(camera.position);
			point[i].up.set(0, 1, 0);
        }
	})
}

// set the postition and rotation of the extra walls when there is 4 players
function setWall2v2PosRot(walls, camera) {
	const yOffset = 20;
	const offset = 0.95;	

	const wallConfigs = [
        { xFactor: -1, zFactor: 1, y: yOffset },
        { xFactor: 1, zFactor: -1, y: -yOffset },
        { xFactor: -1, zFactor: 1, y: -yOffset },
        { xFactor: 1, zFactor: -1, y: yOffset },
    ];

	wallConfigs.forEach((config, index) => {
        const wall = walls[index + 2];
        wall.position.x = (camera.position.z * config.xFactor) / offset;
        wall.position.z = (camera.position.x * config.zFactor) / offset;
        wall.position.y = config.y;
        wall.rotateX(Math.PI / 2);
    });

	walls[0].visible = false;
	walls[1].visible = false;
}

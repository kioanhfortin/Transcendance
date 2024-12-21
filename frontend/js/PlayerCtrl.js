import * as THREE from 'three';


const 	yLimit = 13;
// let		reactionTime = 0;
const 	difficultyAi = 20;

export function predictionBall(ball, speed) {
	if (!ball || !ball.velocity) {
		ball.velocity = new THREE.Vector3(0.2, 0.2, 0);
		return ball.position.y;
	}
	const predictY = ball.position.y + ball.velocity.y * difficultyAi;
	return predictY;
}

export function playerControl(players, keys, game, ball) {
	const speed = 0.35;
	const smooth = 0.3;

	const predictBall = predictionBall(ball, difficultyAi);
	if (keys['w'] && players[0].position.y < yLimit)
		players[0].position.y += speed;
	else if (keys['s'] && players[0].position.y > -yLimit)
		players[0].position.y -= speed;
	if (game.isSinglePlayer) {
		// if (reactionTime >= 1) {
			players[1].position.y = THREE.MathUtils.lerp(players[1].position.y, predictBall, smooth);
			// reactionTime = 0;
		}
		// reactionTime++;
	// }
	else {
		if (keys['ArrowUp'] && players[1].position.y < yLimit)
			players[1].position.y += 0.35;
		else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
			players[1].position.y -= speed;
		PlayerOther(players, keys, camera);
	}

	players.forEach(player => {
		if (player.position.y > yLimit) player.position.y = yLimit;
		if (player.position.y < -yLimit) player.position.y = -yLimit;
	});
}

const offset = 1.4;
const speedOther = 1;
// fait le mouvement des deux extras joueur
// ca regarde aussi la limite a pas depasser 
function PlayerOther(players, keys, camera) {
	const xLimit = camera.position.x / offset;
	const zLimit = camera.position.z / offset;

	if (keys['n'] && players[2].position.x > -zLimit && players[2].position.z < xLimit)
		players[2].translateY(speedOther);
	else if (keys['m'] && players[2].position.x < zLimit && players[2].position.z > -xLimit )
		players[2].translateY(-speedOther);

	if (keys['2'] && players[3].position.x > (camera.position.z * -1) / offset && players[3].position.z < (camera.position.x * 1) / offset )
		players[3].translateY(speedOther);
	else if (keys['3'] && players[3].position.x < (camera.position.z * 1) / offset && players[3].position.z > (camera.position.x * -1) / offset )
		players[3].translateY(-speedOther);
}

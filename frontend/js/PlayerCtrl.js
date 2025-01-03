import * as THREE from 'three';
import { getDifficultyAI } from './game.js';

const 	yLimit = 13;
const speed = 0.35;
let aiTargetY = 0;

export function predictionBall(ball, difficultyAI) {
	if (!ball || !ball.velocity) {
		ball.velocity = new THREE.Vector3(0.2, 0.2, 0);
		return ball.position.y;
	}
	let predictY = ball.position.y + ball.velocity.y * 15;

	const randomOffset = (Math.random() * 2 - 1) * (15 / difficultyAI); // Plus faible difficulté = plus d'imprécision
    predictY += randomOffset;

	return predictY;
}


export function playerControl(players, keys, game, ball, camera, dirBall, lastAIUpdate, timestamp) {
	const smooth = 0.1;
	const difficultyAI = getDifficultyAI();
	if (keys['w'] && players[0].position.y < yLimit)
		players[0].position.y += speed;
	else if (keys['s'] && players[0].position.y > -yLimit)
		players[0].position.y -= speed;
	if (game.isSinglePlayer) {
		const elapsedTime = (timestamp - lastAIUpdate) / 1000;
		if (elapsedTime >= 2 - (difficultyAI / 50)) {
			aiTargetY = predictionBall(ball, difficultyAI);
			const offset = (Math.random() * 2 - 1) * (10 / difficultyAI); // Décalage basé sur la difficulté
            aiTargetY += offset;
			lastAIUpdate = timestamp;
		}
		aiControlLimited(players[1], aiTargetY, difficultyAI);
		players[1].position.y = THREE.MathUtils.lerp(players[1].position.y, aiTargetY, smooth);
	}
	else {
		if (keys['ArrowUp'] && players[1].position.y < yLimit)
			players[1].position.y += speed;
		else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
			players[1].position.y -= speed;
		PlayerOther(players, keys, camera);
	}

	players.forEach(player => {
		if (player.position.y > yLimit) player.position.y = yLimit;
		if (player.position.y < -yLimit) player.position.y = -yLimit;
	});
}


export function aiControlLimited(player, targetY, difficultyAI, baseSpeed = 0.2, yLimit = 13) {
    const currentY = player.position.y;
    const distanceToTarget = targetY - currentY;

    // Marge de tolérance : ±1.5 à faible difficulté, ±0.1 à élevée
    const tolerance = 5 / difficultyAI;
    if (Math.abs(distanceToTarget) <= tolerance) {
        return;
    }

    // Vitesse dynamique en fonction de la difficulté
    const maxSpeed = baseSpeed + difficultyAI * 0.003;
    const moveStep = Math.sign(distanceToTarget) * Math.min(Math.abs(distanceToTarget), maxSpeed);

    player.position.y += moveStep;

    // Clamp pour rester dans les limites
    if (player.position.y > yLimit) player.position.y = yLimit;
    if (player.position.y < -yLimit) player.position.y = -yLimit;

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

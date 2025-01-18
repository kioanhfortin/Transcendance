import * as THREE from 'three';
import { getDifficultyAI } from './game.js';
import { updatePlayerMouvement } from './ui.js'

export const 	yLimit = 13;
export const 	xLimit = 20;
export const speed = 0.35;
const speedOther = 0.6;
let aiTargetY = 0;

export function predictionBall(balls, difficultyAI) {
	const prediction = [];
	balls.forEach((ball) => {
		if (!ball) 
			return;
		if (!ball.velocity) {
			ball.velocity = new THREE.Vector3(0.2, 0.2, 0);
		}

		let predictY = ball.position.y + ball.velocity.y * 15;
		
		const randomOffset = (Math.random() * 2 - 1) * (15 / difficultyAI); // Plus faible difficulté = plus d'imprécision
		predictY += randomOffset;
		
		prediction.push(predictY);
	})
	return prediction;
}

export function selectClosestBall(prediction, aiPlayerPosition) {
	let closestBall = null;
	let minDistance = Infinity;

	prediction.forEach((predictY, index) => {
		const distance = Math.abs(predictY - aiPlayerPosition);
		if (distance < minDistance) {
			minDistance = distance;
			closestBall = index;
		}
	});
	return closestBall !== null ? prediction[closestBall] : aiPlayerPosition;
}

export function playerControl(players, keys, game, balls, camera, lastAIUpdate, timestamp) {
	const smooth = 0.1;
	const difficultyAI = getDifficultyAI();
	// const xLimit = 13;
	if (game.isSinglePlayer) {
		updatePlayerMouvement(players);
		if (keys['w'] && players[0].position.y < yLimit)
			players[0].position.y += speed;
		else if (keys['s'] && players[0].position.y > -yLimit)
			players[0].position.y -= speed;
		const elapsedTime = (timestamp - lastAIUpdate) / 1000;
		if (elapsedTime >= 5 - (difficultyAI / 50)) {
			if (balls && balls.length === 1) {
				aiTargetY = predictionBall(balls, difficultyAI)[0];
			} else if (balls && balls.length > 1) {
				aiTargetY = selectClosestBall(predictionBall(balls, difficultyAI), players[1].position.y);
			} else {
				console.warn("Aucune balle détectée !");
			}
			const offset = (Math.random() * 2 - 1) * (10 / difficultyAI);
            aiTargetY += offset;
			lastAIUpdate = timestamp;
		}
		aiControlLimited(players[1], aiTargetY, difficultyAI);
		players[1].position.y = THREE.MathUtils.lerp(players[1].position.y, aiTargetY, smooth);
	}
	else {
		if (keys['w'] && players[0].position.y < yLimit)
			players[0].position.y += speed;
		else if (keys['s'] && players[0].position.y > -yLimit)
			players[0].position.y -= speed;
		if (keys['ArrowUp'] && players[1].position.y < yLimit)
			players[1].position.y += speed;
		else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
			players[1].position.y -= speed;
		PlayerOther(players, keys);
	}
}

export function aiControlLimited(player, targetY, difficultyAI) {
    const currentY = player.position.y;
    const distanceToTarget = targetY - currentY;

    // Marge de tolérance : ±1.5 à faible difficulté, ±0.1 à élevée
    const tolerance = Math.max(0.1, 5 / difficultyAI);
    if (Math.abs(distanceToTarget) <= tolerance) {
        return;
    }

    const moveStep = Math.sign(distanceToTarget) * Math.min(Math.abs(distanceToTarget), speed);

    player.position.y += moveStep;

    // Clamp pour rester dans les limites
    if (player.position.y > yLimit) player.position.y = yLimit;
    if (player.position.y < -yLimit) player.position.y = -yLimit;

}

// const offset = 1.4;
// const speedOther = 0.35;

// fait le mouvement des deux extras joueur
// ca regarde aussi la limite a pas depasser 
function PlayerOther(players, keys) {
	if (keys['n'] && players[2].position.x  > -xLimit)
		players[2].translateY(speedOther);
	else if (keys['m'] && players[2].position.x < xLimit)
		players[2].translateY(-speedOther);

	if (keys['2'] && players[3].position.x > -xLimit)
		players[3].translateY(speedOther);
	else if (keys['3'] && players[3].position.x < xLimit)
		players[3].translateY(-speedOther);

}
import * as THREE from 'three';
import { getDifficultyAI } from './game.js';
import { initMobileControls } from './ui.js'

export const 	yLimit = 13;
export const speed = 0.35;
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
	if (game.isSinglePlayer) {
		if (keys['w'] && players[0].position.y < yLimit)
			players[0].position.y += speed;
		else if (keys['s'] && players[0].position.y > -yLimit)
			players[0].position.y -= speed;
		initMobileControls(players);
		const elapsedTime = (timestamp - lastAIUpdate) / 1000;
		if (elapsedTime >= 5 - (difficultyAI / 50)) {
			if (balls && balls.length === 1) { // Vérifiez que balls est un tableau valide
				console.log("Une seule balle détectée, prédiction :", predictionBall(balls, difficultyAI)[0]);
				aiTargetY = predictionBall(balls, difficultyAI)[0];
			} else if (balls && balls.length > 1) { // Vérifiez qu'il y a plusieurs balles
				console.log("Plusieurs balles détectées, sélection de la plus proche.");
				aiTargetY = selectClosestBall(predictionBall(balls, difficultyAI), players[1].position.y);
			} else {
				console.warn("Aucune balle détectée !");
			}
			const offset = (Math.random() * 2 - 1) * (10 / difficultyAI); // Décalage basé sur la difficulté
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
		PlayerOther(players, keys, camera);
	}
	for (let player in players) {
		if (player == 2) break;
		if (players[player].position.y > yLimit) players[player].position.y = yLimit;
		if (players[player].position.y < -yLimit) players[player].position.y = -yLimit;
	}
}

export function aiControlLimited(player, targetY, difficultyAI, baseSpeed = 0.2, yLimit = 13) {
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
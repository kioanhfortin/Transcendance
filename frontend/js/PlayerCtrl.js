import * as THREE from 'three';

const yLimit = 13
let reactionTime = 0;

export function predictionBall(ball, speed) {
	if (!ball || !ball.velocity) {
		return ball.position.y;
	}
	const predictY = ball.position.y + ball.velocity.y * 20;
	return predictY;
}

export function playerControl(players, keys, game, ball) {
	const speed = 0.35;
	const smooth = 0.1;
	const predictBall = predictionBall(ball, speed);
	if (keys['w'] && players[0].position.y < yLimit)
		players[0].position.y += 0.35;
	else if (keys['s'] && players[0].position.y > -yLimit)
		players[0].position.y -= 0.35;
	if (game.isSinglePlayer) {
		reactionTime++;
		if (reactionTime >= 5) {
			players[1].position.y += (predictBall - players[1].position.y) * smooth;
			if (predictBall > players[1].position.y + 1) {
				players[1].position.y += speed;
			} else if (predictBall < players[1].position.y - 1) {
				players[1].position.y -= speed;
			}
			reactionTime = 0;
		}
		// else
		// {
		// 	if (ball.position.y > players[1].position.y + 1) {
		// 		players[1].position.y += speed;
		// 	} else if (ball.position.y < players[1].position.y - 1) {
		// 		players[1].position.y -= speed;
		// 	}
		// }
	}
	else {
		if (keys['ArrowUp'] && players[1].position.y < yLimit)
			players[1].position.y += 0.35;
		else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
			players[1].position.y -= 0.35;
		
	}
	players.forEach(player => {
		if (player.position.y > yLimit) player.position.y = yLimit;
		if (player.position.y < -yLimit) player.position.y = -yLimit;
	});
}

export function startGame(keys) {
	if (keys['t'])
	{
		return true;
	}
}

export function pressStart(keys) {
	if (keys['a'])
	{
		return true;
	}
}

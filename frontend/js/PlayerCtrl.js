import * as THREE from 'three';
// import { Game } from './game';

const yLimit = 13
const speed = 0.5;

export function playerControl(players, keys, game, ball) {
	if (keys['w'] && players[0].position.y < yLimit)
		players[0].position.y += speed;
	else if (keys['s'] && players[0].position.y > -yLimit)
		players[0].position.y -= speed;
	if (game.isSinglePlayer) {
		if (ball.position.y > players[1].position.y + 1) {
			players[1].position.y += speed;
		} else if (ball.position.y < players[1].position.y - 1) {
			players[1].position.y -= speed;
		}
	}
	else {
		if (keys['ArrowUp'] && players[1].position.y < yLimit)
			players[1].position.y += speed;
		else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
			players[1].position.y -= speed;

	}
}


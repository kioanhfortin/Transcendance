import * as THREE from 'three';
// import { Game } from './game';

const yLimit = 13

export function playerControl(players, keys, game, ball) {
	if (keys['w'] && players[0].position.y < yLimit)
		players[0].position.y += 0.35;
	else if (keys['s'] && players[0].position.y > -yLimit)
		players[0].position.y -= 0.35;
	if (game.isSinglePlayer) {
		const speed = 0.35;
		if (ball.position.y > players[1].position.y + 1) {
			players[1].position.y += speed;
		} else if (ball.position.y < players[1].position.y - 1) {
			players[1].position.y -= speed;
		}
	}
	else {
		if (keys['ArrowUp'] && players[1].position.y < yLimit)
			players[1].position.y += 0.35;
		else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
			players[1].position.y -= 0.35;

	}
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


import * as THREE from 'three';
import { Game } from './game';

const yLimit = 13

export function playerControl(players, keys, Game) {
	if (keys['w'] && players[0].position.y < yLimit)
		players[0].position.y += 0.35;
	else if (keys['s'] && players[0].position.y > -yLimit)
		players[0].position.y -= 0.35;
	if (!game.isSinglePlayer) {
			if (keys['ArrowUp'] && players[1].position.y < yLimit)
				players[1].position.y += 0.35;
			else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
				players[1].position.y -= 0.35;
	}
	else {
		const speed = 0.1;
		if (ball.position.y > players[1].position.y + 1) {
			players[1].position.y += speed;
		} else if (ball.position.y < players[1].position.y - 1) {
			players[1].position.y -= speed;
		}
	}

}

export function playerControlAi(players, keys) {
	if (keys['ArrowUp'] && players[0].position.y < yLimit)
		players[1].position.y += 0.35;
	else if (keys['ArrowDown'] && players[0].position.y > -yLimit)
		players[1].position.y -= 0.35;

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


import * as THREE from 'three';


const yLimit = 13

export function playerControl(players, keys) {
	if (keys['w'] && players[0].position.y < yLimit)
		players[0].position.y += 0.35;
	else if (keys['s'] && players[0].position.y > -yLimit)
		players[0].position.y -= 0.35;
	if (keys['ArrowUp'] && players[1].position.y < yLimit)
		players[1].position.y += 0.35;
	else if (keys['ArrowDown'] && players[1].position.y > -yLimit)
		players[1].position.y -= 0.35;

}

export function startGame(keys) {
	if (keys['t'])
	{
		console.log('sdfgdfgdfgd');
		return true;
	}
}


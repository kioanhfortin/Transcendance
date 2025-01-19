import * as THREE from 'three';

// check la distance avec les deux premier joueurs vertical
function distanceBallTwoPlayers(ball, players, dirBall, i) {
	const threshold = 0.1;
	const lPlayer = 5;
	const offsetxy = 2;


	// check if the ball is going in the right direction
	// to avoid the gitter if its not good
	if ((i == 0 && dirBall.x == 1) || (i == 1 && dirBall.x == -1))
		return false;

	const dist = Math.sqrt(
		Math.pow(players[i].position.x - ball.position.x, 2) +
		Math.pow(players[i].position.z - ball.position.z, 2)
	) - offsetxy;

	const playerY = players[i].position.y;

	if (dist - threshold <= 0 && isRange(ball.position.y, playerY - lPlayer, playerY + lPlayer))
		return true;
	return false;
}


// meme chose que en haut mais avec joueurs 3 et 4
// jajoute aussi un threshold pour solve le bug de la balle qui lag si le player ne la rattrape pas mais va en dessous du jouer
// si ca le fait encore probablement augmenter la valeur;
function distanceBallOtherPlayers(ball, players, i, dirBall) {
	const lOtherPlayer = 15;
	const yDistance = 17.5;
	const threshold = 1;
	const playerX = players[i].position.x;
	const playerZ = players[i].position.z;
  
	const minX = playerX - lOtherPlayer / 2;
	const maxX = playerX + lOtherPlayer / 2;
	const minZ = playerZ - lOtherPlayer / 2;
	const maxZ = playerZ + lOtherPlayer / 2;

	const	intervalDistance = 0.5;

	const isInXRange = ball.position.x >= minX && ball.position.x <= maxX;
	const isInZRange = ball.position.z >= minZ && ball.position.z <= maxZ;
	if ((i == 3 && dirBall.y == 1) || (i == 2 && dirBall.y == -1))
		return false;


	if (i == 2 && isInXRange && isInZRange && ball.position.y > yDistance && ball.position.y < yDistance + intervalDistance && ball.position.y < yDistance + threshold)
		return true;
	if (i == 3 && isInXRange && isInZRange && ball.position.y < -yDistance && ball.position.y > -yDistance - intervalDistance && ball.position.y > -yDistance + -threshold)
		return true;
	return false;
}

// translate la ball pour la faire bouger et regarde si ya contact avec un joueur
// ajoute tjrs un peu de randomness acceleration lorsque ca touche un jouer vertical
// ca veut dire que plus le settings de la balle pour aller plus vite est grand plus il PEUT POTENTIELLEMENT
//  aller plus vite a chaque coup
const limit = 17.25;
export function ballMouvement(balls, players, dirBalls, isFourPlayer) {

	balls.forEach((ball, index) => {
		const dirBall = dirBalls[index];
		ball.translateX(dirBall.x * dirBall.xSpeed);
		ball.translateY(dirBall.y * dirBall.ySpeed);
		if (isFourPlayer && (distanceBallOtherPlayers(ball, players, 2, dirBall) || distanceBallOtherPlayers(ball, players, 3, dirBall)))
			dirBall.y *= -1;
		else if ((ball.position.y > limit || ball.position.y < -limit) && !isFourPlayer)
			dirBall.y *= -1;
		else if (distanceBallTwoPlayers(ball, players, dirBall, 0) || distanceBallTwoPlayers(ball, players, dirBall, 1)) {
			dirBall.x *= -1;
			dirBall.xSpeed += getRandomValue(0, dirBall.acceleration);
		}
	});
}



function getRandomValue(min, max) {
	return (Math.random() * (max - min) + min);
}

// speed is the inital speed
// acceleration is how much it will go faster
// randomness is how much random you want the ball to bounce the direction
export function ballSettings(speed, acceleration, dirBall) {
	dirBall.xSpeedOrigin = speed;
	dirBall.ySpeedOrigin = speed;
	dirBall.acceleration = acceleration;
	resetBallSettings(dirBall);
}

export function resetBallSettings(dirBall) {
	dirBall.xSpeed = dirBall.xSpeedOrigin;
	dirBall.ySpeed = dirBall.ySpeedOrigin;
}

function isRange(value, min, max) {
	return value >= min && value <= max;
  }
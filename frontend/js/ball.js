
// check la distance avec les deux premier joueurs vertical
function distanceBallTwoPlayers(ball, players) {
	const threshold = 2;
	const lPlayer = 5;

	const distOne = Math.sqrt(
		Math.pow(players[0].position.x - ball.position.x, 2) +
		Math.pow(players[0].position.z - ball.position.z, 2)
	)

	const distTwo = Math.sqrt(
		Math.pow(players[1].position.x - ball.position.x, 2) +
		Math.pow(players[1].position.z - ball.position.z, 2)
	)
	const oneY = players[0].position.y;
	const twoY = players[1].position.y;

	if ((distOne - threshold <= 0 && isRange(ball.position.y, oneY - lPlayer, oneY + lPlayer))
		|| (distTwo - threshold <= 0 && isRange(ball.position.y, twoY - lPlayer, twoY + lPlayer)))
		return true;
	return false;
}


// meme chose que en haut mais avec joueurs 3 et 4
// jajoute aussi un threshold pour solve le bug de la balle qui lag si le player ne la rattrape pas mais va en dessous du jouer
// si ca le fait encore probablement augmenter la valeur;
function distanceBallOtherPlayers(ball, players, i) {
	const lOtherPlayer = 15;
	const yDistance = 18;
	const threshold = 1;
	const playerX = players[i].position.x;
	const playerZ = players[i].position.z;
  
	const minX = playerX - lOtherPlayer / 2;
	const maxX = playerX + lOtherPlayer / 2;
	const minZ = playerZ - lOtherPlayer / 2;
	const maxZ = playerZ + lOtherPlayer / 2;

	const isInXRange = ball.position.x >= minX && ball.position.x <= maxX;
	const isInZRange = ball.position.z >= minZ && ball.position.z <= maxZ;
	if (i == 2 && isInXRange && isInZRange && ball.position.y > yDistance && ball.position.y < yDistance + threshold)
		return true;
	if (i == 3 && isInXRange && isInZRange && ball.position.y < -yDistance && ball.position.y > -yDistance + -threshold)
		return true;
	return false;
}

// translate la ball pour la faire bouger et regarde si ya contact avec un joueur
// ajoute tjrs un peu de randomness acceleration lorsque ca touche un jouer vertical
// ca veut dire que plus le settings de la balle pour aller plus vite est grand plus il PEUT POTENTIELLEMENT
//  aller plus vite a chaque coup
const limit = 16.25;
export function ballMouvement(ball, players, dirBall, isFourPlayer) {
	ball.translateX(dirBall.x * dirBall.xSpeed);
	ball.translateY(dirBall.y * dirBall.ySpeed);
	if (isFourPlayer && (distanceBallOtherPlayers(ball, players, 2) || distanceBallOtherPlayers(ball, players, 3)))
		dirBall.y *= -1;
	else if ((ball.position.y > limit || ball.position.y < -limit) && !isFourPlayer)
		dirBall.y *= -1;
	else if (distanceBallTwoPlayers(ball, players)) {
		dirBall.x *= -1;
		dirBall.xSpeed += getRandomValue(0, dirBall.acceleration);
	}
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
const threshold = 1;

const lPlayer = 5;
function distanceBallPlayers(ball, players) {
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

function isRange(val, min, max) {
	return val >= min && val <= max;
}

const limit = 16.25;
export function ballMouvement(ball, players, dirBall) {

	
	ball.translateX(dirBall.x * dirBall.xSpeed);
	ball.translateY(dirBall.y * dirBall.ySpeed);
	if (ball.position.y > limit || ball.position.y < -limit)
	{
		dirBall.y *= -1;
	}
	if (distanceBallPlayers(ball, players)) {
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
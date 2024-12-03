import '/assets/css/style.css'
import * as THREE from 'three';;
import * as STARS from './stars';
import { initScene} from './init';
import { Game } from './game';
import { animate, camRot } from './animate';
import * as display from './ui'

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 1000);


const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

let game = {isactive: false, isPlaying: false, isSinglePlayer: true, needInit: false}

document.addEventListener("DOMContentLoaded", function() {
    game.isactive = false;
});

//if the game is running
const keys = {};
const stars = [];
const matrix = camRot(camera);

initScene(scene, camera, renderer);

document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

display.multiPlayer(game);
display.singlePlayer(game);
display.startRestart();


// use to rotate the cam 0.002 best
animate(game, scene, camera, matrix, renderer, stars);

Game(game, keys, scene, camera);

// requestAnimationFrame(gameLoop);

//create a flying stars every 5s (5000ml)
STARS.createFstar(scene, camera, '/assets/obj/star.stl', stars);

// setInterval(() => {
//     STARS.createFstar(scene, camera, '/assets/obj/star.stl', stars);
// }, 5000);



// faire une variable pour les players qui check si c ai ou pas
// comme ca quand la game recommence sans recreer sa check si on peut prendre les touches ou pas
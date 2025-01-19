import '/assets/css/style.css'
import * as THREE from 'three';;
import * as STARS from './stars';
import { initScene} from './init';
import { Game } from './game';
import { animate } from './animate';
import * as display from './ui'
import { changeLanguage } from './language'
import { TournamentManager } from './tournament'
// import { initlandingPage } from './landingPage'

// la scene et camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, 2521 / 1519, 0.1, 1000);
// renderer sert a print a lecran
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});


// Landingpage
// export const sceneLanding = new THREE.Scene();
// export const cameraLanding = new THREE.PerspectiveCamera(75, 2521 / 1519, 0.1, 1000);
// export const rendererLanding = new THREE.WebGLRenderer({
//     canvas: document.querySelector('#pong3d'), alpha: true
// });
// rendererLanding.setSize(window.innerWidth, window.innerHeight);
// cameraLanding.position.z = 10;
// document.addEventListener('DOMContentLoaded', () => {
//     initlandingPage(rendererLanding, cameraLanding, sceneLanding);
// });

// isactive signifi que le jeux est apparu
// isPlaying cest quand la ball bouge et tt
let game = {isactive: false, isPlaying: false,
    isSinglePlayer: true, needInit: false, 
    isFourPlayer: false, isTournament: false};

document.addEventListener("DOMContentLoaded", function() {
    game.isactive = false;
});


// definits les keys pour player control
const keys = {};
// les etoiles filante
const stars = [];
// pouir la rotation de la camera
// const matrix = camRot(camera);

initScene(scene, camera, renderer);

// definit les evenement de key press
document.addEventListener("keydown", (event) => {
    keys[event.key] = true;
});

document.addEventListener("keyup", (event) => {
    keys[event.key] = false;
});

// les bouton UI
display.multiPlayer(game);
display.singlePlayer(game);
display.isFourPlayer(game);
TournamentManager(game);

// animate la scene
animate(game, scene, camera, renderer, stars);

// fameuse boucle de jeux majeurs parties
Game(game, keys, scene, camera);

//create a flying stars every 5s (5000ml)
STARS.createFstar(scene, camera, '/assets/obj/star.stl', stars);
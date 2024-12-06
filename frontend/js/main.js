import '/assets/css/style.css'
import * as THREE from 'three';;
import * as STARS from './stars';
import { initScene} from './init';
import { Game } from './game';
import { animate, camRot } from './animate';
import * as display from './ui'
import { changeLanguage } from './language'

// la scene et camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

// renderer sert a print a lecran
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

// isactive signifi que le jeux est apparu
// isPlaying cest quand la ball bouge et tt
let game = {isactive: false, isPlaying: false, isSinglePlayer: true, needInit: false, isFourPlayer: false}

document.addEventListener("DOMContentLoaded", function() {
    game.isactive = false;
});

// definits les keys pour player control
const keys = {};
// les etoiles filante
const stars = [];
// pouir la rotation de la camera
const matrix = camRot(camera);

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
display.startRestart();
display.isFourPlayer(game);

// change the language
changeLanguage();

// animate la scene
animate(game, scene, camera, matrix, renderer, stars);

// fameuse boucle de jeux majeurs parties
Game(game, keys, scene, camera);


//create a flying stars every 5s (5000ml)
STARS.createFstar(scene, camera, '/assets/obj/star.stl', stars);

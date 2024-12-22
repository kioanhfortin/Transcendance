import '/assets/css/style.css'
import * as THREE from 'three';;
import * as STARS from './stars';
import { initScene} from './init';
import { Game } from './game';
import { animate, camRot } from './animate';
import * as display from './ui'
import { changeLanguage } from './language'
import { TournamentManager } from './tournament'


// la scene et camera
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);


// renderer sert a print a lecran
const renderer = new THREE.WebGLRenderer({
	canvas: document.querySelector('#bg'),
});

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
display.isFourPlayer(game);
TournamentManager();

// change the language
changeLanguage();

// animate la scene
animate(game, scene, camera, matrix, renderer, stars);

// fameuse boucle de jeux majeurs parties
Game(game, keys, scene, camera);

function calculateVisibleBounds(camera) {
    const visibleHeight = 2 * camera.position.z * Math.tan((camera.fov * Math.PI) / 360);
    const visibleWidth = visibleHeight * camera.aspect;

    return { visibleHeight, visibleWidth };
}

export function initPlayer(scene, camera) {
    const players = [];
    const geometry = new THREE.BoxGeometry(0.5, 8, 0.5);
    const material = new THREE.MeshPhongMaterial({ color: 0xD8D3E2 });

    const { visibleWidth } = calculateVisibleBounds(camera);

    const player1 = new THREE.Mesh(geometry, material);
    const player2 = new THREE.Mesh(geometry, material);

    player1.position.set(-visibleWidth / 2 + 2, 0, 0);
    player2.position.set(visibleWidth / 2 - 2, 0, 0);

    scene.add(player1);
    scene.add(player2);

    players.push(player1, player2);

    return players;
}

window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width * 0.8, height * 0.8);

    const { visibleWidth } = calculateVisibleBounds(camera);

    players[0].position.set(-visibleWidth / 2 + 2, players[0].position.y, 0);
    players[1].position.set(visibleWidth / 2 - 2, players[1].position.y, 0);
});



//create a flying stars every 5s (5000ml)
STARS.createFstar(scene, camera, '/assets/obj/star.stl', stars);

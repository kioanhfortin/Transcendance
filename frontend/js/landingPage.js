// import * as THREE from 'three';
// // import { rendererLanding, cameraLanding, sceneLanding } from './main';
// import { FontLoader } from 'three/examples/jsm/loaders/FontLoader';
// import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry';


// export function initlandingPage(rendererLanding, cameraLanding, sceneLanding) {
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
//     const light = new THREE.PointLight(0xffffff, 1.5, 100);
//     light.position.set(10, 10, 10);
//     sceneLanding.add(ambientLight);
//     sceneLanding.add(light);

//     const fontLoader = new FontLoader();
//     fontLoader.load('https://threejs.org/examples/fonts/helvetiker_regular.typeface.json', (font) => {
//         const textGeometry = new TextGeometry('PONG PONG PONG 🏓', {
//             font: font,
//             size: 1,
//             height: 0.5,
//             curveSegments: 12,
//             bevelEnabled: true,
//             bevelThickness: 0.03,
//             bevelSize: 0.02,
//             bevelSegments: 5,
//         });
//         const textMaterial = new THREE.MeshPhongMaterial({
//             color: 0xff5722,
//             metalness: 0.7,
//             roughness: 0.2,
//         });
//         const textMesh = new THREE.Mesh(textGeometry, textMaterial);

//         textMesh.position.set(-5, 2, 0);
//         sceneLanding.add(textMesh);
//     });
//     function animate() {
//         requestAnimationFrame(animate);
//         rendererLanding.render(sceneLanding, cameraLanding);
//     }
//     animate();
// };

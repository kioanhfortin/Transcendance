import * as THREE from 'three';

export function backgroundSkybox(scene) {
	const materialArr = createMaterialArray();
	const skyboxGeo = new THREE.BoxGeometry(1000, 1000, 1000);
	const skybox = new THREE.Mesh(skyboxGeo, materialArr);
	scene.add(skybox);
}

function createPathStrings()
{
	const basePath = "/assets/images/";
	const fileType = ".png";
	const side = ["bk", "ft", "up", "dn", "rt", "lf"];
	const pathStrings = side.map(side => {
		return basePath + side + fileType;
	});
	return pathStrings;
}
// bla blas bal on sent fout cest la skybox
function createMaterialArray() {
	const skyboxImagePaths = createPathStrings();
	const materialArr = skyboxImagePaths.map(image => {
		let texture = new THREE.TextureLoader().load(image);
		return new THREE.MeshBasicMaterial({
			map: texture, side: THREE.BackSide
		});
	});
	return materialArr;
}


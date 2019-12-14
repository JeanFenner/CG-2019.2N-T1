/**
 *
 *  Cyndaquil
 *
 */

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';

import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/stats.module.js';

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, camera, scene, renderer;
var figures = [];

var xSpeed = 0.1;
var ySpeed = 0.03;
var zSpeed = 0.1;

var character;

var gui, playbackConfig = {
    wireframe: false
};

var controls;

var clock = new THREE.Clock();

var stats;

init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 150, 400);

    // SCENE

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x050505);
    scene.fog = new THREE.Fog(0x050505, 400, 1000);

    // LIGHTS

    scene.add(new THREE.AmbientLight(0x222222));

    var light = new THREE.SpotLight(0xffffff, 5, 1000);
    light.position.set(200, 250, 500);
    light.angle = 0.5;
    light.penumbra = 0.5;

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    //scene.add( new CameraHelper( light.shadow.camera ) );
    scene.add(light);

    var light = new THREE.SpotLight(0xffffff, 5, 1000);
    light.position.set(- 100, 350, 350);
    light.angle = 0.5;
    light.penumbra = 0.5;

    light.castShadow = true;
    light.shadow.mapSize.width = 1024;
    light.shadow.mapSize.height = 1024;

    // scene.add( new CameraHelper( light.shadow.camera ) );
    scene.add(light);

    //  GROUND

    var gt = new THREE.TextureLoader().load("cyndaquil/textures/logo_uffs.png");
    var gg = new THREE.PlaneBufferGeometry(2000, 2000);
    var gm = new THREE.MeshPhongMaterial({ color: 0xffffff, map: gt });

    var ground = new THREE.Mesh(gg, gm);
    ground.rotation.x = - Math.PI / 2;
    ground.material.map.repeat.set(75, 75);
    ground.material.map.wrapS = ground.material.map.wrapT = THREE.RepeatWrapping;
    ground.receiveShadow = true;

    scene.add(ground);

    // RENDERER

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);
    container.appendChild(renderer.domElement);

    //

    renderer.gammaInput = true;
    renderer.gammaOutput = true;
    renderer.shadowMap.enabled = true;

    // Spheres
    createSphere(1, 'iscorn.jpeg', 50, 100);
    createSphere(2, 'logo_uffs.png', -50, 100);

    // STATS

    stats = new Stats();
    container.appendChild(stats.dom);

    // EVENTS

    window.addEventListener('resize', onWindowResize, false);

    // CONTROLS

    controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 50, 0);
    controls.update();

    // CHARACTER
    var loader = new GLTFLoader();

    loader.load( './cyndaquil/cyndaquil.gltf', function ( gltf ) {
        character = gltf.scene;
        scene.add( character );
        character.scale.set(10, 10, 10);
    }, undefined, function ( e ) {
        console.error( e );
    } );

}

// EVENT HANDLERS

function onWindowResize() {

    SCREEN_WIDTH = window.innerWidth;
    SCREEN_HEIGHT = window.innerHeight;

    renderer.setSize(SCREEN_WIDTH, SCREEN_HEIGHT);

    camera.aspect = SCREEN_WIDTH / SCREEN_HEIGHT;
    camera.updateProjectionMatrix();

}

function createSphere(index, url, x, y) {
    var textureLoader = new THREE.TextureLoader();

    var materials = [
        new THREE.MeshBasicMaterial({map: textureLoader.load( 'cyndaquil/textures/' + url )})
    ];

    var geometry = new THREE.SphereGeometry(40, 100, 30);

    figures[index] = new THREE.Mesh(geometry,materials);
    scene.add( figures[index] );
    figures[index].position.x -= x;
    figures[index].position.y += y;
}

function rotateFigures() {
    figures.forEach(figure => {
        if ( figure != undefined ) {
            // figure.rotation.x -= xSpeed * 0.2;
            figure.rotation.y -= ySpeed;
            // figure.rotation.z -= zSpeed * 0.3;
        }
    });
}

function animate() {
    requestAnimationFrame(animate);

    rotateFigures();

    renderer.render(scene, camera);

    stats.update();
}

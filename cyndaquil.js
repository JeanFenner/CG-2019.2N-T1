/**
 * Universidade Federal da Fronteira Sul - UFFS
 * Ciência da Computação
 * Computação Gráfica
 * 
 * Professor
 * Fernando Bevilacqua
 * 
 * Alunos
 * Elvis de Souza Machado
 * Jean Carlo Fenner
 *
 * Cyndaquil
 * 
 * Ideia geral
 * Fazer o pokémon (Cyndaquil) executar ações com teclado e possuir alguns estados (correndo, olhando para os lados, etc.).
 * Conter esferas com imagens de professores da UFFS que ficam movimentando em tela independente do pokemon.
 *
 */

import * as THREE from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/build/three.module.js';

import { GLTFLoader } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/loaders/GLTFLoader.js';
import { GUI } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/dat.gui.module.js';
import { OrbitControls } from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/controls/OrbitControls.js';
import Stats from 'https://threejsfundamentals.org/threejs/resources/threejs/r110/examples/jsm/libs/stats.module.js';

var SCREEN_WIDTH = window.innerWidth;
var SCREEN_HEIGHT = window.innerHeight;

var container, camera, scene, renderer;
var mixer, actions, activeAction, previousAction;
var figures = [];

var xSpeed = 0.7;
var ySpeed = 0.7;
var zSpeed = 0.7;
var t = 0;

var character;

var gui;

var controls;

var clock = new THREE.Clock();

var stats;

var api = { state: 'Idle' };


init();
animate();

function init() {

    container = document.createElement('div');
    document.body.appendChild(container);

    // CAMERA

    camera = new THREE.PerspectiveCamera(40, window.innerWidth / window.innerHeight, 1, 1000);
    camera.position.set(0, 150, -400);

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

    // SPHERES
    createSphere(1, 'emilio1.jpeg', -210, 120);
    createSphere(2, 'padilha1.jpg', -140, 120);
    createSphere(3, 'grazi1.jpg', -70, 120);
    createSphere(4, 'fernando1.jpeg', 0, 120);
    createSphere(5, 'neri1.jpg', 70, 120);
    createSphere(7, 'raquel1.jpeg', 140, 120);
    createSphere(6, 'dino1.jpeg', 210, 120);

    // STATS

    stats = new Stats();
    container.appendChild(stats.dom);

    // EVENTS

    window.addEventListener('resize', onWindowResize, false);
    window.addEventListener('keydown', onDocumentKeyDown, false );
    window.addEventListener('keyup', onDocumentKeyUp, false );
    window.addEventListener('click', onMouseDown, false);

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
        createGUI(character, gltf.animations);
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

function onDocumentKeyDown(e) {
    var keyCode = event.which;
    var newAnimation = { state: 'Idle' };

    if (e){
        if (keyCode == 87) {
            character.position.z += zSpeed;
            character.rotation.y = 0;
            newAnimation.state = 'Run';
        } else if (keyCode == 83) {
            character.position.z -= zSpeed;
            character.rotation.y = 3;
            newAnimation.state = 'Run';
        } else if (keyCode == 65) {
            character.position.x += xSpeed;
            character.rotation.y = 1.5;
            newAnimation.state = 'Run';
        } else if (keyCode == 68) {
            character.position.x -= xSpeed;
            character.rotation.y = -1.5;
            newAnimation.state = 'Run';
        }
    }
    if (newAnimation.state != api.state){
        api.state = newAnimation.state;
        fadeToAction( api.state, 0.5 );
    }
};

function onDocumentKeyUp(e) {
    var newAnimation = { state: 'Idle' };

    if (newAnimation.state != api.state){
        api.state = newAnimation.state;
        fadeToAction( api.state, 0.5 );
    }
};

function onMouseDown(e){
    var newAnimation = { state: '' };

    if (e){
        if(api.state != 'Wave')
            newAnimation.state = 'Wave';
        if(api.state != 'Idle')
            newAnimation.state = 'Idle';
    }
    api.state = newAnimation.state;
    fadeToAction( api.state, 0.5 );
}

// GUI

function createGUI( character, animations ) {
    var states = ['Idle', 'Run', 'Wave'];

    gui = new GUI();

    mixer = new THREE.AnimationMixer( character );

    actions = {};

    for ( var i = 0; i < animations.length; i ++ ) {
        var clip = animations[ i ];
        var action = mixer.clipAction( clip );
        actions[ clip.name ] = action;
        if ( states.indexOf( clip.name ) >= 3 ) {
            action.clampWhenFinished = true;
            action.loop = THREE.LoopOnce;
        }
    }

    // states
    var statesFolder = gui.addFolder( 'States' );
    var clipCtrl = statesFolder.add( api, 'state' ).options( states );
    clipCtrl.onChange( function () {
        fadeToAction( api.state, 0.5 );
    } );

    activeAction = actions[ 'Idle' ];
    activeAction.play();
    statesFolder.open();
}

function fadeToAction( name, duration ) {
    previousAction = activeAction;
    activeAction = actions[ name ];

    if ( previousAction !== activeAction ) {
        previousAction.fadeOut( duration );
    }

    activeAction
        .reset()
        .setEffectiveTimeScale( 1 )
        .setEffectiveWeight( 1 )
        .fadeIn( duration )
        .play();
}

function createSphere(index, url, x, y) {
    var textureLoader = new THREE.TextureLoader();

    var materials = [
        new THREE.MeshBasicMaterial({map: textureLoader.load( 'cyndaquil/textures/' + url )})
    ];

    var geometry = new THREE.SphereGeometry(30, 100, 30);

    figures[index] = new THREE.Mesh(geometry,materials);

    scene.add( figures[index] );
    figures[index].position.x -= x;
    figures[index].position.y += y;
}

function rotateFigures() {
    t += 0.01;
    figures.forEach(figure => {
        if ( figure != undefined) {
            figure.rotation.y -= 0.03;
            figure.position.x += 2 * Math.cos(t) + 0;
        }
    });
}

function animate() {
    var delta = clock.getDelta();
    if ( mixer ) mixer.update( delta );

    requestAnimationFrame(animate);

    rotateFigures();

    renderer.render(scene, camera);

    stats.update();
    controls.update();
}

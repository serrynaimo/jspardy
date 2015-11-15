var camera, scene, renderer;
var tower, target, light;
var start;
var SHADOW_MAP_WIDTH = SHADOW_MAP_HEIGHT = 512;

init();
animate();

/*

todo

- skybox
- mirror materials
- lightcones
- photos (with fader)
- videos

https://www.youtube.com/watch?v=Z1fMCYW3wYQ

*/



function makeText( material ) {

	var text = new THREE.TextGeometry( 'JSPARDY', {
		size: 50,
		height: 20,
		curveSegments: 8,
		font: "helvetiker",

		bevelThickness: 2,
		bevelSize: 2,
		bevelEnabled: true
	});

	text.computeBoundingBox();
	var centerOffset = -0.5 * ( text.boundingBox.max.x - text.boundingBox.min.x );

	var jspardyMesh = new THREE.Mesh( text, material );

	jspardyMesh.position.x = centerOffset;
	jspardyMesh.position.y = 1000;
	jspardyMesh.position.z = 0;

	jspardyMesh.rotation.x = 0;
	jspardyMesh.rotation.y = Math.PI * 2;

	return jspardyMesh;

}

function makePlaneMesh( material ) {

	var plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( 10000, 10000 ),
		material
	);
	plane.position.y = 0;
	plane.rotation.x = - Math.PI / 2;
	return plane

}

function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.y = 400;

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2( 0xefd1b5, 0.0025 );

	var geometry = new THREE.BoxGeometry( 200, 1000, 200 );
	var material = new THREE.MeshLambertMaterial( {  color: 0x0000ff } );


	scene.add( new THREE.AmbientLight( 0x222222 ) );

	light = new THREE.PointLight( 0xffffff );

	scene.add( light );


	light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
	light.position.set( 0, 1500, 1000 );
	light.target.position.set( 0, 0, 0 );

	light.castShadow = true;

	light.shadowCameraNear = 1200;
	light.shadowCameraFar = 2500;
	light.shadowCameraFov = 50;

	//light.shadowCameraVisible = true;

	light.shadowBias = 0.0001;

	light.shadowMapWidth = SHADOW_MAP_WIDTH;
	light.shadowMapHeight = SHADOW_MAP_HEIGHT;

	scene.add( light );


	toplight = new THREE.PointLight( 0xffffff );
	toplight.position.y = 1000;

	scene.add( toplight );

	var textMaterial = new THREE.MeshPhongMaterial( { color: 0x0000ff, specular: 0xffffff } );

	tower = new THREE.Mesh( geometry, textMaterial );
	tower.position.y = 500;
	tower.castShadow = true;
	tower.receiveShadow = true;
	scene.add( tower );

	jspardyMesh = makeText( textMaterial );
	jspardyMesh.castShadow = true;
	jspardyMesh.receiveShadow = true;

	scene.add( jspardyMesh );

	var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
	var ground = makePlaneMesh( planeMaterial );
	ground.castShadow = false;
	ground.receiveShadow = true;
	scene.add( ground );


	// var m1 = makePlaneMesh( material )
	// var m2 = makePlaneMesh( material )
	// var m3 = makePlaneMesh( material )
	// var m4 = makePlaneMesh( material )
	// m1.position.set(- 500, 0, 500)
	// m2.position.set( 500, 0, -500)
	// m3.position.set(- 500, 0, -500)
	// m4.position.set( 500, 0, 500)
	// scene.add(m1);
	// scene.add(m2);
	// scene.add(m3);
	// scene.add(m4);

	start = Date.now();


	target = new THREE.Vector3();

	camera.up = new THREE.Vector3(0.2,1,0).normalize();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x111111);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	document.body.appendChild( renderer.domElement );

	//

	window.addEventListener( 'resize', onWindowResize, false );

}

function onWindowResize() {

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();

	renderer.setSize( window.innerWidth, window.innerHeight );

}

function easeInOut( k ) {

	if ((k *= 2) < 1) {
		return 0.5 * k * k;
	}

	return - 0.5 * (--k * (k - 2) - 1);

}

function easeOut (k) {

	return k * (2 - k);

}



function animate() {

	requestAnimationFrame( animate );

	var len = 12;
	var time = Math.min( (Date.now() - start) / 1000, len);
	var k = time / len;

	var d = (1 - k) * 1000 + 200;

	var r = easeInOut(1 - k) * Math.PI * 4 + Math.PI / 2;
	var x = Math.cos(r) * d;
	var z = Math.sin(r) * d;

	camera.position.x = x;
	camera.position.z = z;
	target.y = easeInOut(k) * 1000;
	camera.position.y = 100 + target.y;
	camera.lookAt(target);

	light.position.copy( camera.position );

	renderer.render( scene, camera );

}

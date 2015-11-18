var camera, scene, renderer;
var tower, target, light;
var start;
var SHADOW_MAP_WIDTH = SHADOW_MAP_HEIGHT = 512;

init();

setTimeout(animate, 1000);

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

function makeLogoMesh( material, w, h ) {

	var plane = new THREE.Mesh(
		new THREE.PlaneBufferGeometry( w || 500, h || 500 ),
		material
	);

	return plane

}

function init() {

	camera = new THREE.PerspectiveCamera( 70, window.innerWidth / window.innerHeight, 1, 10000 );
	camera.position.y = 400;

	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2( 0x1d91ef, 0.0015 );

	var geometry = new THREE.BoxGeometry( 400, 1000, 400 );
	var material = new THREE.MeshLambertMaterial( {  color: 0x0000ff } );


	scene.add( new THREE.AmbientLight( new THREE.Color(0.4, 0.4, 0.5) ) );

	light = new THREE.PointLight( 0xffffff );

	scene.add( light );


	light = new THREE.SpotLight( 0xffffff, 1, 0, Math.PI / 2, 1 );
	light.position.set( 0, 150, 100 );
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


	toplight = new THREE.PointLight( new THREE.Color(0.9, 0.9, 1) );
	toplight.position.y = 1000;

	scene.add( toplight );

	var textMaterial = new THREE.MeshPhongMaterial( { color: 0x000055, specular: 0xffffff } );

	var towerMaterial = new THREE.MeshPhongMaterial( { color: 0x000033, specular: 0x999999, shininess: 10 } );

	tower = new THREE.Mesh( geometry, towerMaterial );
	tower.position.y = 500;
	tower.castShadow = true;
	tower.receiveShadow = true;
	scene.add( tower );

	jspardyMesh = makeText( textMaterial );
	jspardyMesh.castShadow = true;
	jspardyMesh.receiveShadow = true;

	scene.add( jspardyMesh );

	// var planeMaterial = new THREE.MeshPhongMaterial( { color: 0xffdd99 } );
	var logo = new THREE.MeshPhongMaterial( {
		color: 0xffffff,
		map: THREE.ImageUtils.loadTexture( "jsconfasia.png" ),
		side: THREE.DoubleSide
	} );

	var logo2 = new THREE.MeshBasicMaterial( {
		color: 0xffffff,
		map: THREE.ImageUtils.loadTexture( "groupphoto.jpg" ),
		side: THREE.DoubleSide
	} );

	var logo3 = new THREE.MeshPhongMaterial( {
		color: 0xffffff,
		map: THREE.ImageUtils.loadTexture( "zz.png" ),
		side: THREE.DoubleSide
	} );


	var ground = makePlaneMesh( logo );
	ground.castShadow = false;
	ground.receiveShadow = true;
	scene.add( ground );

	var distanceAway = 250;
	var raise = 300;

	logoMesh1 = makeLogoMesh( logo )
	logoMesh1.position.set(0, raise, distanceAway)
	scene.add(logoMesh1);

	logoMesh2 = makeLogoMesh( logo )
	logoMesh2.position.set(0, raise, -distanceAway)
	logoMesh2.rotation.y = Math.PI
	scene.add(logoMesh2);

	logoMesh3 = makeLogoMesh( logo )
	logoMesh3.position.set(-distanceAway, raise, 0)
	logoMesh3.rotation.y = -Math.PI / 2
	scene.add(logoMesh3);

	logoMesh4 = makeLogoMesh( logo )
	logoMesh4.position.set(distanceAway, raise, 0)
	logoMesh4.rotation.y = Math.PI / 2
	scene.add(logoMesh4);

	logoMesh5 = makeLogoMesh( logo2, 960 / 3, 639 / 3 )
	logoMesh5.position.set(0, 800, -201)
	logoMesh5.rotation.y = Math.PI
	scene.add(logoMesh5);

	logoMesh6 = makeLogoMesh( logo3, 229, 98 )
	logoMesh6.position.set(0, 800, 201)
	scene.add(logoMesh6);

	start = Date.now();

	target = new THREE.Vector3();

	camera.up = new THREE.Vector3(0.2,1,0).normalize();

	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x111111);
	renderer.setPixelRatio( window.devicePixelRatio );
	renderer.setSize( window.innerWidth, window.innerHeight );
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFShadowMap;


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

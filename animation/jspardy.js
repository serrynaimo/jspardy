var camera, scene, renderer;
var tower, target;

init();
animate();

function makeText( material ) {

	var text = new THREE.TextGeometry( 'JSPARDY', {
		size: 60,
		height: 20,
		curveSegments: 2,
		font: "helvetiker"
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
		new THREE.PlaneBufferGeometry( 1000, 1000 ),
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

	var geometry = new THREE.BoxGeometry( 200, 1000, 200 );
	var material = new THREE.MeshBasicMaterial( { wireframe: true, color: 0xffffff } );

	tower = new THREE.Mesh( geometry, material );
	tower.position.y = 500;
	scene.add( tower );


	jspardyMesh = makeText( material );
	scene.add( jspardyMesh );

	scene.add( makePlaneMesh( material ) );

	var m1 = makePlaneMesh( material )
	var m2 = makePlaneMesh( material )
	var m3 = makePlaneMesh( material )
	var m4 = makePlaneMesh( material )
	m1.position.set(- 500, 0, 500)
	m2.position.set( 500, 0, -500)
	m3.position.set(- 500, 0, -500)
	m4.position.set( 500, 0, 500)
	scene.add(m1);
	scene.add(m2);
	scene.add(m3);
	scene.add(m4);


	target = new THREE.Vector3();

	camera.up = new THREE.Vector3(0.2,1,0).normalize();

	renderer = new THREE.WebGLRenderer();
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

	var len = 4;
	var time = (Date.now() / 1000) % len;
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

	renderer.render( scene, camera );

}

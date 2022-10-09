import * as THREE from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls';
import Stats from 'three/examples/jsm/libs/stats.module';

export default class SceneInit {
  constructor(canvasId) {
    // NOTE: Core components to initialize Three.js app.
    this.scene = undefined;
    this.camera = undefined;
    this.rendere = undefined;

    // NOTE: Camera params.
    this.fov = 45;
    this.nearPlane = 1;
    this.farPlane = 1000;
    this.canvasId = canvasId;

    // NOTE: Additional components.
    this.clock = undefined;
    this.stats = undefined;
    this.controls = undefined;

    // NOTE: Lighting is basically required.
    this.ambientLight = undefined;
    this.directionalLight = undefined;
    this.light = undefined;
  }

  init () {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color( 0xEEDDB0 );
    this.camera = new THREE.PerspectiveCamera(
      this.fov,
      window.innerWidth / window.innerHeight,
      this.nearPlane,
      this.farPlane
    );
    this.camera.position.z = 20;
    this.camera.position.y = 10;
    // this.camera.rotateY(Math.PI / 2)
    this.camera.lookAt(new THREE.Vector3(0, 5,0));

    // NOTE: Specify a canvas which is already created in the HTML.
    const canvas = document.getElementById(this.canvasId);
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      // NOTE: Anti-aliasing smooths out the edges.
      antialias: true,
    });
    this.renderer.outputEncoding = THREE.sRGBEncoding;
    this.renderer.shadowMap.enabled = true
    this.renderer.shadowMap.type = THREE.BasicShadowMap
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(this.renderer.domElement);

    this.clock = new THREE.Clock();
    // this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    // this.controls.movementSpeed = 150;
    // this.controls.lookSpeed = 0.1;
    this.stats = Stats();

    // // NOTE: Directional light - parallel sun rays.
    // this.directionalLight = new THREE.DirectionalLight(0xFFFFFF, 1);
    // // this.directionalLight.castShadow = true;
    // this.directionalLight.position.set(110, 32, 60);
    // this.scene.add(this.directionalLight);

    // NOTE: Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.85)
    this.scene.add(this.ambientLight)

    // NOTE: Point of light
    this.light = new THREE.PointLight(0xffffff, 0.15, 500)
    this.light.position.set(3, 16, -3)
    this.light.castShadow = true
    this.light.shadow.camera.near = 0.1
    this.light.shadow.camera.far = 25
    this.scene.add(this.light)



    document.body.appendChild(this.stats.dom);
    // NOTE: Window resizes.
    window.addEventListener('resize', () => this.onWindowResize(), false);

    // NOTE: Load space background.
    // this.loader = new THREE.TextureLoader();
    // this.scene.background = this.loader.load('./pics/space.jpeg');

    // NOTE: Declare uniforms to pass into glsl shaders.
    // this.uniforms = {
    //   u_time: { type: 'f', value: 1.0 },
    //   colorB: { type: 'vec3', value: new THREE.Color(0xfff000) },
    //   colorA: { type: 'vec3', value: new THREE.Color(0xffffff) },
    // };
    this.animate()
  }

  animate () {
    // NOTE: Window is implied.
    // window.requestAnimationFrame(this.animate.bind(this));
    this.render();
    this.stats.update();
    // this.controls.update();
  }

  render () {
    // NOTE: Update uniform data on each render
    // this.uniforms.u_time.value += this.clock.getDelta();
    this.renderer.render(this.scene, this.camera);
  }

  onWindowResize () {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}

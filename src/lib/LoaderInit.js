import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader';

export default class LoaderInit {
  constructor(threeWorld) {
    this.threeWorld = threeWorld
    this.loadingManager = undefined
    this.carObj = undefined
    this.wheelObj = []
    this.fence = undefined
    this.tree = undefined
  }

  init () {
    // NOTE: Init Loading Manager -> that provide infos about start/progress/load/error of loading model
    this.loadingManager = new THREE.LoadingManager()

    // NOTE: Init Draco Loader -> decoder for GLB
    const dracoLoader = new DRACOLoader(this.loadingManager)
    dracoLoader.setDecoderPath('../node_modules/three/examples/js/libs/draco/gltf/')
    dracoLoader.setDecoderConfig({ type: 'js' });

    // NOTE: Init GLTF Loader
    const loader = new GLTFLoader(this.loadingManager)
    loader.setDRACOLoader(dracoLoader)

    // NOTE: Load models
    loader.load(new URL('../assets/models/car1.glb', import.meta.url).href, (gltfScene) => {
      this.carObj = gltfScene
      this.threeWorld.scene.add(this.carObj.scene)
    })

    loader.load(new URL('../assets/models/wheel.glb', import.meta.url).href, (gltfScene) => {
      for (let i = 0; i < 4; i++) {
        let newWheel = gltfScene.scene.clone()
        this.wheelObj.push(newWheel)
        this.threeWorld.scene.add(this.wheelObj[i])
      }
    })


    loader.load(new URL('../assets/models/fence.glb', import.meta.url).href, (gltfScene) => {
      this.fence = gltfScene
      this.fence.scene.position.set(10, 0, 10)
      this.fence.scene.scale.set(0.45, 0.45, 0.45)
      this.fence.scene.children[0].material = new THREE.MeshPhongMaterial({ color: 0x8E3200 })
      this.fence.scene.children[0].castShadow = true
      this.fence.scene.children[0].receiveShadow = true
      this.threeWorld.scene.add(this.fence.scene)


      for (let i = 0; i < 125; i++) {
        let newFence = this.fence.scene.clone()
        newFence.position.set(-248 + i * 4, 0, 250)
        newFence.scale.set(0.45, 0.45, 0.45)
        this.threeWorld.scene.add(newFence)
      }
      for (let i = 0; i < 125; i++) {
        let newFence = this.fence.scene.clone()
        newFence.position.set(-248 + i * 4, 0, -250)
        newFence.scale.set(0.45, 0.45, 0.45)
        this.threeWorld.scene.add(newFence)
      }
      for (let i = 0; i < 125; i++) {
        let newFence = this.fence.scene.clone()
        newFence.position.set(250, 0, - 248.5 + i * 4)
        newFence.rotation.y = Math.PI / 2
        newFence.scale.set(0.45, 0.45, 0.45)
        this.threeWorld.scene.add(newFence)
      }
      for (let i = 0; i < 125; i++) {
        let newFence = this.fence.scene.clone()
        newFence.position.set(-250, 0, - 248.25 + i * 4)
        newFence.rotation.y = Math.PI / 2
        newFence.scale.set(0.45, 0.45, 0.45)
        this.threeWorld.scene.add(newFence)
      }
    })

    loader.load(new URL('../assets/models/tree.glb', import.meta.url).href, (gltfScene) => {
      this.tree = gltfScene
      this.threeWorld.scene.add(this.tree.scene)

      let trunchi = this.tree.scene.children[0]
      let coroana = this.tree.scene.children[1]
      let round = this.tree.scene.children[2]
      let iarba = this.tree.scene.children[3]
      trunchi.material = new THREE.MeshPhongMaterial({ color: 0x361500 })
      trunchi.receiveShadow = true
      trunchi.castShadow = true
      coroana.material = new THREE.MeshPhongMaterial({ color: 0xFF1E00 })
      coroana.castShadow = true
      coroana.receiveShadow = true
      round.material = new THREE.MeshPhongMaterial({ color: 0xCCCCCC })
      round.castShadow = true
      round.receiveShadow = true
      iarba.material = new THREE.MeshPhongMaterial({ color: 0x363500 }) // nice green -> 0x36f500, 0x36a500
      iarba.castShadow = true
      iarba.receiveShadow = true

      this.tree.scene.scale.set(2.5, 2.5, 2.5)
    })
  }
}

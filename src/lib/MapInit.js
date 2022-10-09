import * as CANNON from 'cannon-es';
import * as THREE from 'three';

export default class MapInit {
  constructor(scene, world, woodMaterial) {
    this.scene = scene
    this.world = world
    this.woodMaterial = woodMaterial
  }

  init () {
    const groundMaterial = new CANNON.Material('ground')
    const wheelMaterial = new CANNON.Material('wheel')

    const sizeX = 4
    const sizeZ = 4
    const matrix = []

    for (let i = 0; i <= sizeX; i++) {
      matrix.push([])
      for (let j = 0; j <= sizeZ; j++) {
        if (i === 0 || i === sizeX - 1 || j === 0 || j === sizeZ - 1) {
          const height = 1
          // const height = 3
          matrix[i].push(height)
          continue
        }

        const height = 1
        // const height = Math.cos((i / sizeX) * Math.PI * 5) * Math.cos((j / sizeZ) * Math.PI * 5) * 2 + 2
        matrix[i].push(height)
      }
    }

    const heightFieldShape = new CANNON.Heightfield(matrix, {
      elementSize: 500 / sizeX,
    })


    const heightFieldBody = new CANNON.Body({mass: 0, material: groundMaterial})
    heightFieldBody.addShape(heightFieldShape)
    heightFieldBody.position.set(
      -(sizeX * heightFieldShape.elementSize) / 2,
      -1,
      (sizeZ * heightFieldShape.elementSize) / 2
    )
    heightFieldBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    this.world.addBody(heightFieldBody)

    // Define interactions between wheels and ground
    const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
      friction: 0.3,
      restitution: 0,
      contactEquationStiffness: 1000,
    })
    this.world.addContactMaterial(wheel_ground)

    // const groundMaterial = new CANNON.Material('ground')
    // const wheelMaterial = new CANNON.Material('wheel')
    //
    // // Static ground plane
    // // const groundShape = new CANNON.Plane()
    // const groundShape = new CANNON.Box(new CANNON.Vec3(100, 100, 0.1))
    // const groundBody = new CANNON.Body({ mass: 0, material: groundMaterial})
    // groundBody.addShape(groundShape)
    // groundBody.quaternion.setFromEuler(-Math.PI / 2, 0, 0)
    // this.world.addBody(groundBody)
    //
    // const wheel_ground = new CANNON.ContactMaterial(wheelMaterial, groundMaterial, {
    //   friction: 0.3,
    //   restitution: 0,
    //   contactEquationStiffness: 1000,
    // })
    // this.world.addContactMaterial(wheel_ground)
    //
    // NOTE: ThreeJS plane geometry
    // const geometry = new THREE.PlaneGeometry(250, 250)
    // const materialGeometry = new THREE.MeshBasicMaterial({
    //   color: 0xFCE2DB,
    //   side: THREE.DoubleSide
    // });
    // const plane = new THREE.Mesh(geometry, materialGeometry);
    // this.scene.scene.add(plane)
    // plane.quaternion.copy(heightFieldBody.quaternion)
    // let texture = new THREE.TextureLoader().load(require('../assets/pattern.png'));
    // texture.wrapS = THREE.RepeatWrapping;
    // texture.wrapT = THREE.RepeatWrapping;
    // texture.repeat.set(50, 50);
    const geometry = new THREE.PlaneGeometry( 500, 500 );
    // const material = new THREE.MeshPhongMaterial( {color: 0xF9813A, side: THREE.DoubleSide} );
    // const material = new THREE.MeshPhongMaterial( {color: 0x749F82, side: THREE.DoubleSide} ); //nice green
    // const material = new THREE.MeshPhongMaterial( {color: 0x425F57, side: THREE.DoubleSide} ); //nice blue
    // const material = new THREE.MeshPhongMaterial( {color: 0x9CFF2E, side: THREE.DoubleSide} );
    const material = new THREE.MeshPhongMaterial( {color: 0xFFD881, side: THREE.DoubleSide} );
    // let material = new THREE.MeshPhongMaterial({
    //   map: texture,
    //   side: THREE.DoubleSide,
    //   // opacity: 0.8,
    //   // transparent: true
    // })
    const plane = new THREE.Mesh( geometry, material );
    plane.rotation.x = -Math.PI / 2
    plane.receiveShadow = true
    this.scene.scene.add(plane)



    // NOTE: Add physics for fences
    const fencesShape = new CANNON.Box(new CANNON.Vec3(250, 4, 0.2))
    const fences = new CANNON.Body({
      material: this.woodMaterial
    })
    fences.addShape(fencesShape)
    fences.position.set(0, 4, 250)
    this.world.addBody(fences)

    const fencesShape2 = new CANNON.Box(new CANNON.Vec3(250, 4, 0.2))
    const fences2 = new CANNON.Body({
      material: this.woodMaterial
    })
    fences2.addShape(fencesShape2)
    fences2.position.set(0, 4, -250)
    this.world.addBody(fences2)

    const fencesShape3 = new CANNON.Box(new CANNON.Vec3(0.2, 4, 250))
    const fences3 = new CANNON.Body({
      material: this.woodMaterial
    })
    fences3.addShape(fencesShape3)
    fences3.position.set(-250, 4, 0)
    this.world.addBody(fences3)

    const fencesShape4 = new CANNON.Box(new CANNON.Vec3(0.2, 4, 250))
    const fences4 = new CANNON.Body({
      material: this.woodMaterial
    })
    fences4.addShape(fencesShape4)
    fences4.position.set(250, 4, 0)
    this.world.addBody(fences4)
  }
}

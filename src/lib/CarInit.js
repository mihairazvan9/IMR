import * as CANNON from 'cannon-es';
import * as THREE from 'three';

import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";

export default class CarInit {
  constructor(scene, world, carObj, wheelObj, carMaterial) {
    this.scene = scene
    this.world = world
    this.vehicle = undefined
    this.boxCamera = undefined
    this.pointCamera = undefined
    this.cameraDistance = 15
    this.carObj = carObj
    this.wheelObj = wheelObj
    this.carMaterial = carMaterial
  }
  init () {
    // Build the car chassis
    const chassisShape = new CANNON.Box(new CANNON.Vec3(2, 0.35, 1))
    const chassisBody = new CANNON.Body({
      mass: 150,
      material: this.carMaterial
    })
    chassisBody.addShape(chassisShape)
    chassisBody.position.set(0, 8, 0)
    chassisBody.angularVelocity.set(0, 0.5, 0)
    // Build the top car chassis
    // const topShape = new CANNON.Sphere(1)
    // const topBody = new CANNON.Body({mass: 0})
    // chassisBody.addShape(topShape)
    const topShape = new CANNON.Box(new CANNON.Vec3(1.15, 0.425, 0.74))
    const topBody = new CANNON.Body({mass: 0})
    chassisBody.addShape(topShape)

    // Create the vehicle
    this.vehicle = new CANNON.RaycastVehicle({
      chassisBody
    })

    // NOTE: Set top car shape position
    this.vehicle.chassisBody.shapeOffsets[1].x = 0.75
    this.vehicle.chassisBody.shapeOffsets[1].y = 0.75
    const wheelOptions = {
      radius: 0.5,
      directionLocal: new CANNON.Vec3(0, -1, 0),
      suspensionStiffness: 45,
      suspensionRestLength: 0.4,
      frictionSlip: 5,
      dampingRelaxation: 2.3,
      dampingCompression: 4.5,
      maxSuspensionForce: 100000,
      rollInfluence: 0.01,
      axleLocal: new CANNON.Vec3(0, 0, 1),
      chassisConnectionPointLocal: new CANNON.Vec3(-1, 0, 1),
      maxSuspensionTravel: 0.25,
      customSlidingRotationalSpeed: -30,
      useCustomSlidingRotationalSpeed: true,
    }

    wheelOptions.chassisConnectionPointLocal.set(-1.4, -0.15, 1)
    this.vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(-1.4, -0.15, -1)
    this.vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(1.25, -0.15, 0.9)
    this.vehicle.addWheel(wheelOptions)

    wheelOptions.chassisConnectionPointLocal.set(1.25, -0.15, -0.9)
    this.vehicle.addWheel(wheelOptions)

    this.vehicle.addToWorld(this.world)

    // Add the wheel bodies
    const wheelBodies = []
    const wheelMaterial = new CANNON.Material('wheel')
    this.vehicle.wheelInfos.forEach((wheel) => {
      const cylinderShape = new CANNON.Cylinder(wheel.radius, wheel.radius, wheel.radius / 1.7, 10)
      const wheelBody = new CANNON.Body({
        mass: 1,
        material: wheelMaterial,
      })
      wheelBody.type = CANNON.Body.KINEMATIC
      wheelBody.collisionFilterGroup = 0 // turn off collisions
      const quaternion = new CANNON.Quaternion().setFromEuler(-Math.PI / 2, 0, 0)
      wheelBody.addShape(cylinderShape, new CANNON.Vec3(), quaternion)
      wheelBodies.push(wheelBody)
      this.world.addBody(wheelBody)
    })



    // let wheel = []
    // const geometry = new THREE.CylinderGeometry( 0.5, 0.5, 0.25, 10);
    // const material = new THREE.MeshPhongMaterial( {color: 0x414141} );
    // for (let i = 0; i < 4; i++) {
    //   wheel[i] = new THREE.Mesh(geometry, material);
    //   wheel[i].receiveShadow = true
    //   wheel[i].castShadow = true
    //   this.scene.scene.add(wheel[i])
    // }


    let boxBody = []
    for (let i = 1; i <10; i ++) {
      // Box for playground
      const boxShape = new CANNON.Box(new CANNON.Vec3(1, 1, 1))
      boxBody[i] = new CANNON.Body({mass: 0.1})
      boxBody[i].addShape(boxShape)
      boxBody[i].position.set(0, i * 2.1, 10)
      this.world.addBody(boxBody[i])
    }


    let boxThree = []
    let colors = [ 0xF9F5EB, 0xFFC23C, 0xFCE2DB, 0x72FFFF, 0xF1F1F1, 0xFFB4B4, 0xA5C9CA, 0xFFC18E, 0xC8B6E2]
    for (let i = 1; i <10; i ++) {
      // Box for playground
      boxThree[i] = new THREE.Mesh(
        new THREE.BoxGeometry(2, 2, 2),
        new THREE.MeshPhongMaterial({ color: colors[i - 1] })
      )
      boxThree[i].receiveShadow = true
      boxThree[i].castShadow = true
      this.scene.scene.add(boxThree[i])

    }


    // NOTE: Add point for camera follow
    this.pointCamera = new THREE.Object3D()
    this.scene.scene.add(this.pointCamera)

    this.boxCamera = new THREE.Object3D()
    this.boxCamera.position.copy(this.scene.camera.position)
    this.scene.scene.add(this.boxCamera)
    this.boxCamera.parent = this.pointCamera
    this.control()

    this.world.addEventListener('postStep', () => {
      // NOTE: Update wheel position
      for (let i = 0; i < this.vehicle.wheelInfos.length; i++) {
        this.vehicle.updateWheelTransform(i)
        const transform = this.vehicle.wheelInfos[i].worldTransform

        const wheelBody = wheelBodies[i]
        wheelBody.position.copy(transform.position)
        wheelBody.quaternion.copy(transform.quaternion)

        this.wheelObj[i].position.copy(wheelBody.position)
        this.wheelObj[i].quaternion.copy(wheelBody.quaternion)
        if (i === 0 || i === 2) this.wheelObj[i].rotateY(Math.PI);
      }

      // NOTE: Update box position
      for (let i = 1; i < boxThree.length; i++) {
        boxThree[i].position.copy(boxBody[i].position)
        boxThree[i].quaternion.copy(boxBody[i].quaternion)
      }

      // NOTE: Update car position
      this.carObj.scene.children[0].position.copy(this.vehicle.chassisBody.position)
      this.carObj.scene.children[0].quaternion.copy(this.vehicle.chassisBody.quaternion)
      this.carObj.scene.children[0].rotateX(-Math.PI / 2)
      this.carObj.scene.children[0].rotateZ(-Math.PI / 2)
      this.carObj.scene.children[0].translateX(2.5)
      this.carObj.scene.children[0].translateZ(-0.5)

      // NOTE: Update camera position with smooth effect
      this.pointCamera.position.copy(this.vehicle.chassisBody.position)
      this.pointCamera.quaternion.copy(this.vehicle.chassisBody.quaternion)
      this.pointCamera.rotateY(Math.PI / 2)
      this.scene.camera.position.lerp(this.boxCamera.getWorldPosition(new THREE.Vector3()),  0.075);
      this.scene.camera.lookAt(this.pointCamera.position);
    })
  }

  animate () {
  }

  control () {
    // Add force on keydown
    document.addEventListener('keydown', (event) => {
      const maxSteerVal = 0.6
      const maxForce = 500
      const brakeForce = 10

      switch (event.code) {
        case 'KeyR':
          this.cameraDistance += 0.15
          break
        case 'KeyE':
          this.cameraDistance -= 0.15
          break

        case 'KeyW':
        case 'ArrowUp':
          this.vehicle.applyEngineForce(-maxForce, 2)
          this.vehicle.applyEngineForce(-maxForce, 3)
          break

        case 'KeyS':
        case 'ArrowDown':
          this.vehicle.applyEngineForce(maxForce, 2)
          this.vehicle.applyEngineForce(maxForce, 3)
          break

        case 'KeyA':
        case 'ArrowLeft':
          this.vehicle.setSteeringValue(maxSteerVal, 0)
          this.vehicle.setSteeringValue(maxSteerVal, 1)
          break

        case 'KeyD':
        case 'ArrowRight':
          this.vehicle.setSteeringValue(-maxSteerVal, 0)
          this.vehicle.setSteeringValue(-maxSteerVal, 1)
          break

        case 'Space':
          this.vehicle.setBrake(brakeForce, 0)
          this.vehicle.setBrake(brakeForce, 1)
          this.vehicle.setBrake(brakeForce, 2)
          this.vehicle.setBrake(brakeForce, 3)
          break
      }
    })

    // Reset force on keyup
    document.addEventListener('keyup', (event) => {
      switch (event.code) {
        case 'KeyR':
          this.cameraDistance = this.cameraDistance
          break
        case 'KeyE':
          this.cameraDistance = this.cameraDistance
          break
        case 'KeyW':
        case 'ArrowUp':
          this.vehicle.applyEngineForce(0, 2)
          this.vehicle.applyEngineForce(0, 3)
          break

        case 'KeyS':
        case 'ArrowDown':
          this.vehicle.applyEngineForce(0, 2)
          this.vehicle.applyEngineForce(0, 3)
          break

        case 'KeyA':
        case 'ArrowLeft':
          this.vehicle.setSteeringValue(0, 0)
          this.vehicle.setSteeringValue(0, 1)
          break

        case 'KeyD':
        case 'ArrowRight':
          this.vehicle.setSteeringValue(0, 0)
          this.vehicle.setSteeringValue(0, 1)
          break

        case 'Space':
          this.vehicle.setBrake(0, 0)
          this.vehicle.setBrake(0, 1)
          this.vehicle.setBrake(0, 2)
          this.vehicle.setBrake(0, 3)
          break
      }
    })
  }
}

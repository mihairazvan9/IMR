<template>
  <canvas id="game-setup"></canvas>
</template>

<script setup>
  import { onMounted } from 'vue'
  import * as CANNON from 'cannon-es'
  import CannonDebugger from 'cannon-es-debugger'
  import * as THREE from 'three'
  import SceneInit from '@/lib/SceneInit'
  import MapInit from '@/lib/MapInit'
  import CarInit from '@/lib/CarInit'
  import LoaderInit from '@/lib/LoaderInit'

  onMounted(() => {
    const threeWorld = new SceneInit('game-setup')
    threeWorld.init()

    // NOTE: Add axis helper
    const axesHelper = new THREE.AxesHelper(8)
    // threeWorld.scene.add(axesHelper)


    // NOTE: Initialize physic word
    const cannonWorld = new CANNON.World({
      gravity: new CANNON.Vec3(0, -9.82, 0)
    })

    const woodMaterial = new CANNON.Material('wood')
    const carMaterial = new CANNON.Material('car')
    const contactMaterial = new CANNON.ContactMaterial(woodMaterial, carMaterial, {
      friction: 0,
    })
    cannonWorld.addContactMaterial(contactMaterial)

    // NOTE: Add game map THREE and CANNON
    const mapInit = new MapInit(threeWorld, cannonWorld, woodMaterial)
    mapInit.init()


    // NOTE: Add game map THREE and CANNON
    const loaderInit = new LoaderInit(threeWorld)
    loaderInit.init()

    loaderInit.loadingManager.onLoad = function () {
      const carInit = new CarInit(threeWorld, cannonWorld, loaderInit.carObj, loaderInit.wheelObj, carMaterial)
      carInit.init()

      // NOTE: Add CANNON debugger
      const cannonDebugger = new CannonDebugger(threeWorld.scene, cannonWorld, {
        color: 0xcccccc
      })

      const animate = () => {
        cannonWorld.fixedStep()
        // cannonDebugger.update()
        carInit.animate()
        threeWorld.animate()
        window.requestAnimationFrame(animate)
      }
      animate()
    }
  })
</script>

<style lang="scss">
  * {
    margin: 0;
    padding: 0;
    box-sizing: content-box;
    overflow: hidden;
  }
</style>

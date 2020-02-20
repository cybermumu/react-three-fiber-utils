import React, { useEffect, useState } from 'react'
import { render } from "react-dom";
import * as THREE from 'three'
import * as CANNON from 'cannon'
import { Canvas } from 'react-three-fiber'
import { useCannon, CannonProvider, CannonDebugRenderer } from 'react-three-fiber-utils';

import './styles.css';

function Plane({ position }) {
  const ref = useCannon({ 
    mass: 0,
    shape: new CANNON.Plane(),
    position: new CANNON.Vec3(...position)
  })

  return (
    <mesh ref={ref} receiveShadow>
      <planeGeometry attach="geometry" args={[100, 100]} />
      <meshStandardMaterial attach="material" color="#888888" />
    </mesh>
  )
}

function Box({ position }) {

  const ref = useCannon({ 
    mass: 5,
    shape: new CANNON.Box(new CANNON.Vec3(1, 1, 1)),
    position: new CANNON.Vec3(...position)
  }, body => {
    body.addEventListener("collide", handleCollide);
    return () => body.removeEventListener("collide", handleCollide);
  })

  function handleCollide(e) {
    console.log("The sphere just collided with the ground!");
    console.log("Collided with body:",e.body);
    console.log("Contact between bodies:",e.contact);
  }

  return (
    <mesh ref={ref} castShadow receiveShadow>
      <sphereBufferGeometry attach="geometry" args={[1, 10, 10]}/>
      <meshStandardMaterial attach="material" roughness={0.5} color="#575757" />
    </mesh>
  )
}

function App() {
  return (
    <Canvas
      shadowMap
      camera={{ position: [0, 0, 15] }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.outputEncoding = THREE.sRGBEncoding
      }}>
      <pointLight position={[-10, -10, 30]} intensity={0.25} />
      <spotLight intensity={0.3} position={[30, 30, 50]} angle={0.2} penumbra={1} castShadow />
      <CannonProvider>
        <CannonDebugRenderer/>
        <Plane position={[0, 0, -10]} />
        <Box position={[1, 0, 1]} />
        <Box position={[2, 1, 5]} />
        <Box position={[0, 0, 6]} />
        <Box position={[-1, 1, 8]} />
        <Box position={[-2, 2, 13]} />
        <Box position={[2, -1, 13]} />
      </CannonProvider>
    </Canvas>
  )
}

render(<App />, document.getElementById("app"));

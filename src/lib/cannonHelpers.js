import * as THREE from 'three'
import * as CANNON from 'cannon'
import React, { useState, useEffect, useContext, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import CannonDebugRendererHelper from './cannonDebugRenderer.js'

const context = React.createContext();

export function CannonProvider({ children, gravity = [0, 0, -25] }) {

  const [world] = useState(() => new CANNON.World())

  useEffect(() => {
    world.broadphase = new CANNON.NaiveBroadphase()
    world.solver.iterations = 10;
    world.gravity.set(...gravity);
  }, [world])

  useFrame(() => world.step(1 / 60))
  
  return <context.Provider value={world} children={children} />

}

export const CannonDebugRenderer = () => {
  
  const world = useContext(context);
  const { scene } = useThree();
  const [ cannonDebugRenderer ] = useState(() => new CannonDebugRendererHelper( scene, world ));

  useFrame(() => cannonDebugRenderer.update());

  return null;

}

export function useCannon({ ...props }, afterAddBodyCallback, deps = []) {

  const ref = useRef()
  const world = useContext(context)
  const [body] = useState(() => {
      return new CANNON.Body(props)
  })

  useEffect(() => {

    let beforeRemoveBodyCallback;
    world.addBody(body)

    if (afterAddBodyCallback) {
      beforeRemoveBodyCallback = afterAddBodyCallback(body);
    } 

    return () => {
      beforeRemoveBodyCallback();
      world.removeBody(body);
    }
    
  }, deps)

  useFrame(() => {
    if (ref.current) {
      ref.current.position.copy(body.position)
      ref.current.quaternion.copy(body.quaternion)
    }
  })

  return ref

}

export const useWorld = () => {
  const world = useContext(context);
  return world;
}


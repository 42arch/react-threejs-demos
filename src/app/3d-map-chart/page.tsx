'use client'

import { Canvas } from '@react-three/fiber'
import Viewer from './Viewer'

export default function Page() {
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, -10, 140],
          up: [0, 0, 1]
        }}
      >
        <Viewer />
      </Canvas>
    </>
  )
}

'use client'

import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export default function Page() {
  return (
    <>
      <Canvas
        camera={{
          fov: 45,
          near: 0.1,
          far: 1000,
          position: [0, -1, 0.5],
          up: [0, 0, 1]
        }}
      >
        <Experience />
      </Canvas>
    </>
  )
}

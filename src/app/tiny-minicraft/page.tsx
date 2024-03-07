'use client'

import { Canvas, useThree } from '@react-three/fiber'
import Experience from './Experience'

export default function Page() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{
          position: [500, 800, 1300],
          fov: 45,
          near: 1,
          far: 10000
        }}
      >
        <Experience />
      </Canvas>
    </>
  )
}

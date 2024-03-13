'use client'

import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export default function Page() {
  return (
    <>
      <Canvas
        shadows
        dpr={[1, 2]}
        camera={{ position: [600, 750, -1221], far: 100000, fov: 45, near: 1 }}
      >
        <Experience />
      </Canvas>
    </>
  )
}

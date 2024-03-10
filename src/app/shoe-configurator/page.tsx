'use client'

import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export default function Page() {
  return (
    <>
      <Canvas shadows camera={{ position: [0, 0, 4], fov: 45 }}>
        <Experience />
      </Canvas>
    </>
  )
}

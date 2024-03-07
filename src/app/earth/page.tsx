'use client'

import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export default function Page() {
  return (
    <>
      <Canvas shadows dpr={[1, 2]} camera={{ position: [0, 0, 1.75] }}>
        <Experience />
      </Canvas>
    </>
  )
}

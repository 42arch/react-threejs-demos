'use client'

import { Canvas } from '@react-three/fiber'
import Viewer from './Viewer'

export default function Page() {
  return (
    <>
      <Canvas shadows dpr={[1, 2]}>
        <Viewer />
      </Canvas>
    </>
  )
}

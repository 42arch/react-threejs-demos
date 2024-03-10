import { Suspense, useEffect, useRef } from 'react'
import { Environment, OrbitControls, useTexture } from '@react-three/drei'
import { useFrame, useThree } from '@react-three/fiber'
import { useControls } from 'leva'
import { Perf } from 'r3f-perf'
import { Mesh } from 'three'

const Earth = () => {
  const earthRef = useRef<Mesh>(null!)
  const texture = useTexture('./earth/worldColour.5400x2700.jpg')
  const displamentMap = useTexture('./earth/gebco_bathy_2700x1350.jpg')
  const { gl } = useThree()

  const { scale, wireframe } = useControls({
    wireframe: false,
    scale: {
      value: 0.15,
      min: -0.4,
      max: 1,
      step: 0.01
    }
  })

  useEffect(() => {
    texture.anisotropy = gl.capabilities.getMaxAnisotropy()
  }, [texture, gl])

  useFrame((_, delta) => {
    earthRef.current.rotation.y += delta / 12
  })

  return (
    <>
      <mesh ref={earthRef} castShadow receiveShadow>
        <icosahedronGeometry args={[1, 128]} />
        <meshStandardMaterial
          attach='material'
          wireframe={wireframe}
          map={texture}
          displacementMap={displamentMap}
          displacementScale={scale}
        />
      </mesh>
    </>
  )
}

const Experience = () => {
  const { pref, light } = useControls({
    pref: false,
    light: false
  })

  return (
    <>
      {pref ? <Perf position='top-left' /> : null}
      <OrbitControls />
      <Environment files='./earth/venice_sunset_1k.hdr' />
      <color args={[0x000000]} attach='background' />
      <ambientLight intensity={8} visible={light} />
      <directionalLight
        intensity={Math.PI}
        position={[4, 0, 2]}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-left={-2}
        shadow-camera-right={2}
        shadow-camera-top={-2}
        shadow-camera-bottom={2}
        shadow-camera-near={0.1}
        shadow-camera-far={8}
      />
      <Suspense fallback={null}>
        <Earth />
      </Suspense>
    </>
  )
}

export default Experience

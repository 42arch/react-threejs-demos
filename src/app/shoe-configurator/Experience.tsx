import {
  ContactShadows,
  Environment,
  Float,
  OrbitControls,
  useGLTF
} from '@react-three/drei'
import { useControls } from 'leva'
import { Suspense } from 'react'

const Shoe = () => {
  const { nodes, materials } = useGLTF('./shoe-configurator/shoe-draco.glb')

  const { mesh, laces, band, caps, sole, stripes, inner, patch } = useControls({
    mesh: {
      value: '#fff'
    },
    laces: {
      value: '#fff'
    },
    band: {
      value: '#fff'
    },
    caps: {
      value: '#fff'
    },
    sole: {
      value: '#fff'
    },
    stripes: {
      value: '#fff'
    },
    patch: {
      value: '#fff'
    },
    inner: {
      value: '#fff'
    }
  })

  return (
    <>
      <Float speed={1.5} floatIntensity={0.2} floatingRange={[0, 0.2]}>
        <group dispose={null}>
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe.geometry}
            material={materials.laces}
            material-color={laces}
          />
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe_1.geometry}
            material={materials.mesh}
            material-color={mesh}
          />
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe_2.geometry}
            material={materials.caps}
            material-color={caps}
          />
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe_3.geometry}
            material={materials.inner}
            material-color={inner}
          />
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe_4.geometry}
            material={materials.sole}
            material-color={sole}
          />
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe_5.geometry}
            material={materials.stripes}
            material-color={stripes}
          />
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe_6.geometry}
            material={materials.band}
            material-color={band}
          />
          <mesh
            castShadow
            receiveShadow
            //@ts-expect-error
            geometry={nodes.shoe_7.geometry}
            material={materials.patch}
            material-color={patch}
          />
        </group>
      </Float>
    </>
  )
}

const Experience = () => {
  return (
    <>
      <OrbitControls
        minPolarAngle={Math.PI / 2}
        maxPolarAngle={Math.PI / 2}
        enableZoom={false}
        enablePan={false}
      />
      <color attach='background' args={['#ffffff']} />
      <ambientLight intensity={1} />
      <spotLight
        intensity={0.5}
        angle={0.1}
        penumbra={1}
        position={[10, 15, 10]}
        castShadow
      />
      <Environment preset='city' />
      <Suspense fallback={null}>
        <Shoe />
      </Suspense>

      <ContactShadows
        position={[0, -0.8, 0]}
        opacity={0.25}
        scale={10}
        blur={1.5}
        far={0.8}
      />
    </>
  )
}

export default Experience

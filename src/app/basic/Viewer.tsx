import {
  ContactShadows,
  Environment,
  OrbitControls,
  Sky
} from '@react-three/drei'
import { useControls } from 'leva'

const Viewer = () => {
  const { position, rotation, scale } = useControls({
    position: {
      x: 0,
      y: 0,
      z: 0
    },
    rotation: {
      x: 0,
      y: 0,
      z: 0
    },
    scale: {
      value: 1,
      min: 0.4,
      max: 2.5,
      step: 0.01
    }
  })

  const {
    color,
    wireframe,
    transparent,
    emissive,
    opacity,
    roughness,
    metalness,
    reflectivity,
    ior
  } = useControls({
    color: {
      value: '#fcd34d'
    },
    wireframe: {
      value: false
    },
    transparent: {
      value: true
    },
    opacity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    emissive: {
      value: '#f87171'
    },
    roughness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    metalness: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    reflectivity: {
      value: 1,
      min: 0,
      max: 1,
      step: 0.01
    },
    ior: {
      value: 1,
      min: 1,
      max: 2.5,
      step: 0.01
    }
  })

  return (
    <>
      <OrbitControls
        makeDefault
        minPolarAngle={0}
        maxPolarAngle={Math.PI / 2.5}
      />
      <pointLight position={[10, 10, 10]} />
      <mesh
        receiveShadow
        castShadow
        position={[position.x, position.y, position.z]}
        rotation-x={rotation.x}
        rotation-y={rotation.y}
        rotation-z={rotation.z}
        scale={scale}
      >
        <boxGeometry />
        <meshPhysicalMaterial
          transparent={transparent}
          opacity={opacity}
          wireframe={wireframe}
          emissive={emissive}
          roughness={roughness}
          metalness={metalness}
          color={color}
          reflectivity={reflectivity}
          ior={ior}
        />
      </mesh>

      <ContactShadows
        frames={1}
        position={[0, -0.5, 0]}
        scale={10}
        opacity={0.4}
        far={1}
        blur={2}
      />

      <Environment preset='city' background={true} />
      <Sky />
    </>
  )
}

export default Viewer

import { Box, OrbitControls, RenderTexture, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useControls } from 'leva'

const BoxView = () => {
  const { wireframe } = useControls({
    wireframe: false
  })

  return (
    <>
      <mesh>
        <boxGeometry />
        <meshStandardMaterial wireframe={wireframe} color='yellow' />
      </mesh>
    </>
  )
}

const Experience = () => {
  const { cameraPosition, cameraUp } = useControls({
    cameraPosition: {
      x: 4,
      y: 0,
      z: 0
    },
    cameraUp: {
      x: 0,
      y: 1,
      z: 0
    }
  })

  useFrame(({ camera }) => {
    camera.position.x = cameraPosition.x
    camera.position.y = cameraPosition.y
    camera.position.z = cameraPosition.z

    camera.up.x = cameraUp.x
    camera.up.y = cameraUp.y
    camera.up.z = cameraUp.z

    camera.lookAt(0, 0, 0)
  })

  return (
    <>
      {/* <OrbitControls makeDefault /> */}
      <ambientLight />
      <BoxView />
    </>
  )
}

export default Experience

import {
  Environment,
  GizmoHelper,
  GizmoViewport,
  OrbitControls
} from '@react-three/drei'
import Map from './Map'

const Viewer = () => {
  return (
    <>
      <color args={['#fffbeb']} attach='background' />
      <ambientLight />
      <pointLight position={[10, 10, 10]} />

      <OrbitControls makeDefault />
      <Environment preset='city' />

      <GizmoHelper alignment='bottom-right' margin={[80, 80]}>
        <GizmoViewport />
      </GizmoHelper>
      <Map />
    </>
  )
}

export default Viewer

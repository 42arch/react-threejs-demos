import { useMemo, useRef } from 'react'
import { Mesh, Plane, Vector3 } from 'three'
import useDragSnap from './useDragSnap'
import { useControls } from 'leva'
import { Grid, OrbitControls } from '@react-three/drei'
import ViewportHelper from '@/components/ViewportHelper'

const Viewer = () => {
  const snap = useControls('Snap To Grid', {
    x: { value: 1, min: 0, max: 5, step: 1 },
    y: { value: 1, min: 0, max: 5, step: 1 },
    z: { value: 1, min: 0, max: 5, step: 1 }
  })
  const initPosition: [number, number, number] = [0.5, 0.5, 0.5]
  const plane = useMemo(() => new Plane(new Vector3(0, 1, 0), 0), [])
  const boxRef = useRef<Mesh>(null!)

  const bind = useDragSnap(
    ([x, y, z]: [number, number, number]) => {
      boxRef.current.position.x = x + initPosition[0]
      boxRef.current.position.y = y + initPosition[1]
      boxRef.current.position.z = z + initPosition[2]
    },
    plane,
    snap
  )

  return (
    <>
      <ambientLight />
      <OrbitControls makeDefault />
      <pointLight position={[10, 10, 10]} />
      <mesh ref={boxRef} position={initPosition} {...(bind() as any)}>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial attach='material' />
      </mesh>

      <Grid
        args={[20, 20]}
        sectionColor='#e30000'
        sectionSize={1}
        cellSize={0}
        cellThickness={0.5}
      />
      <ViewportHelper />
    </>
  )
}

export default Viewer

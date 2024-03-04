import { useThree } from '@react-three/fiber'
import { useDrag } from '@use-gesture/react'
import { useState } from 'react'
import { Plane, Vector3 } from 'three'

const useDragSnap = (
  callback: (position: [number, number, number]) => void,
  plane: Plane,
  snap = { x: 0, y: 0, z: 0 }
) => {
  const { controls } = useThree() as any
  const [intersect] = useState(() => new Vector3())

  const nearest = (val: number, snap: number) =>
    snap ? Math.round(val / snap) * snap : val

  return useDrag(({ active, event }: any) => {
    if (active) {
      if (controls) {
        controls.enabled = false
      }
      event.ray.intersectPlane(plane, intersect)
      const [x, y, z] = intersect.toArray()
      callback([nearest(x, snap.x), nearest(y, snap.y), nearest(z, snap.z)])
    } else {
      controls.enabled = true
    }
  })
}

export default useDragSnap

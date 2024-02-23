import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { AdditiveBlending, DoubleSide, PlaneGeometry } from 'three'
import { flatten, max, min } from 'lodash'
import data from './data.json'
import { OrbitControls } from '@react-three/drei'

function normalize(data: number[][], scale: number) {
  const flattenArray = flatten(data)
  const minV = min(flattenArray)!
  const maxV = max(flattenArray)!
  const heightArray = flattenArray.map(
    (elev) => (scale * (elev - minV)) / (maxV - minV)
  )
  return heightArray
}

const Experience = () => {
  const planeGeometryRef = useRef<PlaneGeometry>(null!)

  const { scale, color } = useControls({
    scale: {
      value: 0.4,
      min: 0.01,
      max: 1,
      step: 0.01
    },
    color: '#ffffffff'
  })

  useEffect(() => {
    const dataArray = normalize(data, scale)
    const geometry = planeGeometryRef.current
    const positions = geometry.attributes.position.array
    for (let i = 0; i < positions.length; i++) {
      if ((i + 1) % 3 === 0) {
        positions[i] = dataArray[Math.floor(i / 3)]
      }
    }
    geometry.attributes.position.needsUpdate = true
  }, [scale])

  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <color args={['#000000']} attach='background' />
      <mesh>
        <planeGeometry ref={planeGeometryRef} args={[1, 1, 255, 255]} />
        <meshBasicMaterial
          color={color}
          wireframe
          transparent
          depthWrite={false}
          side={DoubleSide}
          blending={AdditiveBlending}
        />
      </mesh>
    </>
  )
}

export default Experience

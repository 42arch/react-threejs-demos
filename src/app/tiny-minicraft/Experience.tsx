import ViewportHelper from '@/components/ViewportHelper'
import { OrbitControls, useTexture } from '@react-three/drei'
import { ThreeEvent, useThree } from '@react-three/fiber'
import { useEffect, useRef, useState } from 'react'
import { Mesh, SRGBColorSpace, Vector3 } from 'three'

const Experience = () => {
  const blockTexture = useTexture('./tiny-minecraft/dirt.jpg')
  const grassTexture = useTexture('./tiny-minecraft/grass.jpg')
  grassTexture.colorSpace = SRGBColorSpace
  blockTexture.colorSpace = SRGBColorSpace

  const rollOverRef = useRef<Mesh>(null!)
  const planeRef = useRef<Mesh>(null!)
  const blocksRef = useRef<Array<Mesh>>([])
  const [blocks, setBlocks] = useState<Vector3[]>([])
  const { raycaster, camera, pointer } = useThree()

  const handleRollOverMove = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation()
  }

  const handlePointerMove = () => {
    raycaster.setFromCamera(pointer, camera)

    const intersects = raycaster.intersectObjects(
      [planeRef.current, ...blocksRef.current],
      false
    )

    if (intersects.length > 0) {
      const intersect = intersects[0]

      if (intersect.face) {
        const { x, y, z } = intersect.face.normal
        const normalY = y <= 0 ? 1 : y
        const normal = new Vector3(x, normalY, z)

        rollOverRef.current.position.copy(intersect.point).add(normal)

        rollOverRef.current.position
          .divideScalar(50)
          .floor()
          .multiplyScalar(50)
          .addScalar(25)
      }
    }
  }

  const handlePointerDown = () => {
    const position = rollOverRef.current.position
    const intersects = raycaster.intersectObjects(
      [planeRef.current, ...blocksRef.current],
      false
    )
    if (intersects.length <= 0) {
      return
    }
    const intersect = intersects[0]

    if (
      blocksRef.current.find((block) => block.position.equals(position)) &&
      intersect.face
    ) {
      const newPosition = new Vector3(position.x, position.y, position.z)
      newPosition.copy(intersect.point).add(intersect.face.normal)
      newPosition.divideScalar(50).floor().multiplyScalar(50).addScalar(25)
      setBlocks((prev) => [...prev, newPosition])
    } else {
      setBlocks((prev) => {
        return [...prev, position]
      })
    }
  }

  useEffect(() => {
    document.addEventListener('pointermove', handlePointerMove)
    document.addEventListener('pointerdown', handlePointerDown)
    return () => {
      document.removeEventListener('pointermove', handlePointerMove)
      document.removeEventListener('pointerdown', handlePointerDown)
    }
  }, [])

  return (
    <>
      <OrbitControls makeDefault />
      <ambientLight color={0x606060} intensity={3} />
      <directionalLight
        color={0xffffff}
        intensity={3}
        position={[1, 0.75, 0.5]}
      />

      {blocks.map((position, i) => (
        <mesh
          key={i}
          receiveShadow
          castShadow
          position={position}
          ref={(element) => {
            if (element) {
              blocksRef.current[i] = element
            }
          }}
        >
          <boxGeometry args={[50, 50, 50]} />
          <meshLambertMaterial map={blockTexture} />
        </mesh>
      ))}

      <mesh
        ref={rollOverRef}
        position={[25, 25, 25]}
        onPointerMove={handleRollOverMove}
      >
        <boxGeometry args={[50, 50, 50]} />
        <meshBasicMaterial color={0xff0000} opacity={0.7} transparent={true} />
      </mesh>

      <mesh receiveShadow castShadow ref={planeRef} rotation-x={-Math.PI / 2}>
        <planeGeometry args={[1000, 1000]} />
        <meshStandardMaterial map={grassTexture} />
      </mesh>

      <gridHelper args={[1000, 20]} />

      <ViewportHelper />
    </>
  )
}

export default Experience

import { Grid, OrbitControls, useFBX } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
// import CustomShaderMaterial from 'three-custom-shader-material'
import vertexShader from './shaders/buildingsCustomShaderMaterial.vert'
import fragmentShader from './shaders/buildingsCustomShaderMaterial.frag'
import {
  BufferGeometry,
  Color,
  DoubleSide,
  EdgesGeometry,
  Mesh,
  MeshPhongMaterial
} from 'three'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import { LineSegmentsGeometry } from 'three/examples/jsm/Addons.js'

const Experience = () => {
  const model = useFBX('./digital-city/shanghai.FBX')

  const { color, opacity, landColor } = useControls('building', {
    color: {
      value: '#ffff00'
    },
    opacity: {
      value: 0.9,
      min: 0,
      max: 1,
      step: 0.01
    },
    landColor: {
      value: '#112233'
    }
  })

  const buildingsRef = useRef<Mesh<BufferGeometry, CustomShaderMaterial>>(null!)
  const landRef = useRef<Mesh<BufferGeometry, MeshPhongMaterial>>(null!)

  model.traverse((child) => {
    if (child.name === 'CITY_UNTRIANGULATED') {
      buildingsRef.current = child as Mesh<BufferGeometry, CustomShaderMaterial>
      const { geometry } = buildingsRef.current
      geometry.computeBoundingBox()
      geometry.computeBoundingSphere()

      const { max, min } = geometry.boundingBox!
      if (buildingsRef.current.material.__csm) {
        return
      }
      const material = new CustomShaderMaterial({
        baseMaterial: buildingsRef.current.material,
        vertexShader: vertexShader,
        fragmentShader: fragmentShader,
        uniforms: {
          uMax: { value: max },
          uMin: { value: min },
          uBorderWidth: { value: 5 },
          uCircleTime: { value: 5 },
          uColor: {
            value: new Color(color)
          },
          uOpacity: {
            value: opacity
          },
          uLightColor: {
            value: new Color('#ffffff')
          },
          uTopColor: {
            value: new Color('#24db3f')
          },
          uTime: {
            value: 20
          },
          uGradient: {
            value: true
          }
        },
        depthTest: true,
        depthWrite: true,
        transparent: true,
        side: DoubleSide
      })
      buildingsRef.current.material.dispose()
      buildingsRef.current.material = material
    }
    if (child.name === 'LANDMASS') {
      landRef.current = child as Mesh<BufferGeometry, MeshPhongMaterial>
      landRef.current.material.opacity = 0.9
      landRef.current.material.transparent = true
      landRef.current.material.side = DoubleSide
    }
    if (child.name === 'ROADS') {
      // roads = child
    }
  })

  useEffect(() => {
    buildingsRef.current.material.uniforms.uColor.value.setStyle(color)
    buildingsRef.current.material.uniforms.uOpacity.value = opacity

    landRef.current.material.color.setStyle(landColor)
  }, [color, opacity, landColor])

  return (
    <>
      <OrbitControls />
      <color attach='background' args={['#000000']} />
      <ambientLight intensity={1} color='#ffffff' />
      <directionalLight
        position={[100, 100, 0]}
        intensity={0.5}
        color='#ffffff'
      />

      <primitive object={model}></primitive>
      <gridHelper
        receiveShadow
        castShadow
        args={[6000, 50]}
        position={[0, 19, 0]}
      />
    </>
  )
}

export default Experience

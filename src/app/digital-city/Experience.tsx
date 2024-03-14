import { OrbitControls, useFBX } from '@react-three/drei'
import CustomShaderMaterial from 'three-custom-shader-material/vanilla'
import vertexShader from './shaders/buildingsCustomShaderMaterial.vert'
import fragmentShader from './shaders/buildingsCustomShaderMaterial.frag'
import {
  BufferGeometry,
  Color,
  DoubleSide,
  EdgesGeometry,
  LineSegments,
  Mesh,
  MeshPhongMaterial,
  ShaderMaterial
} from 'three'
import { useControls } from 'leva'
import { useEffect, useRef } from 'react'
import {
  LineMaterial,
  LineSegments2,
  LineSegmentsGeometry
} from 'three/examples/jsm/Addons.js'
import RadarA from './RadarA'
import { useFrame } from '@react-three/fiber'

const BulidingsLines = ({
  buidings,
  wireframe,
  color,
  width,
  opacity
}: {
  buidings: Mesh<BufferGeometry, CustomShaderMaterial>
  wireframe: boolean
  color: string
  width: number
  opacity: number
}) => {
  const linesRef = useRef<LineSegments2 | LineSegments>(null!)

  if (wireframe) {
    const edges = new EdgesGeometry(buidings.geometry)
    const geometry = new LineSegmentsGeometry()
    const wideEdges = geometry.fromEdgesGeometry(edges)
    const edgeMaterial = new LineMaterial({
      color: color,
      linewidth: width,
      opacity: opacity,
      transparent: true,
      depthWrite: true,
      depthTest: true
    })
    edgeMaterial.resolution.set(window.innerWidth, window.innerHeight)
    linesRef.current = new LineSegments2(wideEdges, edgeMaterial)
    linesRef.current.applyMatrix4(buidings.matrix.clone())
  } else {
    // not used yet
    const geometry = new EdgesGeometry(buidings.geometry)
    const surroundLineMaterial = new ShaderMaterial({
      transparent: true,
      uniforms: {
        uColor: {
          value: new Color(color)
        },
        uOpacity: {
          value: opacity
        }
      },
      vertexShader: `
        void main() {
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: ` 
        uniform vec3 uColor;
				uniform float uOpacity;
        void main() {
          gl_FragColor = vec4(uColor, uOpacity);
        }
      `
    })
    linesRef.current = new LineSegments(geometry, surroundLineMaterial)
    linesRef.current.applyMatrix4(buidings.matrix.clone())
    linesRef.current.renderOrder = 1000
  }

  return <primitive object={linesRef.current}></primitive>
}

const Experience = () => {
  const model = useFBX('./digital-city/shanghai.FBX')

  const { wireframe, lineColor, lineOpacity, lineWidth } = useControls(
    'buildings-lines',
    {
      wireframe: {
        value: true
      },
      lineColor: {
        value: '#000000'
      },
      lineWidth: {
        value: 0.5,
        max: 6,
        min: 0,
        step: 0.01
      },
      lineOpacity: {
        value: 1,
        max: 1,
        min: 0,
        step: 0.01
      }
    }
  )
  const { show, pulse, color, topColor, opacity, landColor, gradient } =
    useControls('building', {
      show: {
        value: true
      },
      pulse: {
        value: true
      },
      color: {
        value: '#7600ff'
      },
      topColor: {
        value: '#24db3f'
      },
      opacity: {
        value: 0.8,
        min: 0,
        max: 1,
        step: 0.01
      },
      landColor: {
        value: '#112233'
      },
      gradient: {
        value: true
      }
    })

  const { speed, radarAColor } = useControls('radar-A', {
    speed: {
      value: 300
    },
    radarAColor: {
      value: '#00c0ff'
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
            value: new Color(topColor)
          },
          uTime: {
            value: 0
          },
          uGradient: {
            value: gradient
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
    buildingsRef.current.material.uniforms.uTopColor.value.setStyle(topColor)
    buildingsRef.current.material.uniforms.uOpacity.value = opacity
    buildingsRef.current.material.uniforms.uGradient.value = gradient

    landRef.current.material.color.setStyle(landColor)
  }, [color, opacity, landColor, gradient, topColor])

  useFrame((_, delta) => {
    if (pulse) {
      buildingsRef.current.material.uniforms.uTime.value += delta
    }
  })

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

      {show && <primitive object={model} />}
      {wireframe && (
        <BulidingsLines
          wireframe={wireframe}
          buidings={buildingsRef.current}
          color={lineColor}
          width={lineWidth}
          opacity={lineOpacity}
        />
      )}

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

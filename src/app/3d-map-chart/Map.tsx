import { geoMercator, scaleLinear, min, max, interpolate } from 'd3'
import { Color, Group, Shape } from 'three'
import { useMemo, useRef } from 'react'
import { Text3D } from '@react-three/drei'
import data from './data.json'
import { ThreeEvent } from '@react-three/fiber'

type Province = {
  shapes: Shape[]
  properties: Record<string, any>
}

const mapCenter: [number, number] = [104.0, 37.5]

const projection = geoMercator().center(mapCenter).scale(80).translate([0, 0])

const scale = (field: 'childrenNum' | 'subFeatureIndex' | 'acroutes') => {
  const values = data.features.map((feature) => {
    const value = Number(feature.properties[field]) || 0
    return value
  })
  return scaleLinear()
    .domain([min(values)!, max(values)!])
    .range([0, 1])
}

const getColor = (
  field: 'childrenNum' | 'subFeatureIndex' | 'acroutes',
  value: number
) => {
  const normalizedValue = scale(field)(value)
  return interpolate('#eef2ff', '#3730a3')(normalizedValue)
}

const createShape = (polygon: number[][]) => {
  const shape = new Shape()
  const vertices = []

  for (let i = 0; i < polygon.length; i++) {
    if (polygon[i] instanceof Array) {
      const position = projection(polygon[i] as [number, number])
      if (position) {
        const [x, y] = position
        if (i === 0) {
          shape.moveTo(x, -y)
        }
        shape.lineTo(x, -y)
        vertices.push(x, -y, 1 + 0.2)
      }
    }
  }
  return shape
}

const initMap = () => {
  const provinces: Province[] = []
  data.features.forEach((feature) => {
    const province: Province = {
      shapes: [],
      properties: {}
    }
    province.properties = feature.properties

    const { coordinates, type } = feature.geometry
    const hegiht = 0.5 + Number(feature.properties['childrenNum']) * 0.1 || 0
    const color = getColor(
      'childrenNum',
      feature.properties['childrenNum'] as number
    )
    province.properties.height = hegiht
    province.properties.color = color
    const shapes: Shape[] = []

    if (type === 'MultiPolygon') {
      coordinates.forEach((multiPolygon) => {
        multiPolygon.forEach((polygon) => {
          const shape = createShape(polygon as number[][])
          shapes.push(shape)
        })
      })
      province.shapes = shapes
    }
    if (type === 'Polygon') {
      coordinates.forEach((polygon) => {
        const shape = createShape(polygon as number[][])
        shapes.push(shape)
      })
      province.shapes = shapes
    }
    provinces.push(province)
  })

  return provinces
}

const Map = () => {
  const provincesRef = useRef<Array<Group | null>>([])

  const provinces = useMemo(() => {
    return initMap()
  }, [])

  const handleClick = (event: ThreeEvent<MouseEvent>, index: number) => {
    event.stopPropagation()
    const currentGroup = provincesRef.current[index]
    if (currentGroup?.scale.z === 1.1) {
      currentGroup?.children.forEach((mesh) => {
        currentGroup?.scale.set(1, 1, 1)
        // @ts-expect-error
        mesh.material.color.set(new Color(currentGroup.userData.color))
      })
    } else {
      currentGroup?.scale.set(1, 1, 1.1)
      currentGroup?.children.forEach((mesh) => {
        // @ts-expect-error
        mesh.material.color.set(new Color('#fecdd3'))
      })
    }
  }

  return (
    <>
      {provinces.map((province, index) => {
        return (
          <group
            key={index}
            onClick={(e) => handleClick(e, index)}
            userData={province.properties}
            ref={(el) => {
              provincesRef.current[index] = el
            }}
          >
            {province.shapes.map((shape, i) => {
              return (
                <mesh
                  key={i}
                  scale-z={province.properties.height}
                  castShadow
                  receiveShadow
                >
                  <extrudeGeometry args={[shape, { depth: 1 }]} />
                  <meshStandardMaterial
                    color={province.properties.color}
                    metalness={1}
                  />
                </mesh>
              )
            })}
          </group>
        )
      })}
      <group rotation={[Math.PI / 2, -Math.PI * 1, Math.PI]}>
        {provinces
          .filter((p) => p.properties && !!p.properties.centroid)
          .map((province, index) => {
            const [x, y] = projection(province.properties?.centroid) as [
              number,
              number
            ]
            return (
              <Text3D
                key={index}
                rotation={[-Math.PI * 0.5, Math.PI, Math.PI]}
                position={[x - 1.9, -province.properties.height - 1, -y - 0.1]}
                font={'./fonts/MFTianLiNoncommercial_Regular.json'}
              >
                {province.properties?.name}
                <meshBasicMaterial color={'#ffffff'} transparent />
              </Text3D>
            )
          })}
      </group>
    </>
  )
}

export default Map

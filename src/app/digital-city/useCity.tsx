import { useFBX } from '@react-three/drei'

const useCity = () => {
  const model = useFBX('./digital-city/shanghai.FBX')

  let city = null
  let land = null
  let roads = null
  model.traverse((child) => {
    if (child.name === 'CITY_UNTRIANGULATED') {
      city = child
    }
    if (child.name === 'LANDMASS') {
      land = child
    }
    if (child.name === 'ROADS') {
      roads = child
    }
  })

  return {
    model,
    city,
    land,
    roads
  }
}

export default useCity

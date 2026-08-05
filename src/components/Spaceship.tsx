import { useFrame, useLoader } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { MathUtils, type Group } from 'three'
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader.js'
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js'

const TRACK_HALF_WIDTH = 4
const MODEL_SCALE = 0.07

interface SpaceshipProps {
  progress: number
}

export function Spaceship({ progress }: SpaceshipProps) {
  const groupRef = useRef<Group>(null)
  const materials = useLoader(MTLLoader, '/models/m3-ship1.mtl')
  const source = useLoader(OBJLoader, '/models/spaceship.obj', (loader) => {
    materials.preload()
    loader.setMaterials(materials)
  })

  const model = useMemo(() => source.clone(true), [source])

  useFrame((_state, delta) => {
    if (!groupRef.current) return
    const targetX = -TRACK_HALF_WIDTH + progress * TRACK_HALF_WIDTH * 2
    groupRef.current.position.x = MathUtils.damp(
      groupRef.current.position.x,
      targetX,
      6,
      delta,
    )
  })

  return (
    <group ref={groupRef} position={[-TRACK_HALF_WIDTH, 0, 0]}>
      {/* model's nose points along local +z; rotate so it faces the direction of travel (+x) */}
      <group rotation={[0, Math.PI / 2, 0]} scale={MODEL_SCALE}>
        <primitive object={model} />
      </group>

      <mesh position={[-0.65, 0, 0]}>
        <sphereGeometry args={[0.08, 12, 12]} />
        <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={3} />
      </mesh>
    </group>
  )
}

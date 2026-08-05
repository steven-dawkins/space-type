import { useGLTF } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { MathUtils, type Group } from 'three'

const TRACK_HALF_WIDTH = 4
const MODEL_SCALE = 0.1
const MODEL_URL = '/models/spaceship.glb'

// Local-space positions of the model's own `engine_main_01`/`engine_main_02` locator nodes.
const ENGINE_POSITIONS: Array<[number, number, number]> = [
  [0.6672689914703369, 0.11416742205619812, -4.206867218017578],
  [-0.6703824996948242, 0.11814286559820175, -4.207581520080566],
]

interface SpaceshipProps {
  progress: number
}

export function Spaceship({ progress }: SpaceshipProps) {
  const groupRef = useRef<Group>(null)
  const { scene } = useGLTF(MODEL_URL)
  const model = useMemo(() => scene.clone(true), [scene])

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
        {ENGINE_POSITIONS.map((position) => (
          <mesh key={position.join(',')} position={position}>
            <sphereGeometry args={[0.5, 12, 12]} />
            <meshStandardMaterial color="#67e8f9" emissive="#22d3ee" emissiveIntensity={3} />
          </mesh>
        ))}
      </group>
    </group>
  )
}

useGLTF.preload(MODEL_URL)

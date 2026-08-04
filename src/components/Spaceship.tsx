import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import { MathUtils, type Group } from 'three'

const TRACK_HALF_WIDTH = 4

interface SpaceshipProps {
  progress: number
}

export function Spaceship({ progress }: SpaceshipProps) {
  const groupRef = useRef<Group>(null)

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
      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.25, 0.6, 8]} />
        <meshStandardMaterial color="#e2e8f0" />
      </mesh>
      <mesh position={[-0.1, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.25, 0.25, 0.8, 8]} />
        <meshStandardMaterial color="#94a3b8" />
      </mesh>
      <mesh position={[-0.35, 0, 0.35]}>
        <boxGeometry args={[0.4, 0.05, 0.35]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-0.35, 0, -0.35]}>
        <boxGeometry args={[0.4, 0.05, 0.35]} />
        <meshStandardMaterial color="#38bdf8" />
      </mesh>
      <mesh position={[-0.55, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.3, 8]} />
        <meshStandardMaterial
          color="#f97316"
          emissive="#f97316"
          emissiveIntensity={2}
        />
      </mesh>
    </group>
  )
}

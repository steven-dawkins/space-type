import { useFrame } from '@react-three/fiber'
import { useMemo, useRef } from 'react'
import { DoubleSide, ExtrudeGeometry, MathUtils, Shape, type Group } from 'three'

const TRACK_HALF_WIDTH = 4

interface SpaceshipProps {
  progress: number
}

function useFinGeometry() {
  return useMemo(() => {
    const shape = new Shape()
    shape.moveTo(0.08, 0.04)
    shape.lineTo(-0.15, 0.55)
    shape.lineTo(-0.55, 0.03)
    shape.closePath()
    return new ExtrudeGeometry(shape, { depth: 0.025, bevelEnabled: false })
  }, [])
}

export function Spaceship({ progress }: SpaceshipProps) {
  const groupRef = useRef<Group>(null)
  const finGeometry = useFinGeometry()

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
      <mesh position={[-0.05, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.15, 0.23, 1.05, 20]} />
        <meshStandardMaterial color="#c9cedb" metalness={0.75} roughness={0.3} />
      </mesh>

      <mesh position={[0.5, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <coneGeometry args={[0.15, 0.5, 20]} />
        <meshStandardMaterial color="#eef1f5" metalness={0.6} roughness={0.2} />
      </mesh>

      <mesh position={[0.18, 0.13, 0]} scale={[1, 0.6, 0.65]}>
        <sphereGeometry args={[0.14, 16, 12]} />
        <meshStandardMaterial
          color="#0b2540"
          metalness={0.9}
          roughness={0.05}
          transparent
          opacity={0.85}
        />
      </mesh>

      <mesh position={[-0.62, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        <cylinderGeometry args={[0.22, 0.19, 0.22, 20]} />
        <meshStandardMaterial color="#767e8c" metalness={0.6} roughness={0.45} />
      </mesh>

      {[0.11, -0.11].map((z) => (
        <group key={z} position={[-0.8, -0.015, z]}>
          <mesh rotation={[0, 0, -Math.PI / 2]}>
            <cylinderGeometry args={[0.065, 0.085, 0.16, 12]} />
            <meshStandardMaterial color="#585d68" metalness={0.7} roughness={0.4} />
          </mesh>
          <mesh position={[-0.12, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
            <coneGeometry args={[0.085, 0.18, 12]} />
            <meshStandardMaterial color="#fb923c" emissive="#f97316" emissiveIntensity={3} />
          </mesh>
        </group>
      ))}

      <mesh
        geometry={finGeometry}
        position={[-0.15, -0.02, 0.19]}
        rotation={[Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#38bdf8" metalness={0.4} roughness={0.4} side={DoubleSide} />
      </mesh>
      <mesh
        geometry={finGeometry}
        position={[-0.15, -0.02, -0.19]}
        rotation={[-Math.PI / 2, 0, 0]}
      >
        <meshStandardMaterial color="#38bdf8" metalness={0.4} roughness={0.4} side={DoubleSide} />
      </mesh>

      <mesh
        geometry={finGeometry}
        position={[-0.7, 0.15, 0]}
        scale={[0.32, 0.32, 0.32]}
      >
        <meshStandardMaterial color="#94a3b8" metalness={0.4} roughness={0.4} side={DoubleSide} />
      </mesh>
    </group>
  )
}

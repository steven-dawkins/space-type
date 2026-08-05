import { OrbitControls, Stars } from '@react-three/drei'
import { Canvas } from '@react-three/fiber'
import { Spaceship } from './components/Spaceship'
import { TypingChallenge } from './components/TypingChallenge'
import { useTypingChallenge } from './hooks/useTypingChallenge'

function App() {
  const { text, typed, hasMistake, isComplete, progress, wpm, restart } = useTypingChallenge()

  return (
    <div className="game">
      <div className="scene">
        <Canvas camera={{ position: [0, 1.5, 6], fov: 50 }}>
          <color attach="background" args={['#05060a']} />
          <ambientLight intensity={0.6} />
          <directionalLight position={[5, 5, 5]} intensity={1} />
          <directionalLight position={[-4, 2, 3]} intensity={0.4} color="#88aaff" />
          <Stars radius={50} depth={30} count={2000} factor={2} fade speed={0.5} />
          <Spaceship progress={progress} />
          <OrbitControls enableZoom enablePan enableRotate makeDefault />
        </Canvas>
      </div>

      <div className="hud">
        <div className="wpm">{wpm} WPM</div>
        <TypingChallenge text={text} typed={typed} />
        <div className="status">
          {isComplete ? (
            <button type="button" onClick={restart}>
              Next line
            </button>
          ) : (
            <span className="hint">
              {hasMistake ? 'Backspace to fix the mistake' : 'Start typing…'}
            </span>
          )}
        </div>
      </div>
    </div>
  )
}

export default App

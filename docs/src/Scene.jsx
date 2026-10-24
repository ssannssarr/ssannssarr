import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { MeshDistortMaterial, Stars, Float } from '@react-three/drei'

// Camera flies down a tunnel as you scroll; mouse adds parallax.
function Rig({ progress }) {
  useFrame(({ camera, pointer }) => {
    const z = 8 - progress.get() * 52
    camera.position.z += (z - camera.position.z) * 0.07
    camera.position.x += (pointer.x * 1.4 - camera.position.x) * 0.04
    camera.position.y += (pointer.y * 0.9 - camera.position.y) * 0.04
    camera.lookAt(0, 0, camera.position.z - 10)
  })
  return null
}

function Hero() {
  const mobile = useThree((s) => s.size.width < 700)
  const wire = useRef()
  useFrame((_, dt) => {
    wire.current.rotation.y += dt * 0.2
    wire.current.rotation.x += dt * 0.1
  })
  return (
    <Float speed={1.5} floatIntensity={1.2}>
      <group position={[mobile ? 0 : 2.6, mobile ? 1.6 : 0.2, 0]} scale={mobile ? 1.1 : 1.8}>
        <mesh>
          <icosahedronGeometry args={[1, 24]} />
          <MeshDistortMaterial color="#6d28d9" distort={0.45} speed={2} roughness={0.15} metalness={0.9} />
        </mesh>
        <mesh ref={wire} scale={1.35}>
          <icosahedronGeometry args={[1, 2]} />
          <meshBasicMaterial color="#c4b5fd" wireframe transparent opacity={0.35} />
        </mesh>
      </group>
    </Float>
  )
}

function Ring({ z, r, color }) {
  const ref = useRef()
  useFrame((_, dt) => (ref.current.rotation.z += dt * 0.15 * (z % 2 ? 1 : -1)))
  return (
    <mesh ref={ref} position={[0, 0, z]} rotation={[0, 0, z]}>
      <torusGeometry args={[r, 0.025, 8, 6]} />
      <meshBasicMaterial color={color} />
    </mesh>
  )
}

function Shape({ position, color, kind }) {
  const ref = useRef()
  useFrame((_, dt) => {
    ref.current.rotation.x += dt * 0.35
    ref.current.rotation.y += dt * 0.25
  })
  return (
    <Float speed={2} floatIntensity={2}>
      <mesh ref={ref} position={position}>
        {kind === 0 && <torusKnotGeometry args={[0.8, 0.22, 120, 16]} />}
        {kind === 1 && <octahedronGeometry args={[1.1, 0]} />}
        {kind === 2 && <dodecahedronGeometry args={[1, 0]} />}
        <meshBasicMaterial color={color} wireframe />
      </mesh>
    </Float>
  )
}

const rings = Array.from({ length: 9 }, (_, i) => ({ z: -8 - i * 5, r: 5 + (i % 3) }))
const shapes = [
  { position: [-3.5, 1, -12], color: '#a855f7', kind: 0 },
  { position: [3.5, -1.2, -20], color: '#8bff9b', kind: 1 },
  { position: [-3, -1, -28], color: '#f2f2f2', kind: 2 },
  { position: [3.2, 1.2, -36], color: '#a855f7', kind: 0 },
  { position: [-2.5, 0.5, -44], color: '#8bff9b', kind: 1 },
]

export default function Scene({ progress }) {
  return (
    <div className="scene" aria-hidden="true">
      <Canvas camera={{ position: [0, 0, 8], fov: 60 }} dpr={[1, 1.75]}>
        <fog attach="fog" args={['#080808', 6, 38]} />
        <ambientLight intensity={0.6} />
        <pointLight position={[6, 4, 6]} intensity={80} color="#c4b5fd" />
        <Rig progress={progress} />
        <Hero />
        <Stars radius={90} depth={60} count={3500} factor={4} fade speed={1} />
        {rings.map((p) => (
          <Ring key={p.z} z={p.z} r={p.r} color={p.z % 2 ? '#a855f7' : '#555'} />
        ))}
        {shapes.map((s, i) => (
          <Shape key={i} {...s} />
        ))}
      </Canvas>
    </div>
  )
}

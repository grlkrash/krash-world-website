"use client"

import { useRef, useState } from "react"
import { useFrame } from "@react-three/fiber"
import { Html } from "@react-three/drei"
import type * as THREE from "three"

interface InteractiveGRLKRASHProps {
  position?: [number, number, number]
}

export default function InteractiveGRLKRASH({ position = [0, 0, 0] }: InteractiveGRLKRASHProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)

  const messages = [
    "Sick! Ready to save the world?",
    "Let's go! The resistance needs us!",
    "Oh! Music makes you float on Krash World!",
    "Love is patient, love is kind...",
    "As ready as I'll ever be!",
  ]

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.rotation.y += delta * 0.3
      meshRef.current.position.y = position[1] + Math.sin(state.clock.elapsedTime * 0.8) * 0.2

      if (isHovered) {
        meshRef.current.scale.setScalar(1.05)
      } else {
        meshRef.current.scale.setScalar(1)
      }
    }
  })

  const handleClick = () => {
    setShowMessage(true)
    setCurrentMessage((prev) => (prev + 1) % messages.length)

    setTimeout(() => {
      setShowMessage(false)
    }, 3000)
  }

  return (
    <group ref={meshRef} position={position}>
      <mesh
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={handleClick}
        scale={1.2}
      >
        {/* Head */}
        <mesh position={[0, 1.5, 0]}>
          <sphereGeometry args={[0.4, 16, 16]} />
          <meshStandardMaterial color="#8B4513" />
        </mesh>

        {/* Green Hoodie Body */}
        <mesh position={[0, 0.5, 0]}>
          <cylinderGeometry args={[0.5, 0.6, 1.2, 8]} />
          <meshStandardMaterial color="#32CD32" />
        </mesh>

        {/* Blue Pants */}
        <mesh position={[0, -0.5, 0]}>
          <cylinderGeometry args={[0.4, 0.5, 0.8, 8]} />
          <meshStandardMaterial color="#4169E1" />
        </mesh>

        {/* Orange Shoes */}
        <mesh position={[-0.2, -1.2, 0.2]}>
          <boxGeometry args={[0.3, 0.2, 0.5]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>
        <mesh position={[0.2, -1.2, 0.2]}>
          <boxGeometry args={[0.3, 0.2, 0.5]} />
          <meshStandardMaterial color="#FF8C00" />
        </mesh>

        {/* Arms */}
        <mesh position={[-0.7, 0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#32CD32" />
        </mesh>
        <mesh position={[0.7, 0.8, 0]}>
          <cylinderGeometry args={[0.15, 0.15, 0.8, 8]} />
          <meshStandardMaterial color="#32CD32" />
        </mesh>

        {/* Hood */}
        <mesh position={[0, 1.8, -0.2]}>
          <sphereGeometry args={[0.5, 16, 8, 0, Math.PI]} />
          <meshStandardMaterial color="#228B22" />
        </mesh>

        {/* Pink Circle on Chest */}
        <mesh position={[0, 0.7, 0.6]}>
          <cylinderGeometry args={[0.15, 0.15, 0.05, 16]} />
          <meshStandardMaterial color="#FF69B4" />
        </mesh>

        {/* White Headphones */}
        <mesh position={[-0.5, 1.5, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0.5, 1.5, 0]}>
          <sphereGeometry args={[0.15, 8, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
        <mesh position={[0, 1.7, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.05, 0.05, 1, 8]} />
          <meshStandardMaterial color="white" />
        </mesh>
      </mesh>

      {/* Floating Hearts */}
      {[...Array(3)].map((_, i) => (
        <mesh
          key={i}
          position={[
            Math.sin(i * 2 + Date.now() * 0.001) * 1.5,
            Math.cos(i * 1.5 + Date.now() * 0.001) * 1 + 2,
            Math.sin(i * 3 + Date.now() * 0.001) * 0.5,
          ]}
        >
          <sphereGeometry args={[0.08, 8, 8]} />
          <meshStandardMaterial color="#FF69B4" transparent opacity={0.6} />
        </mesh>
      ))}

      {/* Message Bubble */}
      {showMessage && (
        <Html position={[0, 2.8, 0]} center>
          <div className="bg-black/90 text-[#ffda0f] px-4 py-2 rounded-lg font-bold text-sm max-w-xs text-center border border-[#ffda0f]/50 animate-pulse">
            {messages[currentMessage]}
          </div>
        </Html>
      )}

      {/* Hover Glow */}
      {isHovered && !showMessage && (
        <Html position={[0, -2, 0]} center>
          <div className="text-[#ffda0f] text-xs font-mono animate-pulse">&gt; CLICK_TO_CHAT</div>
        </Html>
      )}
    </group>
  )
}

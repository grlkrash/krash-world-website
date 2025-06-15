"use client"

import { useRef, useState } from "react"
import { useFrame, useLoader } from "@react-three/fiber"
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader"
import { Html } from "@react-three/drei"
import type * as THREE from "three"

interface GLTFCharacterProps {
  position?: [number, number, number]
  modelPath: string // Path to your .glb/.gltf file
  scale?: number
}

export default function GLTFCharacter({ position = [0, 0, 0], modelPath, scale = 1 }: GLTFCharacterProps) {
  const meshRef = useRef<THREE.Group>(null)
  const [isHovered, setIsHovered] = useState(false)
  const [showMessage, setShowMessage] = useState(false)
  const [currentMessage, setCurrentMessage] = useState(0)

  // Load your 3D model
  const gltf = useLoader(GLTFLoader, modelPath)

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
      <primitive
        object={gltf.scene}
        scale={scale}
        onPointerEnter={() => setIsHovered(true)}
        onPointerLeave={() => setIsHovered(false)}
        onClick={handleClick}
      />

      {/* Message Bubble */}
      {showMessage && (
        <Html position={[0, 3, 0]} center>
          <div className="bg-black/90 text-[#ffda0f] px-4 py-2 rounded-lg font-bold text-sm max-w-xs text-center border border-[#ffda0f]/50 animate-pulse">
            {messages[currentMessage]}
          </div>
        </Html>
      )}

      {/* Hover Hint */}
      {isHovered && !showMessage && (
        <Html position={[0, -2, 0]} center>
          <div className="text-[#ffda0f] text-xs font-mono animate-pulse">&gt; CLICK_TO_CHAT</div>
        </Html>
      )}
    </group>
  )
}

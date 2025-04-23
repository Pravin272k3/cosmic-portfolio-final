'use client'
// @ts-nocheck

import React, { useRef, useState, useMemo, useCallback, useEffect } from 'react'
import { Canvas, useFrame, useThree, ThreeEvent } from '@react-three/fiber'
import { Sphere, Text, Ring, OrbitControls as DreiOrbitControls, useTexture } from '@react-three/drei'
import { useRouter } from 'next/navigation'
import * as THREE from 'three'
import { TextureLoadingWrapper, usePlanetTextures } from './TextureLoader'

interface PlanetProps {
  color: string
  label: string
  onClick: () => void
  ringColor?: string
  orbitRadius: number
  orbitSpeed: number
  position: [number, number, number]
  scale?: number
}

// Enhanced atmosphere shader for planets
const atmosphereVertexShader = `
varying vec3 vNormal;
varying vec3 vPosition;

void main() {
  vNormal = normalize(normalMatrix * normal);
  vPosition = (modelViewMatrix * vec4(position, 1.0)).xyz;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const atmosphereFragmentShader = `
varying vec3 vNormal;
varying vec3 vPosition;

uniform vec3 glowColor;
uniform float intensity;

void main() {
  float intensity = pow(0.75 - dot(vNormal, normalize(vPosition)), 2.0) * intensity;
  gl_FragColor = vec4(glowColor, intensity);
}
`;

const Planet: React.FC<PlanetProps> = ({ color, label, onClick, ringColor, orbitSpeed, position, scale = 1 }) => {
  const mesh = useRef<THREE.Mesh>(null!)
  const atmosphereRef = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Mesh>(null!) // Reference for the text
  const [hover, setHover] = useState(false)
  const groupRef = useRef<THREE.Group>(null!)

  // Get all planet textures
  const {
    earthTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    venusTexture,
    neptuneTexture,
    saturnRingTexture
  } = usePlanetTextures()

  // Map planet labels to textures
  const texture = useMemo(() => {
    if (label === 'About') return earthTexture
    if (label === 'Projects') return marsTexture
    if (label === 'Skills') return saturnTexture
    if (label === 'Contact') return jupiterTexture
    if (label === 'Blog') return neptuneTexture
    return venusTexture
  }, [label, earthTexture, marsTexture, saturnTexture, jupiterTexture, neptuneTexture, venusTexture])

  // Custom material properties based on planet type
  const materialProps = useMemo(() => {
    if (label === 'About') {
      return {
        metalness: 0.1,
        roughness: 0.5,
        emissive: new THREE.Color(0x113355),
        emissiveIntensity: 0.2,
      }
    }
    return {
      metalness: 0.2,
      roughness: 0.8,
      emissive: new THREE.Color(0x000000),
      emissiveIntensity: 0,
    }
  }, [label])

  // Atmosphere glow color based on planet
  const glowColor = useMemo(() => {
    if (label === 'About') return new THREE.Color(0x4287f5) // Blue
    if (label === 'Projects') return new THREE.Color(0xff4500) // Red-orange
    if (label === 'Skills') return new THREE.Color(0xF4C542) // Yellow
    if (label === 'Contact') return new THREE.Color(0xF79E4D) // Orange
    if (label === 'Blog') return new THREE.Color(0x50C878) // Green
    return new THREE.Color(0xffffff) // White default
  }, [label])

  // Atmosphere intensity based on planet
  const baseIntensity = useMemo(() => {
    if (label === 'About') return 1.8 // Brighter for Earth
    return 1.0 // Default for other planets
  }, [label])

  // Atmosphere uniforms
  const atmosphereUniforms = useMemo(() => ({
    glowColor: { value: glowColor },
    intensity: { value: hover ? baseIntensity + 0.5 : baseIntensity }
  }), [glowColor, hover, baseIntensity])

  useFrame((state, delta) => {
    // Rotate planet
    mesh.current.rotation.y += delta * 0.2

    // Rotate orbit
    groupRef.current.rotation.y += delta * orbitSpeed

    // Update atmosphere intensity based on hover state
    if (atmosphereRef.current) {
      const material = atmosphereRef.current.material as THREE.ShaderMaterial
      material.uniforms.intensity.value = THREE.MathUtils.lerp(
        material.uniforms.intensity.value,
        hover ? 1.5 : 1.0,
        0.1
      )
    }

    // Ensure the label always faces the camera
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position)
    }
  })

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation()
    onClick()
  }

  return (
    <group ref={groupRef}>
      <group position={position} scale={scale}>
        {/* Planet sphere with texture */}
        <Sphere
          args={[0.9, 64, 64]}
          ref={mesh}
          onClick={handleClick}
          onPointerOver={() => setHover(true)}
          onPointerOut={() => setHover(false)}
        >
          <meshStandardMaterial
            map={texture}
            metalness={materialProps.metalness}
            roughness={materialProps.roughness}
            bumpScale={0.05}
            envMapIntensity={0.5}
            emissive={materialProps.emissive}
            emissiveIntensity={materialProps.emissiveIntensity}
          />
        </Sphere>

        {/* Atmosphere glow effect */}
        <Sphere
          args={[1.0, 32, 32]}
          ref={atmosphereRef}
        >
          <shaderMaterial
            vertexShader={atmosphereVertexShader}
            fragmentShader={atmosphereFragmentShader}
            uniforms={atmosphereUniforms}
            transparent
            blending={THREE.AdditiveBlending}
            side={THREE.BackSide}
          />
        </Sphere>

        {/* Saturn-style ring for Skills planet */}
        {label === 'Skills' && (
          <Ring
            args={[1.1, 1.7, 64]}
            rotation={[Math.PI / 3, 0, 0]}
          >
            <meshStandardMaterial
              map={saturnRingTexture}
              transparent
              opacity={0.9}
              side={THREE.DoubleSide}
              alphaTest={0.1}
            />
          </Ring>
        )}

        {/* Regular ring for other planets if specified */}
        {ringColor && label !== 'Skills' && (
          <Ring
            args={[1.0, 1.2, 64]}
            rotation={[Math.PI / 2, 0, 0]}
          >
            <meshBasicMaterial color={ringColor} side={THREE.DoubleSide} transparent opacity={0.7} />
          </Ring>
        )}

        {/* Planet label */}
        <Text
          ref={textRef}
          position={[0, -1.4, 0]}
          color="white"
          fontSize={0.3}
          maxWidth={2}
          lineHeight={1}
          letterSpacing={0.02}
          textAlign="center"
          font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
          anchorX="center"
          anchorY="middle"
        >
          {label}
        </Text>
      </group>
    </group>
  )
}


const Sun: React.FC<{ onClick: () => void; scale: number }> = ({ onClick, scale }) => {
  const sunRef = useRef<THREE.Mesh>(null!)
  const glowRef = useRef<THREE.Mesh>(null!)
  const textRef = useRef<THREE.Mesh>(null!)
  const [hover, setHovered] = useState(false)
  const { sunTexture } = usePlanetTextures()

  // Sun shader for more realistic appearance
  const sunFragmentShader = `
    uniform sampler2D sunTexture;
    uniform float time;
    varying vec2 vUv;

    void main() {
      vec2 uv = vUv;

      // Distort UVs for a flowing effect
      uv.x += sin(uv.y * 10.0 + time * 0.5) * 0.02;
      uv.y += cos(uv.x * 10.0 + time * 0.5) * 0.02;

      vec4 texColor = texture2D(sunTexture, uv);

      // Add glow at the edges
      float intensity = 1.2 - length(vUv - 0.5) * 1.8;
      vec3 glow = vec3(1.0, 0.6, 0.1) * intensity * 0.6;

      // Combine texture with glow
      vec3 finalColor = texColor.rgb + glow;

      gl_FragColor = vec4(finalColor, 1.0);
    }
  `;

  const sunVertexShader = `
    varying vec2 vUv;

    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `;

  // Sun uniforms with time for animation
  const sunUniforms = useMemo(() => ({
    sunTexture: { value: sunTexture },
    time: { value: 0 }
  }), [sunTexture]);

  // Outer glow uniforms
  const glowUniforms = useMemo(() => ({
    glowColor: { value: new THREE.Color(0xFDB813) },
    intensity: { value: hover ? 2.0 : 1.5 }
  }), [hover]);

  useFrame((state, delta) => {
    // Rotate sun
    sunRef.current.rotation.y += delta * 0.1

    // Update shader time uniform for flowing effect
    if (sunRef.current) {
      const material = sunRef.current.material as THREE.ShaderMaterial
      material.uniforms.time.value += delta
    }

    // Update glow intensity based on hover
    if (glowRef.current) {
      const material = glowRef.current.material as THREE.ShaderMaterial
      material.uniforms.intensity.value = THREE.MathUtils.lerp(
        material.uniforms.intensity.value,
        hover ? 2.0 : 1.5,
        0.1
      )
    }

    // Ensure the label always faces the camera
    if (textRef.current) {
      textRef.current.lookAt(state.camera.position)
    }
  });

  const handleClick = (e: ThreeEvent<MouseEvent>) => {
    e.stopPropagation();
    onClick();
  };

  return (
    <group scale={scale}>
      {/* Sun sphere with animated shader */}
      <Sphere
        args={[1.5, 64, 64]}
        ref={sunRef}
        onClick={handleClick}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
      >
        <shaderMaterial
          vertexShader={sunVertexShader}
          fragmentShader={sunFragmentShader}
          uniforms={sunUniforms}
        />
      </Sphere>

      {/* Outer glow effect */}
      <Sphere
        args={[1.8, 32, 32]}
        ref={glowRef}
      >
        <shaderMaterial
          vertexShader={atmosphereVertexShader}
          fragmentShader={atmosphereFragmentShader}
          uniforms={glowUniforms}
          transparent
          blending={THREE.AdditiveBlending}
          side={THREE.BackSide}
        />
      </Sphere>

      {/* Sun label */}
      <Text
        ref={textRef}
        position={[0, -2.2, 0]}
        color="white"
        fontSize={0.3}
        maxWidth={2}
        lineHeight={1}
        letterSpacing={0.02}
        textAlign="center"
        font="https://fonts.gstatic.com/s/raleway/v14/1Ptrg8zYS_SKggPNwK4vaqI.woff"
        anchorX="center"
        anchorY="middle"
      >
        Arts
      </Text>
    </group>
  );
};



const CameraControls = () => {
  return (
    <DreiOrbitControls
      enableDamping
      dampingFactor={0.05}
      rotateSpeed={0.5}
      enableZoom={false}
    />
  )
}

interface SolarSystemProps {
  onNavigate: (path: string) => void;
}

const SolarSystem: React.FC<SolarSystemProps> = ({ onNavigate }) => {
  const { camera } = useThree()
  const [isAnimating, setIsAnimating] = useState(false)
  const [isDesktop, setIsDesktop] = useState(false)
  const animationFrameRef = useRef<number | null>(null)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => {
      window.removeEventListener('resize', checkIsDesktop)
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [])

  const zoomToPlanet = useCallback((position: [number, number, number], path: string) => {
    if (isAnimating) return

    setIsAnimating(true)
    const startPosition = camera.position.clone()
    const endPosition = new THREE.Vector3(...position).normalize().multiplyScalar(3)
    const duration = 800
    const startTime = Date.now()

    setTimeout(() => {
      onNavigate(path)
    }, duration * 0.6)

    function animate() {
      const now = Date.now()
      const progress = Math.min((now - startTime) / duration, 1)

      camera.position.lerpVectors(startPosition, endPosition, progress)
      camera.lookAt(new THREE.Vector3(...position))

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate)
      } else {
        setIsAnimating(false)
      }
    }

    animate()
  }, [camera, onNavigate, isAnimating])

  const baseScale = isDesktop ? 1.5 : 1.2
  const sunScale = isDesktop ? 2.0 : 1.7

  return (
    <>
      <CameraControls />
      {/* Enhanced lighting setup */}
      <ambientLight intensity={0.5} />
      <directionalLight position={[10, 10, 10]} intensity={1.5} />
      <directionalLight position={[-10, -10, -10]} intensity={0.8} />

      <Planet
        color="#4287f5"
        label="About"
        onClick={() => zoomToPlanet([5, 0, 0], '/about')}
        orbitRadius={5}
        orbitSpeed={0.5}
        position={[5, 0, 0]}
        scale={baseScale}
      />
      <Planet
        color="#ff4500"
        label="Projects"
        onClick={() => zoomToPlanet([9, 0, 0], '/projects')}
        orbitRadius={9}
        orbitSpeed={0.3}
        position={[9, 0, 0]}
        scale={baseScale}
      />
      <Planet
        color="#F4C542"
        label="Skills"
        onClick={() => zoomToPlanet([13, 0, 0], '/skills')}
        ringColor="#A49B72"
        orbitRadius={13}
        orbitSpeed={0.2}
        position={[13, 0, 0]}
        scale={baseScale}
      />
      <Planet
        color="#F79E4D"
        label="Contact"
        onClick={() => zoomToPlanet([17, 0, 0], '/contact')}
        orbitRadius={17}
        orbitSpeed={0.1}
        position={[17, 0, 0]}
        scale={baseScale}
      />
      <Planet
        color="#50C878"
        label="Blog"
        onClick={() => zoomToPlanet([21, 0, 0], '/blog')}
        orbitRadius={21}
        orbitSpeed={0.08}
        position={[21, 0, 0]}
        scale={baseScale}
      />
      <Sun onClick={() => zoomToPlanet([0, 0, 0], '/arts')} scale={sunScale} />
    </>
  )
}

export default function Navigation3D() {
  const router = useRouter()
  const [isDesktop, setIsDesktop] = useState(false)

  useEffect(() => {
    const checkIsDesktop = () => {
      setIsDesktop(window.innerWidth >= 1024)
    }
    checkIsDesktop()
    window.addEventListener('resize', checkIsDesktop)
    return () => window.removeEventListener('resize', checkIsDesktop)
  }, [])

  const handleNavigate = (path: string) => {
    router.push(path)
  }

  return (
    <div className="w-full h-[60vh] sm:h-[70vh] md:h-[80vh] lg:h-[90vh]">
      <Canvas camera={{
        position: isDesktop ? [0, 20, 30] : [0, 15, 25],
        fov: isDesktop ? 55 : 65
      }}>
        <TextureLoadingWrapper>
          <SolarSystem onNavigate={handleNavigate} />
        </TextureLoadingWrapper>
      </Canvas>
    </div>
  )
}
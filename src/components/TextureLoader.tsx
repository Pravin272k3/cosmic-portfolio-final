'use client'

import { useLoader } from '@react-three/fiber'
import { TextureLoader as ThreeTextureLoader } from 'three'
import { Suspense } from 'react'

export function usePlanetTextures() {
  // Load all planet textures
  const earthTexture = useLoader(ThreeTextureLoader, '/assets/planets/earth.jpg')
  const marsTexture = useLoader(ThreeTextureLoader, '/assets/planets/mars.jpg')
  const jupiterTexture = useLoader(ThreeTextureLoader, '/assets/planets/jupiter.jpg')
  const saturnTexture = useLoader(ThreeTextureLoader, '/assets/planets/saturn.jpg')
  const venusTexture = useLoader(ThreeTextureLoader, '/assets/planets/venus.jpg')
  const neptuneTexture = useLoader(ThreeTextureLoader, '/assets/planets/neptune.jpg')
  const sunTexture = useLoader(ThreeTextureLoader, '/assets/planets/sun.jpg')
  const saturnRingTexture = useLoader(ThreeTextureLoader, '/assets/planets/saturn_ring.png')

  // Apply better texture settings for all textures
  const textures = [
    earthTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    venusTexture,
    neptuneTexture,
    sunTexture
  ]

  textures.forEach(texture => {
    texture.wrapS = texture.wrapT = 1000 // THREE.RepeatWrapping
    texture.anisotropy = 16
  })

  return {
    earthTexture,
    marsTexture,
    jupiterTexture,
    saturnTexture,
    venusTexture,
    neptuneTexture,
    sunTexture,
    saturnRingTexture
  }
}

// Wrapper component to handle texture loading with suspense
export function TextureLoadingWrapper({ children }: { children: React.ReactNode }) {
  return (
    <Suspense fallback={null}>
      {children}
    </Suspense>
  )
}

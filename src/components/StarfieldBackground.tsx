'use client'

import { useEffect, useRef } from 'react'

interface Star {
  x: number
  y: number
  size: number
  speed: number
}

interface ShootingStar {
  x: number
  y: number
  length: number
  speed: number
  angle: number
  opacity: number
}

export default function StarfieldBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resizeCanvas = () => {
      if (canvas) {
        canvas.width = window.innerWidth
        canvas.height = window.innerHeight
      }
    }

    resizeCanvas()

    const stars: Star[] = []
    const shootingStars: ShootingStar[] = []

    for (let i = 0; i < 200; i++) {
      stars.push({
        x: Math.random() * (canvas?.width || 0), // Optional chaining to prevent null access
        y: Math.random() * (canvas?.height || 0),
        size: Math.random() * 2,
        speed: (Math.random() * 3 + 1) * 0.5, // Reduced to half speed
      })
    }

    function createShootingStar(): ShootingStar {
      return {
        x: Math.random() * (canvas?.width || 0), // Optional chaining here too
        y: Math.random() * (canvas?.height || 0),
        length: Math.random() * 80 + 20,
        speed: (Math.random() * 10 + 5) * 0.5, // Reduced to half speed
        angle: Math.random() * Math.PI / 4 + (Math.PI * 7) / 8,
        opacity: 1,
      }
    }

    function animate() {
      if (!ctx || !canvas) return

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Draw stars
      ctx.fillStyle = 'white'
      stars.forEach((star) => {
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()

        star.y += star.speed * 0.25
        if (star.y > canvas.height) {
          star.y = 0
          star.x = Math.random() * (canvas.width || 0)
        }
      })

      // Draw and update shooting stars
      shootingStars.forEach((star, index) => {
        ctx.save()
        ctx.translate(star.x, star.y)
        ctx.rotate(star.angle)

        const gradient = ctx.createLinearGradient(0, 0, star.length, 0)
        gradient.addColorStop(0, `rgba(255, 255, 255, ${star.opacity})`)
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)')

        ctx.fillStyle = gradient
        ctx.fillRect(0, 0, star.length, 2)
        ctx.restore()

        star.x -= Math.cos(star.angle) * star.speed
        star.y -= Math.sin(star.angle) * star.speed
        star.opacity -= 0.02

        if (star.opacity <= 0) {
          shootingStars.splice(index, 1)
        }
      })

      // Randomly add new shooting stars
      if (Math.random() < 0.02 && shootingStars.length < 5) {
        shootingStars.push(createShootingStar())
      }

      requestAnimationFrame(animate)
    }

    animate()

    const handleResize = () => resizeCanvas()

    window.addEventListener('resize', handleResize)

    return () => {
      window.removeEventListener('resize', handleResize)
    }
  }, [])

  return <canvas ref={canvasRef} className="fixed top-0 left-0 w-full h-full -z-10" />
}


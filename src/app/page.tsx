'use client'

import dynamic from 'next/dynamic'
import { Suspense } from 'react'

const Navigation3D = dynamic(() => import('@/components/Navigation3D'), { ssr: false })

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24">
      <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-4 sm:mb-6 md:mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 animate-pulse">
        Welcome to My Cosmic Portfolio
      </h1>
      <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-light mb-6 sm:mb-8 md:mb-10 lg:mb-12 max-w-xs sm:max-w-sm md:max-w-xl lg:max-w-2xl text-center text-gray-300">
        Explore the digital universe of tomorrow&rsquo;s web development, where innovation orbits imagination. Dive into my projects, skills, and cosmic chronicles.
      </p>
      <Suspense fallback={<div>Loading...</div>}>
        <Navigation3D />
      </Suspense>
    </main>
  )
}


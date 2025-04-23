'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Skill {
  id: number
  name: string
  level: number
}

export default function Skills() {
  const [skills, setSkills] = useState<Skill[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [hoveredSkill, setHoveredSkill] = useState<number | null>(null)

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const response = await fetch('/api/skills')
        if (!response.ok) {
          throw new Error('Failed to fetch skills')
        }
        const data = await response.json()
        setSkills(data)
      } catch (err) {
        console.error('Error fetching skills:', err)
        setError('Failed to load skills. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24"
    >
      <h1 className="text-4xl sm:text-5xl font-extrabold mb-12 text-center text-white">
        My Skills
      </h1>

      {isLoading && (
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-16 h-16 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-white text-lg">Loading skills...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-8">
          <p>{error}</p>
        </div>
      )}

      {!isLoading && !error && skills.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <p className="text-xl">No skills found.</p>
        </div>
      )}

      {!isLoading && !error && skills.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-12">
          {skills.map((skill) => (
          <motion.div
            key={skill.id}
            className="bg-black rounded-xl p-6 border border-white hover:border-gray-300 transition-all duration-300 transform hover:scale-105"
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: skill.id * 0.1 }}
            onMouseEnter={() => setHoveredSkill(skill.id)}
            onMouseLeave={() => setHoveredSkill(null)}
          >
            <div className="flex flex-col space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-white">{skill.name}</span>
                <motion.span
                  className="text-xl font-bold text-gray-300"
                >
                  {skill.level}%
                </motion.span>
              </div>
              <div className="relative h-3 bg-gray-700 rounded-full overflow-hidden">
                <motion.div
                  className="absolute top-0 left-0 h-full rounded-full bg-white"
                  initial={{ width: 0 }}
                  animate={{ width: `${skill.level}%` }}
                  transition={{ duration: 1, delay: 0.2 }}
                />
                {hoveredSkill === skill.id && (
                  <motion.div
                    className="absolute top-0 left-0 h-full w-full bg-gray-200/10"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.3 }}
                  />
                )}
              </div>
            </div>
          </motion.div>
        ))}
        </div>
      )}
      <Link
        href="/"
        className="px-6 py-3 bg-white text-black font-bold border border-white hover:bg-black hover:text-white transition-all duration-300 transform hover:-translate-y-1"
      >
        Return to Cosmic Hub
      </Link>
    </motion.div>
  )
}

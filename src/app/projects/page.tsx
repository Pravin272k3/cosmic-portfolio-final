'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState, useEffect } from 'react'

interface Project {
  id: number
  title: string
  description: string
  url: string
}

interface CollapsibleTextProps {
  text: string;
}

const CollapsibleText: React.FC<CollapsibleTextProps> = ({ text }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const maxLength = 100;
  const needsCollapse = text.length > maxLength;

  const displayText = isExpanded ? text : text.slice(0, maxLength) + (needsCollapse ? '...' : '');

  return (
    <div className="relative">
      <p className="text-base font-mono text-gray-300 mb-2">
        {displayText}
      </p>
      {needsCollapse && (
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-blue-400 hover:text-blue-300 text-sm font-mono transition-colors duration-300"
        >
          {isExpanded ? 'Show Less' : 'Read More'}
        </button>
      )}
    </div>
  );
};




export default function Projects() {
  const [hoveredProject, setHoveredProject] = useState<number | null>(null)
  const [projects, setProjects] = useState<Project[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        setProjects(data)
      } catch (err) {
        console.error('Error fetching projects:', err)
        setError('Failed to load projects. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24"
    >
      <h1 className="text-4xl sm:text-5xl font-black mb-8 sm:mb-12 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-400 via-blue-500 to-purple-600">
        Futuristic Projects
      </h1>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-blue-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-blue-300/70">Loading projects...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-400 bg-red-900/20 px-6 py-4 rounded-lg border border-red-500/30">{error}</div>
      ) : projects.length === 0 ? (
        <div className="text-center py-10 text-blue-300/70 bg-blue-900/20 px-6 py-4 rounded-lg border border-blue-500/30">
          No projects found in this dimension. Check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 sm:gap-10 mb-8 sm:mb-12">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group relative"
              onMouseEnter={() => setHoveredProject(project.id)}
              onMouseLeave={() => setHoveredProject(null)}
            >
              <div className="absolute inset-0 border border-white rotate-1 transform transition-transform duration-300 group-hover:rotate-2" />
              <div className="relative bg-black border border-white p-6 h-64 flex flex-col transform transition-all duration-300 hover:-translate-x-2 hover:-translate-y-2">
                <div className="absolute -top-1.5 -left-1.5 w-3 h-3 bg-green-400 rounded-full" />
                <div className="absolute -bottom-1.5 -right-1.5 w-3 h-3 bg-blue-500 rounded-full" />

                <h2 className="text-xl font-black mb-4 text-white underline decoration-green-400 decoration-2 underline-offset-4">
                  {project.title}
                </h2>

                <CollapsibleText text={project.description} />

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{
                    opacity: hoveredProject === project.id ? 1 : 0,
                    y: hoveredProject === project.id ? 0 : 20
                  }}
                  className="mt-auto"
                >
                  <Link
                    href={project.url}
                    className="inline-block px-4 py-2 bg-white text-black font-bold border border-white hover:bg-black hover:text-white transition-all duration-300 text-sm"
                  >
                    {">> Explore <<"}
                  </Link>
                </motion.div>
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
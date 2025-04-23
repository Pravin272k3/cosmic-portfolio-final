'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { Book } from 'lucide-react'
import { useState, useEffect } from 'react'

interface BlogPost {
  id: number
  title: string
  date: string
  excerpt: string
  content: string
}

const BlogPostCard = ({ post }: { post: BlogPost }) => {
  // Fixed excerpt length with ellipsis if needed
  const maxLength = 120
  const truncatedExcerpt = post.excerpt.length > maxLength
    ? `${post.excerpt.slice(0, maxLength)}...`
    : post.excerpt

  // Format date to be more readable
  const formattedDate = new Date(post.date).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <motion.div
      whileHover={{
        scale: 1.03,
        boxShadow: '0 10px 30px -10px rgba(0, 230, 150, 0.3)'
      }}
      whileTap={{ scale: 0.98 }}
      className="relative overflow-hidden rounded-xl shadow-xl transition-all duration-300 flex flex-col h-full"
      style={{
        background: 'linear-gradient(135deg, rgba(10, 10, 30, 0.95), rgba(30, 30, 60, 0.9))',
        borderTop: '1px solid rgba(100, 255, 200, 0.2)',
        borderLeft: '1px solid rgba(100, 255, 200, 0.2)',
        borderRight: '1px solid rgba(70, 130, 180, 0.2)',
        borderBottom: '1px solid rgba(70, 130, 180, 0.2)',
      }}
    >
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-cyan-500/20 to-blue-500/20 rounded-bl-full"></div>
      <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-green-500/20 to-emerald-500/20 rounded-tr-full"></div>

      {/* Content */}
      <div className="p-6 flex-grow flex flex-col">
        <div className="mb-4 flex justify-between items-start">
          <h2 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-teal-400">
            {post.title}
          </h2>
          <span className="text-xs text-cyan-300/70 bg-cyan-900/30 px-2 py-1 rounded-full">
            {formattedDate}
          </span>
        </div>

        <div className="text-gray-300 mb-6 flex-grow">
          <p>{truncatedExcerpt}</p>
        </div>

        <Link
          href={`/blog/${post.id}`}
          className="self-start px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-teal-500 text-black font-medium rounded-lg hover:from-cyan-600 hover:to-teal-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center space-x-2"
        >
          <span>Read Article</span>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>
    </motion.div>
  )
}

export default function Blog() {
  const [blogPosts, setBlogPosts] = useState<BlogPost[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlogPosts = async () => {
      try {
        const response = await fetch('/api/blogs')
        if (!response.ok) throw new Error('Failed to fetch blog posts')
        const data = await response.json()
        setBlogPosts(data)
      } catch (err) {
        console.error('Error fetching blog posts:', err)
        setError('Failed to load blog posts. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPosts()
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-start py-16 px-6"
    >
      <motion.h1
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, type: 'spring' }}
        className="text-4xl md:text-5xl font-extrabold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400"
      >
        Cosmic Chronicles
      </motion.h1>

      {isLoading ? (
        <div className="text-center py-10">
          <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-cyan-500 border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-cyan-300/70">Loading cosmic articles...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 text-red-400 bg-red-900/20 px-6 py-4 rounded-lg border border-red-500/30">{error}</div>
      ) : blogPosts.length === 0 ? (
        <div className="text-center py-10 text-cyan-300/70 bg-cyan-900/20 px-6 py-4 rounded-lg border border-cyan-500/30">
          No blog posts found in this dimension. Check back later.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-6xl">
          {blogPosts.map((post, index) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <BlogPostCard post={post} />
            </motion.div>
          ))}
        </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
        className="mt-16"
      >
        <Link
          href="/"
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-cyan-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-cyan-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg flex items-center space-x-2"
        >
          <Book className="w-5 h-5" />
          <span>Return to Cosmic Hub</span>
        </Link>
      </motion.div>
    </motion.div>
  )
}

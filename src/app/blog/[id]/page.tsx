'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import { ArrowLeft, Calendar } from 'lucide-react'
import { useRouter } from 'next/navigation'

interface BlogPost {
  id: number
  title: string
  date: string
  excerpt: string
  content: string
}

export default function BlogDetail({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  const [blogPost, setBlogPost] = useState<BlogPost | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(`/api/blogs?id=${id}`)

        if (!response.ok) {
          throw new Error('Failed to fetch blog post')
        }

        const data = await response.json()
        setBlogPost(data)
      } catch (err) {
        console.error('Error fetching blog post:', err)
        setError('Failed to load blog post. Please try again later.')
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogPost()
  }, [id])

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="w-16 h-16 mb-4 mx-auto"
          >
            <div className="h-full w-full rounded-full border-4 border-t-cyan-400 border-r-cyan-200/30 border-b-cyan-400/50 border-l-cyan-200/30"></div>
          </motion.div>
          <p className="text-cyan-300/70 text-lg">Loading cosmic article...</p>
        </div>
      </div>
    )
  }

  if (error || !blogPost) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-red-400 bg-red-900/20 px-8 py-6 rounded-xl border border-red-500/30 mb-8 max-w-md"
        >
          <div className="text-xl mb-2 font-semibold">Cosmic Anomaly Detected</div>
          <div>{error || 'The article you\'re looking for seems to have drifted into another dimension.'}</div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          <Link
            href="/blog"
            className="flex items-center space-x-2 px-5 py-2.5 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium rounded-lg hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg"
          >
            <ArrowLeft size={16} />
            <span>Return to Cosmic Chronicles</span>
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center py-16 px-6"
    >
      <div className="w-full max-w-4xl">
        <Link
          href="/blog"
          className="flex items-center space-x-2 text-cyan-400 hover:text-cyan-300 transition-colors duration-300 mb-8 group"
        >
          <motion.div
            whileHover={{ x: -3 }}
            transition={{ type: 'spring', stiffness: 400 }}
          >
            <ArrowLeft size={18} className="group-hover:stroke-2" />
          </motion.div>
          <span>Back to Cosmic Chronicles</span>
        </Link>

        <motion.h1
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.7, type: 'spring' }}
          className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-teal-300 to-emerald-400"
        >
          {blogPost.title}
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex items-center space-x-2 text-cyan-300/70 bg-cyan-900/30 px-3 py-1.5 rounded-full w-fit mb-8"
        >
          <Calendar size={14} />
          <span className="text-sm">
            {new Date(blogPost.date).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric'
            })}
          </span>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="prose prose-lg prose-invert max-w-none"
        >
          <div className="bg-gradient-to-br from-cyan-900/30 to-blue-900/30 p-8 rounded-xl border border-cyan-500/20 mb-10 shadow-lg">
            <p className="text-xl text-cyan-100 italic leading-relaxed">{blogPost.excerpt}</p>
          </div>

          <div className="space-y-8 text-gray-200 bg-black/30 p-8 rounded-xl border border-gray-800/50 shadow-inner">
            {blogPost.content.split('\n\n').map((paragraph, index) => (
              <motion.p
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + (index * 0.1) }}
                className="leading-relaxed"
              >
                {paragraph}
              </motion.p>
            ))}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

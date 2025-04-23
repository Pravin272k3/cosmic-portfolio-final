'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import { useState, useRef, useEffect } from 'react'
import { Rocket } from 'lucide-react'
import emailjs from '@emailjs/browser'

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface SubmitButtonProps {
  isSubmitting: boolean
  status: 'idle' | 'submitting' | 'success' | 'error'
}

const SubmitButton = ({ isSubmitting, status }: SubmitButtonProps) => {
  return (
    <motion.button
      type="submit"
      disabled={isSubmitting}
      className="relative w-full h-12 px-6 bg-white text-black rounded-lg border border-gray-500 shadow-lg hover:shadow-xl transition-transform duration-200"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <div className="relative">
        <AnimatePresence mode="wait">
          {status === 'idle' && (
            <motion.div
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex items-center justify-center gap-2"
            >
              <Rocket className="w-5 h-5 text-black" />
              <span>Launch Message into Space</span>
            </motion.div>
          )}

          {status === 'submitting' && (
            <motion.div
              key="submitting"
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 100, opacity: 0 }}
              className="flex items-center justify-center"
            >
              <motion.div
                animate={{ x: [0, 100], transition: { duration: 1, repeat: Infinity } }}
              >
                <Rocket className="w-5 h-5 text-black" />
              </motion.div>
              <span className="ml-2">Launching...</span>
            </motion.div>
          )}

          {status === 'success' && (
            <motion.div
              key="success"
              className="flex items-center justify-center gap-2"
            >
              <motion.div
                initial={{ x: -100, rotate: 0 }}
                animate={{
                  x: 100,
                  transition: { duration: 1 },
                }}
              >
                <Rocket className="w-5 h-5 text-black" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 1 }}
              >
                Successfully Launched!
              </motion.span>
            </motion.div>
          )}

          {status === 'error' && (
            <motion.div
              key="error"
              className="flex items-center justify-center gap-2"
            >
              <motion.div
                initial={{ x: -100, rotate: 0 }}
                animate={{
                  x: 0,
                  rotate: 45,
                  transition: {
                    x: { duration: 0.5 },
                    rotate: { duration: 0.2, delay: 0.5 },
                  },
                }}
              >
                <Rocket className="w-5 h-5 text-black" />
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.7 }}
              >
                Failed to Send
              </motion.span>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.button>
  )
}

export default function Contact() {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    subject: 'Message from Portfolio Contact Form',
    message: '',
  })
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  // Initialize EmailJS once when component mounts
  useEffect(() => {
    emailjs.init({
      publicKey: process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || '',
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setSubmitStatus('submitting')

    try {
      // Prepare template parameters
      const templateParams = {
        to_name: 'Pravin',
        from_name: formData.name,
        from_email: formData.email,
        subject: formData.subject,
        message: formData.message,
        reply_to: formData.email,
      }

      // Send email using EmailJS
      await emailjs.send(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        templateParams
      )

      setSubmitStatus('success')
    } catch (error) {
      console.error('Error sending message:', error)
      setSubmitStatus('error')
    }

    // Reset form after 5 seconds
    setTimeout(() => {
      setSubmitStatus('idle')
      if (submitStatus === 'success') {
        setFormData({
          name: '',
          email: '',
          subject: 'Message from Portfolio Contact Form',
          message: ''
        })
      }
    }, 5000)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 relative overflow-hidden"
    >
      <motion.h1
        className="text-4xl sm:text-5xl font-bold mb-8 text-center text-white"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        Contact the Cosmos
      </motion.h1>
      <form onSubmit={handleSubmit} className="w-full max-w-md space-y-6 relative">
        <div>
          <label htmlFor="name" className="block mb-2 text-lg font-medium text-gray-300">
            Cosmic Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-500 bg-black text-white shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
            placeholder="Enter your cosmic name"
          />
        </div>
        <div>
          <label htmlFor="email" className="block mb-2 text-lg font-medium text-gray-300">
            Interstellar Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-500 bg-black text-white shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
            placeholder="your@cosmic.email"
          />
        </div>
        <div>
          <label htmlFor="subject" className="block mb-2 text-lg font-medium text-gray-300">
            Cosmic Subject
          </label>
          <input
            type="text"
            id="subject"
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-500 bg-black text-white shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
            placeholder="What brings you to my cosmic realm?"
          />
        </div>
        <div>
          <label htmlFor="message" className="block mb-2 text-lg font-medium text-gray-300">
            Cosmic Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="w-full px-4 py-3 rounded-md border border-gray-500 bg-black text-white shadow-lg focus:ring-2 focus:ring-white focus:outline-none"
            rows={4}
            placeholder="Type your message to the stars..."
          />
        </div>
        <SubmitButton isSubmitting={submitStatus === 'submitting'} status={submitStatus} />
      </form>
      <Link
        href="/"
        className="mt-6 px-6 py-3 bg-white text-black font-bold border border-white hover:bg-black hover:text-white transition-all duration-300 transform hover:-translate-y-1"
      >
        Return to Cosmic Hub
      </Link>
    </motion.div>
  )
}

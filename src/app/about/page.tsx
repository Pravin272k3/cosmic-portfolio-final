'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import pravinImage from '@/assets/images/pravin2.png'
// import resumePdf from '@/assets/resume/pravin-sharma-resume.pdf' // Add this import
import { useEffect, useState } from 'react'
import { GithubIcon, TwitterIcon, LinkedinIcon, MailIcon, CodeIcon, SmartphoneIcon, DatabaseIcon, CloudIcon, DownloadIcon } from 'lucide-react'

const skills = [
  {
    name: 'Web Development',
    icon: CodeIcon,
    color: 'from-blue-400 to-blue-600',
    description: 'Building responsive and dynamic web applications'
  },
  {
    name: 'App Development',
    icon: SmartphoneIcon,
    color: 'from-green-400 to-green-600',
    description: 'Creating cross-platform mobile experiences'
  },
  {
    name: 'Backend Development',
    icon: DatabaseIcon,
    color: 'from-yellow-400 to-yellow-600',
    description: 'Designing robust server-side solutions'
  },
  {
    name: 'Cloud Computing',
    icon: CloudIcon,
    color: 'from-purple-400 to-purple-600',
    description: 'Leveraging cloud infrastructure for scalability'
  },
]

const socialLinks = [
  { name: 'GitHub', icon: GithubIcon, url: 'https://github.com/known-27' },
  { name: 'Twitter', icon: TwitterIcon, url: 'https://x.com/PravinS______' },
  { name: 'LinkedIn', icon: LinkedinIcon, url: 'https://www.linkedin.com/in/pravin-sharma-505282285/' },
  { name: 'Email', icon: MailIcon, url: 'mailto:sharma272k3@gmail.com' },
]

interface ResumeSettings {
  filename: string;
  displayName: string;
  lastUpdated: string;
}

export default function About() {
  const [resumeSettings, setResumeSettings] = useState<ResumeSettings | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch resume settings
  useEffect(() => {
    const fetchResumeSettings = async () => {
      try {
        const response = await fetch('/api/settings/resume')
        if (!response.ok) {
          throw new Error('Failed to fetch resume information')
        }
        const data = await response.json()
        setResumeSettings(data)
      } catch (err) {
        console.error('Error fetching resume:', err)
        setError('Could not load resume information')
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumeSettings()
  }, [])
  const [mounted, setMounted] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [downloadProgress, setDownloadProgress] = useState(0)

  useEffect(() => {
    setMounted(true)
  }, [])

  const handleDownloadResume = async () => {
    if (!resumeSettings) return

    try {
      setDownloading(true)
      setDownloadProgress(0)

      // Simulate progress for better UX
      const progressInterval = setInterval(() => {
        setDownloadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval)
            return prev
          }
          return prev + 10
        })
      }, 200)

      const response = await fetch(`/resume/${resumeSettings.filename}`)
      const blob = await response.blob()

      // Clear interval and set to 100%
      clearInterval(progressInterval)
      setDownloadProgress(100)

      // Create download link
      const url = window.URL.createObjectURL(blob)
      const link = document.createElement('a')
      link.href = url
      link.download = resumeSettings.displayName || 'resume.pdf'

      // Trigger download
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      // Cleanup
      window.URL.revokeObjectURL(url)

      // Show complete state briefly
      await new Promise(resolve => setTimeout(resolve, 1000))
    } catch (error) {
      console.error('Download failed:', error)
      // You could add error state handling here
    } finally {
      setDownloading(false)
      setDownloadProgress(0)
    }
  }


  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24 relative overflow-hidden"
    >
      {mounted && (
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: "url('/earth-background.jpg')",
            filter: 'brightness(0.4)'
          }}
        />
      )}

      <div className="relative z-10 w-full max-w-6xl">
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-12"
        >
          <h1 className="text-5xl sm:text-6xl font-extrabold mb-4 text-white">
            Pravin Sharma
          </h1>
          <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
            Developer With No Boundries
          </h2>
        </motion.div>

        <div className="flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 mb-12">
          <motion.div
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="relative"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full animate-pulse blur-xl opacity-70" />
            <div className="relative">
              <Image
                src={pravinImage}
                alt="Pravin Sharma"
                width={300}
                height={300}
                className="rounded-full border-4 border-blue-500 shadow-lg"
              />
              <div className="absolute inset-0 rounded-full border-4 border-blue-400 opacity-50 animate-ping" />
            </div>
          </motion.div>

          <motion.div
            initial={{ x: 100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="max-w-xl text-center lg:text-left space-y-6"
          >
            <p className="text-xl font-light text-gray-200 leading-relaxed">
              As a passionate Full Stack Developer, I navigate the digital landscape with innovation and technical expertise. My mission is to create seamless, user-centric applications that push the boundaries of what&apos;s possible in web and mobile development.
            </p>
            <p className="text-xl font-light text-gray-200 leading-relaxed">
              Currently, I&apos;m a second-year Computer Science Engineering student at the University of Mumbai, where I apply my strong foundation in programming and technology to solve real-world problems. With a passion for hands-on experience, I continuously refine my skills and collaborate with others to create impactful applications.
            </p>
          </motion.div>
        </div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="w-full max-w-6xl mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-white mb-8">
            <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Cosmic Skills
            </span>
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{
                  // delay: 0.8 + index * 0.1,
                  type: "spring",
                  stiffness: 200
                }}
                whileHover={{ scale: 1.05 }}
                className="relative group"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-xl blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className={`relative bg-black/40 backdrop-blur-sm border border-white/10 p-6 rounded-xl hover:border-white/20 transition-all duration-300`}>
                  <div className="flex items-center space-x-4">
                    <div className={`p-3 rounded-lg bg-gradient-to-r ${skill.color}`}>
                      <skill.icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-white">{skill.name}</h3>
                      <p className="text-gray-300 mt-1">{skill.description}</p>
                    </div>
                  </div>
                  <div className="mt-4 w-full bg-white/10 rounded-full h-2">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ delay: 1 + index * 0.1, duration: 1 }}
                      className={`h-full rounded-full bg-gradient-to-r ${skill.color}`}
                    />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Enhanced Centered Resume Download Button */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="w-full flex justify-center items-center my-16 px-4"
        >
          <div className="relative group">
            {/* Cosmic background effect */}
            <motion.div
              className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 rounded-full opacity-75 blur-lg group-hover:opacity-100 transition-all duration-500"
              animate={{
                scale: downloading ? [1, 1.1, 1] : 1,
                // rotate: downloading ? [0, 360] : 0,
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "linear"
              }}
            />

            {/* Button glow effect */}
            <div className="absolute inset-0.5 bg-black rounded-full blur-sm" />

            {/* Interactive button */}
            <button
              onClick={handleDownloadResume}
              disabled={downloading || isLoading || !!error || !resumeSettings}
              className="relative px-8 py-4 bg-gradient-to-r from-blue-600 to-cyan-600 rounded-full transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 flex items-center space-x-3 min-w-[240px] justify-center group disabled:cursor-wait"
            >
              {/* Download icon */}
              <motion.div
                animate={{
                  rotate: downloading ? 360 : 0
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "linear"
                }}
              >
                <DownloadIcon className={`w-6 h-6 text-white ${downloading ? 'opacity-80' : 'group-hover:scale-110 duration-300'}`} />
              </motion.div>

              {/* Button text */}
              <span className="text-lg font-semibold text-white tracking-wide">
                {downloading ? `Downloading ${downloadProgress}%` : isLoading ? 'Loading Resume...' : error ? 'Resume Unavailable' : !resumeSettings ? 'No Resume Available' : `Download ${resumeSettings.displayName}`}
              </span>

              {/* Download progress ring */}
              {downloading && (
                <>
                  <motion.div
                    className="absolute -inset-1 rounded-full border-2 border-white/50"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{
                      scale: [1, 1.1, 1],
                      opacity: [0.5, 0.2, 0.5]
                    }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "easeInOut"
                    }}
                  />
                  <motion.div
                    className="absolute inset-0 rounded-full border-2 border-white/20"
                    style={{
                      background: `conic-gradient(from 0deg, transparent ${100 - downloadProgress}%, rgba(255,255,255,0.2) ${100 - downloadProgress}%)`
                    }}
                  />
                </>
              )}
            </button>

            {/* Particle effects */}
            {mounted && !downloading && (
              <>
                {[...Array(6)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-1 h-1 bg-blue-400 rounded-full"
                    initial={{
                      x: 0,
                      y: 0,
                      scale: 0,
                    }}
                    animate={{
                      x: [0, (Math.random() - 0.5) * 100],
                      y: [0, (Math.random() - 0.5) * 100],
                      scale: [0, 1, 0],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatType: "loop",
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1 }}
          className="flex justify-center gap-6 mb-12"
        >
          {socialLinks.map((link, index) => (
            <motion.a
              key={link.name}
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 1 + index * 0.1 }}
              className="bg-white/10 p-3 rounded-full hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <link.icon className="w-6 h-6 text-white" />
            </motion.a>
          ))}
        </motion.div>

        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="text-center"
        >
          <Link
            href="/"
            className="inline-block px-8 py-4 bg-gradient-to-r from-blue-500 to-cyan-500 text-white rounded-full hover:from-blue-600 hover:to-cyan-600 transition-all duration-300 transform hover:scale-105 text-lg font-semibold"
          >
            Return to Cosmic Hub
          </Link>
        </motion.div>
      </div>

      {/* Floating particles */}
      {mounted && [...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-white rounded-full"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            y: [null, Math.random() * window.innerHeight],
            opacity: [0, 1, 0],
          }}
          transition={{
            duration: Math.random() * 10 + 5,
            repeat: Infinity,
            ease: "linear",
          }}
        />
      ))}
    </motion.div>
  )
}

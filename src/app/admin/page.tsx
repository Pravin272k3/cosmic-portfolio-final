'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, FileText, Settings, Plus, Briefcase, Award, Upload, FileUp, Check, AlertCircle, Palette, Image as ImageIcon, Trash2, Edit } from 'lucide-react'
import Link from 'next/link'
import Image from 'next/image'
import { ARTWORK_CATEGORIES } from '@/types/artwork'

// Skills Management Component
function SkillsManagement() {
  const [skills, setSkills] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentSkill, setCurrentSkill] = useState<any>(null)
  const [formData, setFormData] = useState({ name: '', level: 0 })

  // Fetch skills
  useEffect(() => {
    const fetchSkills = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/skills')
        if (!response.ok) {
          throw new Error('Failed to fetch skills')
        }
        const data = await response.json()
        setSkills(data)
      } catch (err) {
        console.error('Error fetching skills:', err)
        setError('Failed to load skills')
      } finally {
        setIsLoading(false)
      }
    }

    fetchSkills()
  }, [])

  // Handle form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: name === 'level' ? parseInt(value) || 0 : value
    }))
  }

  // Open edit modal with skill data
  const handleEditClick = (skill: any) => {
    setCurrentSkill(skill)
    setFormData({ name: skill.name, level: skill.level })
    setIsEditModalOpen(true)
  }

  // Add new skill
  const handleAddSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const response = await fetch('/api/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add skill')
      }

      const newSkill = await response.json()
      setSkills(prev => [...prev, newSkill])
      setIsAddModalOpen(false)
      setFormData({ name: '', level: 0 })
    } catch (err: any) {
      console.error('Error adding skill:', err)
      alert(err.message || 'Failed to add skill')
    }
  }

  // Update existing skill
  const handleUpdateSkill = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!currentSkill) return

    try {
      const response = await fetch('/api/skills', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: currentSkill.id, ...formData })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update skill')
      }

      const updatedSkill = await response.json()
      setSkills(prev =>
        prev.map(skill => skill.id === updatedSkill.id ? updatedSkill : skill)
      )
      setIsEditModalOpen(false)
      setCurrentSkill(null)
    } catch (err: any) {
      console.error('Error updating skill:', err)
      alert(err.message || 'Failed to update skill')
    }
  }

  // Delete skill
  const handleDeleteSkill = async (id: number) => {
    if (!confirm('Are you sure you want to delete this skill?')) return

    try {
      const response = await fetch(`/api/skills?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete skill')
      }

      setSkills(prev => prev.filter(skill => skill.id !== id))
    } catch (err: any) {
      console.error('Error deleting skill:', err)
      alert(err.message || 'Failed to delete skill')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Skills Management</h2>
        <button
          onClick={() => {
            setFormData({ name: '', level: 0 })
            setIsAddModalOpen(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors duration-300"
        >
          <Plus size={16} />
          <span>Add Skill</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-10 h-10 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : skills.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          <p>No skills found. Add your first skill!</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Name</th>
                <th className="p-3 text-left">Level</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {skills.map((skill) => (
                <tr key={skill.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{skill.name}</td>
                  <td className="p-3">
                    <div className="flex items-center">
                      <div className="w-32 bg-gray-700 h-2 rounded-full mr-2">
                        <div
                          className="bg-blue-500 h-2 rounded-full"
                          style={{ width: `${skill.level}%` }}
                        ></div>
                      </div>
                      <span>{skill.level}%</span>
                    </div>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => handleEditClick(skill)}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteSkill(skill.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Skill Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Add New Skill</h3>
            <form onSubmit={handleAddSkill}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Skill Level (0-100)</label>
                <input
                  type="number"
                  name="level"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="mt-2 bg-gray-700 h-2 rounded-full">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${formData.level}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded"
                >
                  Add Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Skill Modal */}
      {isEditModalOpen && currentSkill && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Skill</h3>
            <form onSubmit={handleUpdateSkill}>
              <div className="mb-4">
                <label className="block text-sm font-medium mb-1">Skill Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              <div className="mb-6">
                <label className="block text-sm font-medium mb-1">Skill Level (0-100)</label>
                <input
                  type="number"
                  name="level"
                  min="0"
                  max="100"
                  value={formData.level}
                  onChange={handleInputChange}
                  className="w-full p-2 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <div className="mt-2 bg-gray-700 h-2 rounded-full">
                  <div
                    className="bg-blue-500 h-2 rounded-full"
                    style={{ width: `${formData.level}%` }}
                  ></div>
                </div>
              </div>
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded"
                >
                  Update Skill
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default function AdminDashboard() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('blogs')
  const [isLoading, setIsLoading] = useState(false)

  const handleLogout = async () => {
    setIsLoading(true)
    try {
      await fetch('/api/auth', {
        method: 'DELETE',
      })
      router.push('/admin/login')
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">
          Admin Dashboard
        </h1>
        <button
          onClick={handleLogout}
          disabled={isLoading}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 rounded transition-colors duration-300"
        >
          <LogOut size={16} />
          <span>{isLoading ? 'Logging out...' : 'Logout'}</span>
        </button>
      </header>

      {/* Main content */}
      <div className="flex flex-col md:flex-row min-h-[calc(100vh-64px)]">
        {/* Sidebar */}
        <div className="w-full md:w-64 bg-gray-800 p-4">
          <nav className="space-y-2">
            <button
              onClick={() => setActiveTab('blogs')}
              className={`w-full flex items-center space-x-2 p-3 rounded transition-colors duration-200 ${
                activeTab === 'blogs'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <FileText size={18} />
              <span>Blog Posts</span>
            </button>
            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center space-x-2 p-3 rounded transition-colors duration-200 ${
                activeTab === 'projects'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Briefcase size={18} />
              <span>Projects</span>
            </button>
            <button
              onClick={() => setActiveTab('skills')}
              className={`w-full flex items-center space-x-2 p-3 rounded transition-colors duration-200 ${
                activeTab === 'skills'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Award size={18} />
              <span>Skills</span>
            </button>
            <button
              onClick={() => setActiveTab('artworks')}
              className={`w-full flex items-center space-x-2 p-3 rounded transition-colors duration-200 ${
                activeTab === 'artworks'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Palette size={18} />
              <span>Artworks</span>
            </button>
            <button
              onClick={() => setActiveTab('settings')}
              className={`w-full flex items-center space-x-2 p-3 rounded transition-colors duration-200 ${
                activeTab === 'settings'
                  ? 'bg-blue-600 text-white'
                  : 'hover:bg-gray-700 text-gray-300'
              }`}
            >
              <Settings size={18} />
              <span>Settings</span>
            </button>
          </nav>
        </div>

        {/* Content area */}
        <div className="flex-1 p-6">
          {activeTab === 'blogs' && <BlogManagement />}
          {activeTab === 'projects' && <ProjectManagement />}
          {activeTab === 'skills' && <SkillsManagement />}
          {activeTab === 'artworks' && <ArtworkManagement />}
          {activeTab === 'settings' && <SettingsPanel />}
        </div>
      </div>
    </div>
  )
}

function BlogManagement() {
  const [blogs, setBlogs] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('/api/blogs')
        if (!response.ok) throw new Error('Failed to fetch blogs')
        const data = await response.json()
        setBlogs(data)
      } catch (error) {
        console.error('Error fetching blogs:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchBlogs()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this blog post?')) return

    try {
      const response = await fetch(`/api/blogs?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete blog post')

      // Update the blogs list
      setBlogs(blogs.filter(blog => blog.id !== id))
    } catch (error) {
      console.error('Error deleting blog:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading blog posts...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Blog Posts</h2>
        <Link
          href="/admin/blogs/new"
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors duration-300"
        >
          <Plus size={16} />
          <span>New Post</span>
        </Link>
      </div>

      {blogs.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No blog posts found. Create your first post!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Date</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map((blog) => (
                <tr key={blog.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{blog.title}</td>
                  <td className="p-3">{blog.date}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <Link
                        href={`/admin/blogs/edit/${blog.id}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(blog.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

function ProjectManagement() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const response = await fetch('/api/projects')
        if (!response.ok) throw new Error('Failed to fetch projects')
        const data = await response.json()
        setProjects(data)
      } catch (error) {
        console.error('Error fetching projects:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchProjects()
  }, [])

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return

    try {
      const response = await fetch(`/api/projects?id=${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) throw new Error('Failed to delete project')

      // Update the projects list
      setProjects(projects.filter(project => project.id !== id))
    } catch (error) {
      console.error('Error deleting project:', error)
    }
  }

  if (isLoading) {
    return <div className="text-center py-10">Loading projects...</div>
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Projects</h2>
        <Link
          href="/admin/projects/new"
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors duration-300"
        >
          <Plus size={16} />
          <span>New Project</span>
        </Link>
      </div>

      {projects.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No projects found. Create your first project!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">URL</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {projects.map((project) => (
                <tr key={project.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">{project.title}</td>
                  <td className="p-3">
                    <a
                      href={project.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:text-blue-300 hover:underline"
                    >
                      {project.url}
                    </a>
                  </td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <Link
                        href={`/admin/projects/edit/${project.id}`}
                        className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

// Artwork Management Component
function ArtworkManagement() {
  const [artworks, setArtworks] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isAddModalOpen, setIsAddModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [currentArtwork, setCurrentArtwork] = useState<any>(null)
  const [formData, setFormData] = useState({ title: '', category: 'Charcoal' })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitSuccess, setSubmitSuccess] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch artworks
  useEffect(() => {
    const fetchArtworks = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/artworks')
        if (!response.ok) {
          throw new Error('Failed to fetch artworks')
        }
        const data = await response.json()
        setArtworks(data)
      } catch (err) {
        console.error('Error fetching artworks:', err)
        setError('Failed to load artworks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtworks()
  }, [])

  // Handle form input changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSelectedFile(e.target.files[0])
      // Reset states
      setSubmitSuccess(false)
      setSubmitError(null)
    }
  }

  // Handle artwork creation
  const handleAddArtwork = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!selectedFile) {
      setSubmitError('Please select an image file')
      return
    }

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const formDataToSend = new FormData()
      formDataToSend.append('title', formData.title)
      formDataToSend.append('category', formData.category)
      formDataToSend.append('file', selectedFile)

      const response = await fetch('/api/artworks', {
        method: 'POST',
        body: formDataToSend
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to add artwork')
      }

      const data = await response.json()
      setArtworks(prev => [...prev, data])
      setSubmitSuccess(true)

      // Reset form
      setFormData({ title: '', category: 'Charcoal' })
      setSelectedFile(null)
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }

      // Close modal after a delay
      setTimeout(() => {
        setIsAddModalOpen(false)
        setSubmitSuccess(false)
      }, 1500)
    } catch (err: any) {
      console.error('Error adding artwork:', err)
      setSubmitError(err.message || 'Failed to add artwork')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle artwork update
  const handleUpdateArtwork = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!currentArtwork) return

    try {
      setIsSubmitting(true)
      setSubmitError(null)

      const formDataToSend = new FormData()
      formDataToSend.append('id', currentArtwork.id.toString())
      formDataToSend.append('title', formData.title)
      formDataToSend.append('category', formData.category)

      if (selectedFile) {
        formDataToSend.append('file', selectedFile)
      }

      const response = await fetch('/api/artworks', {
        method: 'PUT',
        body: formDataToSend
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update artwork')
      }

      const data = await response.json()

      // Update artworks list
      setArtworks(prev =>
        prev.map(artwork => artwork.id === data.id ? data : artwork)
      )

      setSubmitSuccess(true)

      // Close modal after a delay
      setTimeout(() => {
        setIsEditModalOpen(false)
        setSubmitSuccess(false)
      }, 1500)
    } catch (err: any) {
      console.error('Error updating artwork:', err)
      setSubmitError(err.message || 'Failed to update artwork')
    } finally {
      setIsSubmitting(false)
    }
  }

  // Handle artwork deletion
  const handleDeleteArtwork = async (id: number) => {
    if (!confirm('Are you sure you want to delete this artwork?')) return

    try {
      const response = await fetch(`/api/artworks?id=${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to delete artwork')
      }

      // Remove from list
      setArtworks(prev => prev.filter(artwork => artwork.id !== id))
    } catch (err) {
      console.error('Error deleting artwork:', err)
      alert('Failed to delete artwork')
    }
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Artwork Management</h2>
        <button
          onClick={() => {
            setFormData({ title: '', category: 'Charcoal' })
            setSelectedFile(null)
            setSubmitSuccess(false)
            setSubmitError(null)
            setIsAddModalOpen(true)
          }}
          className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 rounded transition-colors duration-300"
        >
          <Plus size={16} />
          <span>Add Artwork</span>
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg">
          <p>{error}</p>
        </div>
      ) : artworks.length === 0 ? (
        <div className="text-center py-10 text-gray-400">
          No artworks found. Add your first artwork!
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="bg-gray-800">
                <th className="p-3 text-left">Image</th>
                <th className="p-3 text-left">Title</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Date Added</th>
                <th className="p-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {artworks.map((artwork) => (
                <tr key={artwork.id} className="border-t border-gray-700 hover:bg-gray-800">
                  <td className="p-3">
                    <div className="w-12 h-12 relative rounded overflow-hidden">
                      <Image
                        src={`/artworks/${artwork.filename}`}
                        alt={artwork.title}
                        width={48}
                        height={48}
                        className="object-cover"
                      />
                    </div>
                  </td>
                  <td className="p-3">{artwork.title}</td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-purple-900/50 text-purple-300 rounded-full text-xs">
                      {artwork.category}
                    </span>
                  </td>
                  <td className="p-3">{artwork.createdAt}</td>
                  <td className="p-3 text-center">
                    <div className="flex justify-center space-x-2">
                      <button
                        onClick={() => {
                          setCurrentArtwork(artwork)
                          setFormData({
                            title: artwork.title,
                            category: artwork.category
                          })
                          setSelectedFile(null)
                          setSubmitSuccess(false)
                          setSubmitError(null)
                          setIsEditModalOpen(true)
                        }}
                        className="p-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm"
                      >
                        <Edit size={14} />
                      </button>
                      <button
                        onClick={() => handleDeleteArtwork(artwork.id)}
                        className="p-1.5 bg-red-600 hover:bg-red-700 rounded text-sm"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Add Artwork Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <ImageIcon className="mr-2" />
              Add New Artwork
            </h3>

            <form onSubmit={handleAddArtwork}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter artwork title"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {ARTWORK_CATEGORIES.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Image</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                <p className="mt-1 text-sm text-gray-400">Supported formats: JPG, PNG, WebP, GIF</p>
              </div>

              {selectedFile && (
                <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">Selected file: {selectedFile.name}</p>
                </div>
              )}

              {submitSuccess && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-green-300">Artwork added successfully!</p>
                </div>
              )}

              {submitError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-start">
                  <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300">{submitError}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-300 flex items-center disabled:bg-blue-800 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Saving...
                    </>
                  ) : (
                    <>Save</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Artwork Modal */}
      {isEditModalOpen && currentArtwork && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
          <div className="bg-gray-800 rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold mb-4 flex items-center">
              <Edit className="mr-2" />
              Edit Artwork
            </h3>

            <div className="mb-4 p-3 bg-gray-700 rounded-lg flex items-center space-x-3">
              <div className="w-16 h-16 relative rounded overflow-hidden flex-shrink-0">
                <Image
                  src={`/artworks/${currentArtwork.filename}`}
                  alt={currentArtwork.title}
                  fill
                  className="object-cover"
                />
              </div>
              <div>
                <p className="text-white font-medium">{currentArtwork.title}</p>
                <p className="text-sm text-gray-400">Current image</p>
              </div>
            </div>

            <form onSubmit={handleUpdateArtwork}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Title</label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Enter artwork title"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Category</label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  {ARTWORK_CATEGORIES.filter(cat => cat !== 'All').map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Replace Image (Optional)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="image/*"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-400">Leave empty to keep current image</p>
              </div>

              {selectedFile && (
                <div className="mb-4 p-3 bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-300">New file selected: {selectedFile.name}</p>
                </div>
              )}

              {submitSuccess && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-green-300">Artwork updated successfully!</p>
                </div>
              )}

              {submitError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-start">
                  <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300">{submitError}</p>
                </div>
              )}

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded transition-colors duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-300 flex items-center disabled:bg-blue-800 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                      Updating...
                    </>
                  ) : (
                    <>Update</>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingsPanel() {
  const [resumeSettings, setResumeSettings] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadSuccess, setUploadSuccess] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [displayName, setDisplayName] = useState('')
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Fetch current resume settings
  useEffect(() => {
    const fetchResumeSettings = async () => {
      try {
        setIsLoading(true)
        const response = await fetch('/api/settings/resume')
        if (!response.ok) {
          throw new Error('Failed to fetch resume settings')
        }
        const data = await response.json()
        setResumeSettings(data)
        setDisplayName(data.displayName || '')
      } catch (err) {
        console.error('Error fetching resume settings:', err)
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumeSettings()
  }, [])

  // Handle file selection
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Reset states
      setUploadSuccess(false)
      setUploadError(null)
    }
  }

  // Handle resume upload
  const handleResumeUpload = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!fileInputRef.current?.files?.length) {
      setUploadError('Please select a file to upload')
      return
    }

    const file = fileInputRef.current.files[0]

    // Validate file type
    if (file.type !== 'application/pdf') {
      setUploadError('Only PDF files are allowed')
      return
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB')
      return
    }

    try {
      setIsUploading(true)
      setUploadError(null)

      const formData = new FormData()
      formData.append('file', file)
      formData.append('displayName', displayName || 'Resume')

      const response = await fetch('/api/settings/resume', {
        method: 'POST',
        body: formData
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to upload resume')
      }

      const data = await response.json()
      setResumeSettings(data)
      setUploadSuccess(true)

      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    } catch (err: any) {
      console.error('Error uploading resume:', err)
      setUploadError(err.message || 'Failed to upload resume')
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Website Settings</h2>

      {/* Resume Upload Section */}
      <div className="bg-gray-800 p-6 rounded-lg mb-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <FileUp className="mr-2" />
          Resume Management
        </h3>

        {isLoading ? (
          <div className="flex justify-center py-6">
            <div className="w-8 h-8 border-4 border-t-blue-500 border-r-transparent border-b-blue-500 border-l-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div>
            {resumeSettings && (
              <div className="mb-4 p-4 bg-gray-700 rounded-lg">
                <h4 className="font-medium text-gray-300 mb-2">Current Resume</h4>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-white">{resumeSettings.displayName}</p>
                    <p className="text-sm text-gray-400">Last updated: {resumeSettings.lastUpdated}</p>
                  </div>
                  <a
                    href={`/resume/${resumeSettings.filename}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 rounded text-sm inline-flex items-center"
                  >
                    <FileText size={14} className="mr-1" />
                    View Current Resume
                  </a>
                </div>
              </div>
            )}

            <form onSubmit={handleResumeUpload}>
              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Display Name</label>
                <input
                  type="text"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="e.g., Pravin Sharma Resume"
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-300 mb-2">Upload New Resume (PDF only)</label>
                <input
                  type="file"
                  ref={fileInputRef}
                  accept="application/pdf"
                  onChange={handleFileChange}
                  className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="mt-1 text-sm text-gray-400">Maximum file size: 5MB</p>
              </div>

              {uploadSuccess && (
                <div className="mb-4 p-3 bg-green-900/50 border border-green-500 rounded-lg flex items-start">
                  <Check size={18} className="text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-green-300">Resume uploaded successfully!</p>
                </div>
              )}

              {uploadError && (
                <div className="mb-4 p-3 bg-red-900/50 border border-red-500 rounded-lg flex items-start">
                  <AlertCircle size={18} className="text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                  <p className="text-red-300">{uploadError}</p>
                </div>
              )}

              <button
                type="submit"
                disabled={isUploading}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-300 flex items-center disabled:bg-blue-800 disabled:cursor-not-allowed"
              >
                {isUploading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2"></div>
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload size={16} className="mr-2" />
                    Upload Resume
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>

      {/* General Settings Section */}
      <div className="bg-gray-800 p-6 rounded-lg">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <Settings className="mr-2" />
          General Settings
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-gray-300 mb-2">Website Title</label>
            <input
              type="text"
              defaultValue="Pravin's Portfolio"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-gray-300 mb-2">Website Description</label>
            <textarea
              defaultValue="A unique and creative portfolio with an advanced futuristic look"
              className="w-full p-3 bg-gray-700 border border-gray-600 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
            />
          </div>
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded transition-colors duration-300 flex items-center">
            <Check size={16} className="mr-2" />
            Save Settings
          </button>
        </div>
      </div>
    </div>
  )
}

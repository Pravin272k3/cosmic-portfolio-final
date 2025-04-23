'use client'

import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'
import Image from 'next/image'
import { Star, Moon, Sun, CompassIcon as Comet, X, Filter, Palette } from 'lucide-react'
import { useState, useEffect } from 'react'
import { Artwork, ArtworkCategory, ARTWORK_CATEGORIES } from '@/types/artwork'


// Interface already imported from types/artwork

// Map categories to icons
const categoryIcons: Record<string, any> = {
  'Charcoal': Moon,
  'Graphite': Star,
  'Painting': Palette,
  'Scribble': Comet,
  'default': Sun
};

// Get icon for artwork based on category
const getIconForArtwork = (category: string) => {
  return categoryIcons[category] || categoryIcons.default;
};

interface ArtworkCardProps {
  artwork: Artwork
  onImageClick: () => void
}

const ArtworkCard = ({ artwork, onImageClick }: ArtworkCardProps) => {
  const Icon = getIconForArtwork(artwork.category);

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      className="bg-white/5 rounded-xl overflow-hidden shadow-lg relative backdrop-blur-sm"
    >
      <div className="absolute top-2 right-2 z-10">
        <Icon className="text-yellow-300" size={24} />
      </div>
      <div
        className="w-full aspect-[4/3] relative cursor-pointer"
        onClick={onImageClick}
      >
        <Image
          src={`/artworks/${artwork.filename}`}
          alt={artwork.title}
          fill
          className="object-cover"
        />
      </div>
      <div className="p-4 bg-gradient-to-r from-purple-600 to-indigo-600">
        <h2 className="text-xl font-semibold text-white">
          {artwork.title}
        </h2>
        <p className="text-xs text-white/70 mt-1">{artwork.category}</p>
      </div>
    </motion.div>
  )
}

interface ImageModalProps {
  artwork: Artwork;
  onClose: () => void;
}

const ImageModal = ({ artwork, onClose }: ImageModalProps) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 overflow-auto"
      onClick={onClose}
    >
      <motion.button
        className="absolute top-4 right-4 text-white hover:text-gray-300 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onClose}
      >
        <X size={32} />
      </motion.button>
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative max-w-full max-h-full p-4"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="relative max-w-full max-h-full flex items-center justify-center">
          <Image
            src={`/artworks/${artwork.filename}`}
            alt={artwork.title}
            width={800}
            height={400}
            className="max-w-full max-h-screen object-contain rounded-lg"
          />
        </div>
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
          <h2 className="text-2xl font-bold text-white lg:text-3xl">
            {artwork.title}
          </h2>
        </div>
      </motion.div>
    </motion.div>
  );
};



export default function Arts() {
  const [artworks, setArtworks] = useState<Artwork[]>([])
  const [filteredArtworks, setFilteredArtworks] = useState<Artwork[]>([])
  const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<ArtworkCategory>('All')
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        setFilteredArtworks(data)
      } catch (err) {
        console.error('Error fetching artworks:', err)
        setError('Failed to load artworks')
      } finally {
        setIsLoading(false)
      }
    }

    fetchArtworks()
  }, [])

  // Filter artworks when category changes
  useEffect(() => {
    if (selectedCategory === 'All') {
      setFilteredArtworks(artworks)
    } else {
      setFilteredArtworks(artworks.filter(artwork => artwork.category === selectedCategory))
    }
  }, [selectedCategory, artworks])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8 md:p-16 lg:p-24 relative overflow-hidden"
    >
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(100)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute bg-white rounded-full"
            style={{
              width: Math.random() * 3 + 1,
              height: Math.random() * 3 + 1,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 5 + 2,
              repeat: Infinity,
              repeatType: 'loop',
            }}
          />
        ))}
      </div>
      <motion.h1
        className="text-4xl sm:text-5xl font-extrabold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-pink-400 via-purple-400 to-indigo-400"
        initial={{ y: -50 }}
        animate={{ y: 0 }}
        transition={{ type: 'spring', stiffness: 100 }}
      >
        My Cosmic Creations
      </motion.h1>

      {/* Category Filter */}
      <motion.div
        className="flex flex-wrap justify-center gap-2 mb-8"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        {ARTWORK_CATEGORIES.map((category) => (
          <button
            key={category}
            onClick={() => setSelectedCategory(category)}
            className={`px-4 py-2 rounded-full transition-all duration-300 ${selectedCategory === category
              ? 'bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-medium shadow-lg'
              : 'bg-white/10 text-white/80 hover:bg-white/20'}`}
          >
            {category}
          </button>
        ))}
      </motion.div>

      {isLoading ? (
        <div className="flex justify-center py-12">
          <div className="w-12 h-12 border-4 border-t-purple-500 border-r-transparent border-b-purple-500 border-l-transparent rounded-full animate-spin"></div>
        </div>
      ) : error ? (
        <div className="bg-red-500/20 border border-red-500 text-white p-4 rounded-lg mb-8 max-w-md mx-auto">
          <p className="text-center">{error}</p>
        </div>
      ) : filteredArtworks.length === 0 ? (
        <div className="text-center py-10 text-gray-400 max-w-md mx-auto">
          <p className="text-xl">No artworks found in this category.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 mb-12 w-full max-w-6xl">
        {filteredArtworks.map((artwork, index) => (
          <motion.div
            key={artwork.id}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <ArtworkCard
              artwork={artwork}
              onImageClick={() => setSelectedArtwork(artwork)}
            />
          </motion.div>
        ))}
      </div>
      )}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.5 }}
      >
        <Link href="/" className="px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-full hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 inline-flex items-center space-x-2">
          <Star className="w-5 h-5" />
          <span>Return to Cosmic Hub</span>
        </Link>
      </motion.div>

      <AnimatePresence>
        {selectedArtwork && (
          <ImageModal
            artwork={selectedArtwork}
            onClose={() => setSelectedArtwork(null)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  )
}


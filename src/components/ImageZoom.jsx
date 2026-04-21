import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ZoomIn } from 'lucide-react'
import { a11yAction } from '../lib/controlHints'

const ImageZoom = ({ src, alt }) => {
  const [isZoomed, setIsZoomed] = useState(false)
  const enlargeLabel = alt ? `Enlarge image: ${alt}` : 'Enlarge image'

  return (
    <>
      <button
        type="button"
        className="relative cursor-zoom-in group w-full border-0 bg-transparent p-0 rounded-xl text-left"
        onClick={() => setIsZoomed(true)}
        {...a11yAction(enlargeLabel)}
      >
        <img
          src={src}
          alt={alt}
          className="w-full h-full object-cover rounded-xl"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors rounded-xl flex items-center justify-center pointer-events-none">
          <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-white/90 p-3 rounded-full">
            <ZoomIn size={24} className="text-gray-900" aria-hidden />
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isZoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setIsZoomed(false)}
          >
            <button
              type="button"
              className="absolute top-4 right-4 bg-white text-gray-900 p-3 rounded-full hover:bg-gray-100 transition-colors"
              onClick={() => setIsZoomed(false)}
              {...a11yAction('Close enlarged image')}
            >
              <X size={24} aria-hidden />
            </button>
            <motion.img
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              src={src}
              alt={alt}
              className="max-w-full max-h-full object-contain"
              onClick={(e) => e.stopPropagation()}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default ImageZoom

'use client'

import { useState, CSSProperties } from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { sectionVariant } from './animasi'

interface GallerySectionProps {
  gallery: { items: string[] }
  theme: {
    textColor: string
    bgColor: string
    accentColor: string
    background: string
  }
}

export default function GallerySection({
  gallery,
  theme,
}: GallerySectionProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [currentIdx, setCurrentIdx] = useState(0)
  const [zoom, setZoom] = useState(1)

  const openModal = (idx: number) => {
    setCurrentIdx(idx)
    setZoom(1)
    setIsOpen(true)
  }
  const closeModal = () => setIsOpen(false)
  const prev = () =>
    setCurrentIdx((i) => (i === 0 ? gallery.items.length - 1 : i - 1))
  const next = () =>
    setCurrentIdx((i) => (i === gallery.items.length - 1 ? 0 : i + 1))
  const onWheel = (e: React.WheelEvent) => {
    e.preventDefault()
    setZoom((z) => Math.min(Math.max(z + e.deltaY * -0.001, 1), 5))
  }

  const titleStyle: CSSProperties = {
    color: theme.textColor,
    textShadow: `2px 2px 4px ${theme.accentColor}88`,
  }

  const cardStyle: CSSProperties = {
    backgroundColor: theme.bgColor,
    border: `2px solid ${theme.accentColor}`,
    boxShadow: `0 4px 8px ${theme.accentColor}44`,
  }

  return (
    <section
      id="gallery"
      className="home-section text-center"
      style={{
        backgroundImage: `url(${theme.background})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        padding: '1rem 1.5rem',
      }}
    >
      <div className="home-inner max-w-4xl mx-auto">
        {/* Judul dengan animasi */}
        <motion.h2
          className="text-4xl font-serif mb-8"
          style={titleStyle}
          variants={sectionVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
        >
          <span className="font-light">Moment</span>{' '}
          <span className="font-bold italic" style={{ color: theme.accentColor }}>
            Gallery
          </span>
        </motion.h2>

        {/* Grid 2 kolom, hide blank/empty items */}
        <div className="grid grid-cols-2 gap-2">
          {gallery.items
            .map((src, idx) => ({ src, idx }))
            .filter(item => item.src && item.src.trim() !== '')
            .map(({ src, idx }) => (
              <motion.button
                key={idx}
                onClick={() => openModal(idx)}
                className="overflow-hidden rounded-lg"
                style={cardStyle}
                variants={sectionVariant}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                custom={idx}
              >
                <div className="relative w-full aspect-[4/5]">
                  <Image
                    src={src}
                    alt={`Moment ${idx + 1}`}
                    fill
                    className="object-cover"
                  />
                </div>
              </motion.button>
            ))}
        </div>
      </div>

      {/* Modal Preview */}
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={closeModal}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <button
            className="absolute top-4 right-4 text-white text-2xl"
            onClick={(e) => {
              e.stopPropagation()
              closeModal()
            }}
          >
            &times;
          </button>

          <button
            className="absolute left-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation()
              prev()
            }}
          >
            ‹
          </button>

          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: '#fff',
              maxWidth: '80vw',
              maxHeight: '80vh',
              overflow: 'auto',
              boxShadow: `0 6px 12px ${theme.accentColor}44`,
            }}
            onWheel={onWheel}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={gallery.items[currentIdx]}
              alt={`Moment ${currentIdx + 1}`}
              style={{
                display: 'block',
                maxWidth: '100%',
                maxHeight: '100%',
                transform: `scale(${zoom})`,
                transition: 'transform 0.1s',
                objectFit: 'contain',
              }}
            />
          </div>

          <button
            className="absolute right-4 text-white text-3xl"
            onClick={(e) => {
              e.stopPropagation()
              next()
            }}
          >
            ›
          </button>
        </motion.div>
      )}
    </section>
  )
}

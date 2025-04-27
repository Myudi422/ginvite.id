"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import CountdownTimer from "@/components/countdown-timer"
import MusicPlayer from "@/components/MusicPlayer"

export default function InvitationPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [data, setData] = useState<any>(null)
  const [activeSection, setActiveSection] = useState("home")

  useEffect(() => {
    fetch('/result.json')
      .then(res => res.json())
      .then(setData)
      .catch(console.error)
  }, [])

  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden"
    return () => { document.body.style.overflow = "auto" }
  }, [isOpen])

  if (!data) return <div className="flex items-center justify-center h-screen">Loading...</div>

  const { theme, content, decorations } = data
const {
  defaultBgImage,
  defaultBgImage1,
  opening,
  quotes,
  invitation,
  children,
  parents,
  event,
  gallery,
  closing
} = content

const { title, toLabel, to } = opening


  const eventDate = new Date(event.iso)

  return (
    <main className="relative min-h-screen text-center overflow-hidden" style={{ color: theme.textColor }}>
      {isOpen && <MusicPlayer autoPlay />}

      {/* Cover Opening */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center p-6 z-40"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              backgroundImage: `url(${defaultBgImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            {/* Leaf Decorations (larger, extending beyond viewport, continuous in/out movement) */}
            <motion.img src={decorations.topLeft}
              alt="Leaf Top Left"
              className="absolute top-0 left-0 w-48 h-48 -translate-x-1/2 -translate-y-1/2"
              animate={{ x: [-30, 0, -30], y: [-30, 0, -30] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.img src={decorations.topRight}
              alt="Leaf Top Right"
              className="absolute top-0 right-0 w-48 h-48 translate-x-1/2 -translate-y-1/2"
              animate={{ x: [30, 0, 30], y: [-30, 0, -30] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.img src={decorations.bottomLeft}
              alt="Leaf Bottom Left"
              className="absolute bottom-0 left-0 w-48 h-48 -translate-x-1/2 translate-y-1/2"
              animate={{ x: [-30, 0, -30], y: [30, 0, 30] }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.img src={decorations.bottomRight}
              alt="Leaf Bottom Right"
              className="absolute bottom-0 right-0 w-48 h-48 translate-x-1/2 translate-y-1/2"
              animate={{ x: [30, 0, 30], y: [30, 0, 30] }}
              transition={{ duration: 4, repeat: Infinity }}
            />

            <motion.div className="text-center space-y-6"
              initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}
            >
              <div className="w-32 h-32 mx-auto bg-white rounded-full overflow-hidden">
                <Image src={gallery.items[0]} alt="Profile" width={128} height={128} className="object-cover" />
              </div>
              <h1 className="text-2xl font-bold">{opening.title}</h1>
              {/* Nickname anak dengan ukuran besar dan menonjol */}
        <div className="mt-2 space-y-1">
          {children.map((c, i) => (
            <h2 key={i} className="text-2xl md:text-4xl font-extrabold text-blue-600">
              {c.nickname}
            </h2>
          ))}
        </div>
              <p className="text-sm">Tanpa Mengurangi Rasa Hormat, Kami Mengundang</p>
              <div className="my-8 py-4 border-t border-b border-white/30">
                <h2 className="text-lg mb-2">{opening.toLabel}</h2>
                <p className="text-xl font-semibold">{opening.to}</p>
              </div>
              <Button onClick={() => setIsOpen(true)}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-lg"
              >Buka Undangan</Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content */}
      {isOpen && (
        <div className="container max-w-md mx-auto pb-24">
          {/* Section Home */}
          <section id="home" className="py-12 px-6 space-y-8"
            style={{
              backgroundImage: `url(${defaultBgImage1})`,
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 mx-auto bg-white rounded-full overflow-hidden">
                <Image src={gallery.items[0]} alt="Profile" width={96} height={96} className="object-cover" />
              </div>
              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">{quotes.arabic}</h2>
                <p className="text-sm text-gray-600">{quotes.latin}</p>
              </div>
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Peristiwa Penting</h2>
                <p className="text-sm leading-relaxed">{quotes.importantEvent}</p>
              </div>
              <div className="w-16 h-1 mx-auto" style={{ backgroundColor: theme.accentColor }} />

              <div className="space-y-4 text-sm leading-relaxed"
                dangerouslySetInnerHTML={{ __html: invitation }}
              />

              <div className="py-6 px-6 border-2 rounded-lg bg-white/50">
                {children.map((c: any, i: number) => (
                  <div key={i} className="mb-6">
                    <h3 className="text-2xl font-bold" style={{ color: theme.accentColor }}>{c.name}</h3>
                    <p className="text-sm">({c.nickname})</p>
                    <p className="text-sm">{c.order}</p>
                  </div>
                ))}
              </div>

              <p className="text-sm">
                Putra dari Pasangan<br />
                <span className="text-lg font-semibold">{parents.father} & {parents.mother}</span>
              </p>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-6">Menuju Hari Bahagia</h3>
                <CountdownTimer targetDate={eventDate} />
              </div>
            </motion.div>
          </section>


          {/* Section Event */}
          <section id="event" className="py-12 px-6 text-center space-y-10"
            style={{
              backgroundImage: `url(${defaultBgImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            <h2 className="text-2xl font-bold">{event.title}</h2>
            <div className="flex flex-col items-center space-y-6">
              <div className="w-full p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3">Waktu & Tanggal</h3>
                <p className="text-xl font-bold mb-2">{event.date}</p>
                <p className="text-md">{event.time} {event.note}</p>
              </div>
              <div className="w-full p-6 bg-white rounded-xl shadow-md">
                <h3 className="text-lg font-semibold mb-3">Lokasi</h3>
                <p className="text-md mb-4">{event.location}</p>
                <Link href={event.mapsLink} target="_blank" rel="noopener noreferrer">
                  <Button className="w-full bg-blue-500 hover:bg-blue-600">
                    <MapPin className="mr-2 h-4 w-4" /> Buka Maps
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          {/* Section Gallery */}
          <section id="gallery" className="py-12 px-6 text-center"
            style={{
              backgroundImage: `url(${defaultBgImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            <h2 className="text-2xl font-bold mb-6">Galeri</h2>
            {gallery.items.map((img: string, idx: number) => (
              <div key={idx} className="bg-white p-4 rounded-xl shadow-md overflow-hidden mb-6">
                <div className="relative aspect-square">
                  <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover rounded-lg" />
                </div>
              </div>
            ))}
          </section>

          {/* Section Penutup */}
          <section id="penutup" className="py-12 px-6 text-center"
            style={{
              backgroundImage: `url(${defaultBgImage})`,
              backgroundSize: 'cover', backgroundPosition: 'center'
            }}
          >
            <h2 className="text-2xl font-bold mb-6">{closing.title}</h2>
            <p className="text-sm leading-relaxed" dangerouslySetInnerHTML={{ __html: closing.text }} />
          </section>

          {/* Footer */}
<footer className="text-center py-8 text-sm" style={{ color: theme.textColor }}>
  <p>© ginvite.id – By PT DIGITAL INTER NUSA</p>
</footer>

        </div>
      )}

      {isOpen && <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />}
    </main>
  )
}

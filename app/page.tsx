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
  const [activeSection, setActiveSection] = useState("home")
  const eventDate = new Date("2025-05-11T09:00:00+07:00")

  const handleOpenInvitation = () => {
    setIsOpen(true)
  }

  useEffect(() => {
    document.body.style.overflow = isOpen ? "auto" : "hidden"
    return () => { document.body.style.overflow = "auto" }
  }, [isOpen])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900 overflow-hidden">
      <MusicPlayer />
      {/* Cover/Opening Section */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            className="fixed inset-0 flex flex-col items-center justify-center bg-gradient-to-b from-blue-400 to-blue-600 z-40 p-6 text-white"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <motion.div
              className="text-center space-y-6"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="w-32 h-32 mx-auto bg-white rounded-full flex items-center justify-center mb-6 overflow-hidden">
                <Image
                  src="https://ccgnimex.s3.us-east-005.backblazeb2.com/undangan/WhatsApp+Image+2025-04-27+at+10.29.35.jpeg"
                  alt="Profile"
                  width={128}
                  height={128}
                  className="w-full h-full object-cover"
                />
              </div>

              <h1 className="text-2xl font-bold">Tasyakur Khitanan & Aqiqah</h1>
              <p className="text-sm max-w-md mx-auto leading-relaxed">
                Tanpa Mengurangi Rasa Hormat, Kami Mengundang Bapak/Ibu/Saudara/i untuk Hadir di Acara Kami.
              </p>

              <div className="my-8 py-4 border-t border-b border-white/30">
                <h2 className="text-lg mb-2">Kepada</h2>
                <p className="text-xl font-semibold">Bapak/Ibu/Saudara/i</p>
              </div>

              <Button
                onClick={handleOpenInvitation}
                className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-6 rounded-full text-lg font-medium transition-all transform hover:scale-105 shadow-lg"
              >
                Buka Undangan
              </Button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Content (visible after opening) */}
      {isOpen && (
        <div className="container max-w-md mx-auto pb-24">
          {/* Section 1 - Home */}
          <section id="home" className="py-12 px-6 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center overflow-hidden">
                <Image
                  src="https://ccgnimex.s3.us-east-005.backblazeb2.com/undangan/WhatsApp+Image+2025-04-27+at+10.29.35.jpeg"
                  alt="Profile"
                  width={96}
                  height={96}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="text-center">
                <h2 className="text-xl font-semibold mb-2">بِسْمِ اللهِ الرَّحْمَنِ الرَّحِيْمِ</h2>
                <p className="text-sm text-gray-600">Bismillahirrahmanirrahim</p>
              </div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Peristiwa Penting</h2>
                <p className="text-sm leading-relaxed">
                  "Peristiwa penting dalam perjalanan hidup lelaki muslim adalah menjelang akil baligh, saat manis dalam
                  kenangan sejarah panjang seorang muslim adalah untuk pertama dan cuma sekali ketika ia dikhitan, Ya
                  Allah perkenankan kami mengkhitankan putra kami"
                </p>
              </div>

              <div className="w-16 h-1 bg-blue-300 mx-auto"></div>

              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Dengan memohon Rahmat dan Ridho Allah SWT</h2>
                <p className="text-sm">
                  Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri Tasyakur Khitanan & Aqiqah putra kami
                </p>
              </div>

              <div className="py-6 px-6 border-2 border-blue-200 rounded-lg bg-white/50">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-blue-600">RAFA MIFTAHUL FADLI</h3>
                  <p className="text-sm">(Rafa)</p>
                  <p className="text-sm mt-1">Putra Pertama</p>
                </div>

                <div className="w-16 h-1 bg-blue-200 mx-auto my-4"></div>

                <div>
                  <h3 className="text-2xl font-bold text-blue-600">MUHAMMAD FAIZAN ATHALLA</h3>
                  <p className="text-sm">(FAIZAN)</p>
                  <p className="text-sm mt-1">Putra Kedua</p>
                </div>
              </div>

              <p className="text-sm font-medium">
                Putra dari Pasangan
                <br />
                <span className="text-lg font-semibold text-blue-700">SUPARJO & IIS SISKA</span>
              </p>

              <div className="mt-8">
                <h3 className="text-lg font-semibold mb-6">Menuju Hari Bahagia</h3>
                <CountdownTimer targetDate={eventDate} />
              </div>
            </motion.div>
          </section>

          {/* Section 2 - Event Details */}
          <section id="event" className="py-12 px-6 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-10 w-full"
            >
              <h2 className="text-2xl font-bold">Acara Khitanan & Aqiqah</h2>

              <div className="flex flex-col items-center space-y-6">
                <div className="w-full p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-3">Waktu & Tanggal</h3>
                  <p className="text-xl font-bold text-blue-600 mb-2">Minggu, 11 Mei 2025</p>
                  <p className="text-md">Pukul 09:00 WIB Sampai Selesai</p>
                </div>

                <div className="w-full p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-3">Lokasi</h3>
                  <p className="text-md mb-4">
                    Kp Cinangka kaum, rt03 RW 01, desa Cinangka, kecamatan ciampea, kab, bogor
                  </p>

                  <Link href="https://maps.app.goo.gl/jV5jSdJgCjc1r2gH7" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <MapPin className="mr-2 h-4 w-4" /> Buka Maps
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="w-full h-64 bg-blue-50 rounded-lg overflow-hidden shadow-md">
                <Link
                  href="https://maps.app.goo.gl/jV5jSdJgCjc1r2gH7"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center h-full p-4"
                >
                  <MapPin className="h-12 w-12 text-blue-500 mb-3" />
                  <p className="text-sm text-center text-blue-700">Klik untuk membuka lokasi di Google Maps</p>
                </Link>
              </div>
            </motion.div>
          </section>

          {/* Section 3 - Gallery (Simplified) */}
          <section id="gallery" className="py-12 px-6 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8 w-full"
            >
              <h2 className="text-2xl font-bold">Galeri</h2>

              <div className="bg-white p-4 rounded-xl shadow-md overflow-hidden">
                <div className="relative aspect-square">
                  <Image src="https://ccgnimex.s3.us-east-005.backblazeb2.com/undangan/WhatsApp+Image+2025-04-27+at+10.29.35.jpeg" alt="Gallery image" fill className="object-cover rounded-lg" />
                </div>
              </div>
            </motion.div>
          </section>

         {/* Section 4 - Penutup */}
<section id="penutup" className="py-12 px-6 text-center">
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ delay: 0.3 }}
    className="space-y-8 w-full"
  >
    <h2 className="text-2xl font-bold">Penutup</h2>

    <p className="text-sm leading-relaxed">
      Merupakan kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i
      berkenan hadir untuk memberikan doa restu kepada putra-putra kami.
      <br /><br />
      Atas kehadiran dan doa restunya, kami mengucapkan terima kasih yang sebesar-besarnya.
      Semoga Allah SWT membalas segala kebaikan Bapak/Ibu/Saudara/i sekalian dengan limpahan rahmat dan karunia-Nya.
    </p>
  </motion.div>
</section>


          {/* Footer */}
          <footer className="text-center py-8 text-sm text-blue-700">
            <p>Terima kasih atas doa dan kehadiran Anda</p>
            <p className="mt-2">© 2025 Keluarga Besar SUPARJO & IIS SISKA</p>
          </footer>
        </div>
      )}

      {/* Navigation */}
      {isOpen && <Navigation activeSection={activeSection} setActiveSection={setActiveSection} />}
    </main>
  )
}

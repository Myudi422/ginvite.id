"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, Music, MicOffIcon as MusicOff, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import MusicPlayer from "@/components/music-player"
import Navigation from "@/components/navigation"
import CountdownTimer from "@/components/countdown-timer"

export default function InvitationPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")
  const [isMusicPlaying, setIsMusicPlaying] = useState(false)

  // Event date - May 11, 2025 at 09:00 WIB
  const eventDate = new Date("2025-05-11T09:00:00+07:00")

  const handleOpenInvitation = () => {
    setIsOpen(true)
    setIsMusicPlaying(true) // Start playing music when invitation is opened
  }

  useEffect(() => {
    // Disable scrolling on body when modal is open
    if (isOpen) {
      document.body.style.overflow = "auto"
    } else {
      document.body.style.overflow = "hidden"
    }

    return () => {
      document.body.style.overflow = "auto"
    }
  }, [isOpen])

  return (
    <main className="relative min-h-screen bg-gradient-to-b from-blue-50 to-blue-100 text-blue-900 overflow-hidden">
      {/* Music Control */}
      <button
        onClick={() => setIsMusicPlaying(!isMusicPlaying)}
        className="fixed top-4 right-4 z-50 bg-white/80 p-2 rounded-full shadow-md"
      >
        {isMusicPlaying ? <MusicOff size={20} /> : <Music size={20} />}
      </button>

      <MusicPlayer isPlaying={isMusicPlaying} />

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
                  src="/profile-image.jpg"
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
                <p className="text-xl font-semibold">Bapak Budi</p>
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
          {/* Section 1 */}
          <section
            id="home"
            className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${activeSection === "home" ? "block" : "block"}`}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="space-y-6"
            >
              <div className="w-24 h-24 mx-auto bg-blue-100 rounded-full flex items-center justify-center mb-4 overflow-hidden">
                <Image
                  src="/profile-image.jpg"
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

              <h2 className="text-xl font-semibold">Peristiwa Penting</h2>

              <p className="text-sm leading-relaxed">
                "Peristiwa penting dalam perjalanan hidup lelaki muslim adalah menjelang akil baligh, saat manis dalam
                kenangan sejarah panjang seorang muslim adalah untuk pertama dan cuma sekali ketika ia dikhitan, Ya
                Allah perkenankan kami mengkhitankan putra kami"
              </p>

              <div className="w-16 h-1 bg-blue-300 mx-auto my-6"></div>

              <h2 className="text-xl font-semibold">Dengan memohon Rahmat dan Ridho Allah SWT</h2>
              <p className="text-sm">
                Kami mengundang Bapak/Ibu/Saudara/i untuk menghadiri Tasyakur Khitanan & Aqiqah putra kami
              </p>

              <div className="my-6 py-4 px-6 border-2 border-blue-200 rounded-lg bg-white/50">
                <div className="mb-4">
                  <h3 className="text-2xl font-bold text-blue-600">RAFA MIFTAHUL FADLI</h3>
                  <p className="text-sm">(Rafa)</p>
                  <p className="text-sm mt-1">Putra Pertama</p>
                </div>

                <div className="w-16 h-1 bg-blue-200 mx-auto my-3"></div>

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
                <h3 className="text-lg font-semibold mb-4">Menuju Hari Bahagia</h3>
                <CountdownTimer targetDate={eventDate} />
              </div>
            </motion.div>
          </section>

          {/* Section 2 - Event Details */}
          <section
            id="event"
            className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${activeSection === "event" ? "block" : "block"}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8"
            >
              <h2 className="text-2xl font-bold">Acara Khitanan & Aqiqah</h2>

              <div className="flex flex-col items-center space-y-4">
                <div className="w-full p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Waktu & Tanggal</h3>
                  <p className="text-xl font-bold text-blue-600 mb-1">Minggu, 11 Mei 2025</p>
                  <p className="text-md">Pukul 09:00 WIB Sampai Selesai</p>
                </div>

                <div className="w-full p-6 bg-white rounded-xl shadow-md">
                  <h3 className="text-lg font-semibold mb-2">Lokasi</h3>
                  <p className="text-md mb-3">
                    Kp Cinangka kaum, rt03 RW 01, desa Cinangka, kecamatan ciampea, kab, bogor
                  </p>

                  <Link href="https://maps.app.goo.gl/jV5jSdJgCjc1r2gH7" target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-blue-500 hover:bg-blue-600">
                      <MapPin className="mr-2 h-4 w-4" /> Buka Maps
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="w-full h-64 bg-gray-200 rounded-lg overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3964.1!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x2e69c5b2b8c3d8a7%3A0x5f1a4c1b5b5b5b5b!2sCinangka%2C%20Ciampea%2C%20Bogor%20Regency%2C%20West%20Java!5e0!3m2!1sen!2sid!4v1650000000000!5m2!1sen!2sid"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                ></iframe>
              </div>
            </motion.div>
          </section>

          {/* Section 3 - Gallery */}
          <section
            id="gallery"
            className={`min-h-screen flex flex-col items-center justify-center p-6 ${activeSection === "gallery" ? "block" : "block"}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 w-full"
            >
              <h2 className="text-2xl font-bold text-center mb-6">Galeri</h2>

              <div className="grid grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((item) => (
                  <div key={item} className="aspect-square bg-white rounded-lg shadow-md overflow-hidden">
                    <Image
                      src="/profile-image.jpg"
                      alt={`Gallery image ${item}`}
                      width={300}
                      height={300}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </motion.div>
          </section>

          {/* Section 4 - Bank Account */}
          <section
            id="gift"
            className={`min-h-screen flex flex-col items-center justify-center p-6 text-center ${activeSection === "gift" ? "block" : "block"}`}
          >
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-6 w-full"
            >
              <h2 className="text-2xl font-bold mb-6">Rekening</h2>

              <p className="text-sm mb-6">
                Doa restu Anda merupakan karunia yang sangat berarti bagi kami. Namun, jika memberi adalah ungkapan
                tanda kasih Anda, Anda dapat memberi kado melalui:
              </p>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex items-center justify-between mb-4">
                  <div className="w-16 h-8 bg-blue-100 rounded flex items-center justify-center">
                    <span className="font-bold text-blue-600">BCA</span>
                  </div>
                  <CreditCard className="text-blue-500" />
                </div>

                <p className="text-lg font-semibold">1234567890</p>
                <p className="text-sm text-gray-600">a.n. SUPARJO</p>

                <Button
                  className="w-full mt-4 bg-blue-500 hover:bg-blue-600"
                  onClick={() => {
                    navigator.clipboard.writeText("1234567890")
                    alert("Nomor rekening disalin!")
                  }}
                >
                  Salin Nomor Rekening
                </Button>
              </div>
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

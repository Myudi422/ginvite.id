"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { MapPin, CreditCard } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import Navigation from "@/components/navigation"
import CountdownTimer from "@/components/countdown-timer"

export default function InvitationPage() {
  const [isOpen, setIsOpen] = useState(false)
  const [activeSection, setActiveSection] = useState("home")

  // Event date - May 11, 2025 at 09:00 WIB
  const eventDate = new Date("2025-05-11T09:00:00+07:00")

  const handleOpenInvitation = () => {
    setIsOpen(true)
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
                  src="/profile-image.jpeg"
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
                  src="/profile-image.jpeg"
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
                  <Image src="/profile-image.jpeg" alt="Gallery image" fill className="object-cover rounded-lg" />
                </div>
              </div>
            </motion.div>
          </section>

          {/* Section 4 - WhatsApp Contact */}
          <section id="gift" className="py-12 px-6 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="space-y-8 w-full"
            >
              <h2 className="text-2xl font-bold">Kirim Ucapan Selamat</h2>

              <p className="text-sm leading-relaxed">
                Bapak/Ibu/Saudara sekalian dapat mengirimkan ucapan selamat dan doa melalui tombol WhatsApp di bawah ini.
                Atas kehadiran dan doa restunya, kami mengucapkan terima kasih yang sebesar-besarnya. Semoga kebaikan
                Bapak/Ibu/Saudara dibalas berlipat ganda oleh Allah SWT.
              </p>

              <div className="bg-white p-6 rounded-xl shadow-md">
                <div className="flex flex-col items-center space-y-4">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    className="text-green-500"
                  >
                    <path
                      fill="currentColor"
                      d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07c0 1.22.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z"
                    />
                  </svg>

                  <p className="text-lg font-semibold text-green-600">Kirim Ucapan via WhatsApp</p>
                  <p className="text-sm text-gray-600">Klik tombol di bawah untuk mengirim pesan</p>

                  <Link
                    href="https://wa.me/6281381192257" // Ganti dengan nomor WhatsApp yang valid
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full"
                  >
                    <Button className="w-full bg-green-500 hover:bg-green-600 gap-2">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="20"
                        height="20"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                      >
                        <path d="M19.05 4.91A9.816 9.816 0 0 0 12.04 2c-5.46 0-9.91 4.45-9.91 9.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21c5.46 0 9.91-4.45 9.91-9.91c0-2.65-1.03-5.14-2.9-7.01zm-7.01 15.24c-1.48 0-2.93-.4-4.2-1.15l-.3-.18l-3.12.82l.83-3.04l-.2-.31a8.264 8.264 0 0 1-1.26-4.38c0-4.54 3.7-8.24 8.24-8.24c2.2 0 4.27.86 5.82 2.42a8.183 8.183 0 0 1 2.41 5.83c.02 4.54-3.68 8.23-8.22 8.23zm4.52-6.16c-.25-.12-1.47-.72-1.69-.81c-.23-.08-.39-.12-.56.12c-.17.25-.64.81-.78.97c-.14.17-.29.19-.54.06c-.25-.12-1.05-.39-1.99-1.23c-.74-.66-1.23-1.47-1.38-1.72c-.14-.25-.02-.38.11-.51c.11-.11.25-.29.37-.43s.17-.25.25-.41c.08-.17.04-.31-.02-.43s-.56-1.34-.76-1.84c-.2-.48-.41-.42-.56-.43h-.48c-.17 0-.43.06-.66.31c-.22.25-.86.85-.86 2.07c0 1.22.89 2.4 1.01 2.56c.12.17 1.75 2.67 4.23 3.74c.59.26 1.05.41 1.41.52c.59.19 1.13.16 1.56.1c.48-.07 1.47-.6 1.67-1.18c.21-.58.21-1.07.14-1.18s-.22-.16-.47-.28z" />
                      </svg>
                      Hubungi via WhatsApp
                    </Button>
                  </Link>
                </div>
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

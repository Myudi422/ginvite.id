'use client';

import { motion } from 'framer-motion';
import { UserCheck, MessageSquare, Send, CheckCircle, MessageCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { submitRsvp, getRsvpList } from '@/app/actions/rsvp';

interface RsvpData {
  nama?: string;
  name?: string;
  ucapan?: string;
  message?: string;
  konfirmasi?: string;
  attendance?: string;
  created_at?: string;
  timestamp?: string;
}

interface RsmpSectionProps {
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor?: string;
    mutedText?: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
  contentUserId: string | number;
  id?: string;
  plugin?: any;
  status?: string;
}

const timeAgo = (dateString?: string) => {
  if (!dateString) return 'baru saja';
  
  try {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const weeks = Math.floor(days / 7);
    const months = Math.floor(days / 30);

    if (months > 0) return `${months} bulan yang lalu`;
    if (weeks > 0) return `${weeks} minggu yang lalu`;
    if (days > 0) return `${days} hari yang lalu`;
    if (hours > 0) return `${hours} jam yang lalu`;
    if (minutes > 0) return `${minutes} menit yang lalu`;
    return 'baru saja';
  } catch {
    return 'baru saja';
  }
};

export default function RsmpSection({
  theme,
  specialFontFamily,
  bodyFontFamily,
  contentUserId,
  id,
  plugin,
  status,
}: RsmpSectionProps) {
  
  const [name, setName] = useState('');
  const [wa, setWa] = useState('');
  const [attendance, setAttendance] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [rsvpList, setRsvpList] = useState<RsvpData[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [showComments, setShowComments] = useState(false);
  const [visibleComments, setVisibleComments] = useState(5);

  // Load RSVP list on component mount
  useEffect(() => {
    const loadRsvpList = async () => {
      setLoadingList(true);
      try {
        const data = await getRsvpList(contentUserId as number);
        setRsvpList(Array.isArray(data) ? data : []);
      } catch (err) {
        console.error('Failed to load RSVP list:', err);
        setRsvpList([]);
      } finally {
        setLoadingList(false);
      }
    };

    if (plugin?.rsvp && contentUserId) {
      loadRsvpList();
    }
  }, [contentUserId, plugin?.rsvp]);

  // Don't render if RSVP is not enabled
  if (!plugin?.rsvp) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !wa.trim() || !attendance || !message.trim()) {
      setError('Mohon lengkapi semua field');
      return;
    }

    if (wa.trim().length < 10) {
      setError('Nomor WhatsApp tidak valid (minimal 10 digit)');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Use server action to submit RSVP
      await submitRsvp(
        contentUserId as number,
        name.trim(),
        wa.trim(),
        message.trim(),
        attendance,
        `/undang/${contentUserId}`
      );

      // Reload RSVP list after successful submission
      try {
        const updated = await getRsvpList(contentUserId as number);
        setRsvpList(Array.isArray(updated) ? updated : []);
      } catch (err) {
        console.error('Could not reload RSVP list');
      }

      setIsSubmitted(true);
      setName('');
      setWa('');
      setAttendance('');
      setMessage('');
      setShowComments(true);
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
      
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section 
      id={id || "rsvp"}
      className="py-12 sm:py-16 md:py-20 lg:py-24 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center mb-12 sm:mb-16 lg:mb-20"
        >
          <div className="inline-block mb-6 sm:mb-8">
            <span 
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase border-2"
              style={{ 
                backgroundColor: theme.accentColor + '15', 
                color: theme.accentColor,
                borderColor: theme.accentColor + '60'
              }}
            >
              RSVP & Ucapan
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
            style={{ 
              color: theme.textColor,
              fontFamily: specialFontFamily || 'serif'
            }}
          >
            Konfirmasi Kehadiran
          </h2>
          
          <p 
            className="text-sm sm:text-base md:text-lg opacity-85 max-w-2xl mx-auto"
            style={{ 
              color: theme.mutedText || '#b3b3b3',
              fontFamily: bodyFontFamily || 'sans-serif'
            }}
          >
            Mohon konfirmasi kehadiran Anda dan berikan ucapan terbaik untuk kami
          </p>
        </motion.div>

        {/* RSVP Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto mb-12 sm:mb-16"
        >
          <div 
            className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md border-2 shadow-2xl"
            style={{ 
              backgroundColor: theme.cardColor ? theme.cardColor + 'CC' : theme.accentColor + '10',
              borderColor: theme.accentColor + '40',
              boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
            }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-3"
                    style={{ color: theme.textColor }}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 focus:outline-none transition-all duration-200"
                    style={{ 
                      backgroundColor: theme.accentColor + '08',
                      borderColor: theme.accentColor + '40',
                      color: theme.textColor
                    }}
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>

                {/* WhatsApp Input */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-3"
                    style={{ color: theme.textColor }}
                  >
                    Nomor WhatsApp
                  </label>
                  <input
                    type="tel"
                    value={wa}
                    onChange={(e) => setWa(e.target.value)}
                    onKeyPress={(e) => {
                      const charCode = e.which ? e.which : e.keyCode;
                      if (charCode > 31 && (charCode < 48 || charCode > 57)) e.preventDefault();
                    }}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 focus:outline-none transition-all duration-200"
                    style={{ 
                      backgroundColor: theme.accentColor + '08',
                      borderColor: theme.accentColor + '40',
                      color: theme.textColor
                    }}
                    placeholder="08xxxxxxxxxx"
                    required
                  />
                </div>

                {/* Attendance Radio */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-4"
                    style={{ color: theme.textColor }}
                  >
                    Konfirmasi Kehadiran
                  </label>
                  <div className="grid grid-cols-2 gap-4">
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="hadir"
                        checked={attendance === 'hadir'}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="sr-only"
                      />
                      <div 
                        className={`p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-center font-semibold ${
                          attendance === 'hadir' ? 'scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                          borderColor: attendance === 'hadir' ? theme.accentColor : theme.accentColor + '30',
                          backgroundColor: attendance === 'hadir' ? theme.accentColor + '20' : theme.accentColor + '08',
                          color: theme.textColor
                        }}
                      >
                        <UserCheck className="w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-2" style={{ color: theme.accentColor }} />
                        <span className="text-sm sm:text-base">Hadir</span>
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="tidak hadir"
                        checked={attendance === 'tidak hadir'}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="sr-only"
                      />
                      <div 
                        className={`p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-200 text-center font-semibold ${
                          attendance === 'tidak hadir' ? 'scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                          borderColor: attendance === 'tidak hadir' ? theme.accentColor : theme.accentColor + '30',
                          backgroundColor: attendance === 'tidak hadir' ? theme.accentColor + '20' : theme.accentColor + '08',
                          color: theme.textColor
                        }}
                      >
                        <MessageSquare className="w-6 h-6 sm:w-7 sm:h-7 mx-auto mb-2" style={{ color: theme.accentColor }} />
                        <span className="text-sm sm:text-base">Tidak Hadir</span>
                      </div>
                    </label>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-3"
                    style={{ color: theme.textColor }}
                  >
                    Ucapan & Doa
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 focus:outline-none transition-all duration-200 resize-none"
                    style={{ 
                      backgroundColor: theme.accentColor + '08',
                      borderColor: theme.accentColor + '40',
                      color: theme.textColor
                    }}
                    placeholder="Berikan ucapan dan doa terbaik untuk kami..."
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="p-4 rounded-lg" style={{ backgroundColor: '#ff4444' + '20', color: '#ff4444' }}>
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: 'white'
                  }}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Konfirmasi
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* Success Message */
              <div className="text-center py-8 sm:py-12">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: theme.accentColor + '20' }}
                >
                  <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: theme.accentColor }} />
                </motion.div>
                <h3 
                  className="text-2xl sm:text-3xl font-bold mb-4"
                  style={{ color: theme.textColor }}
                >
                  Terima Kasih!
                </h3>
                <p 
                  className="text-base sm:text-lg opacity-85"
                  style={{ color: theme.mutedText || '#b3b3b3' }}
                >
                  Konfirmasi kehadiran Anda telah berhasil dikirim.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Comments Section */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <button
            onClick={() => setShowComments(!showComments)}
            className="w-full py-3 sm:py-4 px-6 sm:px-8 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3 border-2"
            style={{
              borderColor: theme.accentColor + '40',
              backgroundColor: theme.accentColor + '08',
              color: theme.textColor
            }}
          >
            <MessageCircle className="w-5 h-5" style={{ color: theme.accentColor }} />
            {showComments ? 'Sembunyikan Ucapan' : `Tampilkan Ucapan (${rsvpList.length})`}
          </button>

          {showComments && (
            <div 
              className="mt-6 sm:mt-8 rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md border-2 shadow-2xl space-y-4 max-h-96 sm:max-h-[500px] overflow-y-auto"
              style={{
                backgroundColor: theme.cardColor ? theme.cardColor + 'CC' : theme.accentColor + '10',
                borderColor: theme.accentColor + '40',
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
              }}
            >
              {loadingList ? (
                <div className="text-center py-8" style={{ color: theme.mutedText }}>
                  <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin mx-auto" />
                  <p className="mt-3 text-sm">Memuat ucapan...</p>
                </div>
              ) : rsvpList.length > 0 ? (
                <>
                  <div className="space-y-3 sm:space-y-4">
                    {rsvpList.slice(0, visibleComments).map((rsvp, index) => {
                      const displayName = rsvp.nama || rsvp.name || 'Anonim';
                      const displayMessage = rsvp.ucapan || rsvp.message || '';
                      const displayAttendance = rsvp.konfirmasi || rsvp.attendance || 'tidak ada';
                      const displayTime = rsvp.created_at || rsvp.timestamp;
                      const isHadir = displayAttendance.toLowerCase().includes('hadir') && !displayAttendance.toLowerCase().includes('tidak');

                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          viewport={{ once: true }}
                          className="p-4 sm:p-5 rounded-lg sm:rounded-xl border-2 transition-all duration-200"
                          style={{
                            backgroundColor: theme.accentColor + '08',
                            borderColor: theme.accentColor + '30'
                          }}
                        >
                          {/* Header: Avatar, Name, Time, Status */}
                          <div className="flex items-start justify-between gap-3 mb-3 sm:mb-4">
                            <div className="flex items-center gap-3 flex-1 min-w-0">
                              {/* Avatar */}
                              <div 
                                className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center font-semibold text-sm sm:text-base flex-shrink-0"
                                style={{ 
                                  backgroundColor: theme.accentColor + '30',
                                  color: theme.accentColor
                                }}
                              >
                                {displayName.charAt(0).toUpperCase()}
                              </div>
                              
                              {/* Name and Time */}
                              <div className="flex-1 min-w-0">
                                <p 
                                  className="font-semibold text-sm sm:text-base truncate"
                                  style={{ color: theme.textColor }}
                                  title={displayName}
                                >
                                  {displayName}
                                </p>
                                <p 
                                  className="text-xs opacity-70"
                                  style={{ color: theme.mutedText || '#b3b3b3' }}
                                >
                                  {timeAgo(displayTime)}
                                </p>
                              </div>
                            </div>

                            {/* Status Badge */}
                            <div 
                              className="flex-shrink-0 px-3 sm:px-4 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-semibold flex items-center gap-2 border-2"
                              style={{
                                backgroundColor: isHadir ? '#22c55e' + '20' : '#ef4444' + '20',
                                borderColor: isHadir ? '#22c55e' + '40' : '#ef4444' + '40',
                                color: isHadir ? '#16a34a' : '#dc2626'
                              }}
                            >
                              <span>{isHadir ? '✓ Hadir' : '✗ Tidak'}</span>
                            </div>
                          </div>

                          {/* Message */}
                          <p 
                            className="text-sm sm:text-base leading-relaxed break-words"
                            style={{ color: theme.textColor }}
                          >
                            {displayMessage}
                          </p>
                        </motion.div>
                      );
                    })}
                  </div>

                  {visibleComments < rsvpList.length && (
                    <div className="text-center pt-4">
                      <button
                        onClick={() => setVisibleComments(prev => prev + 5)}
                        className="px-6 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold transition-all duration-200 hover:scale-105 border-2"
                        style={{
                          borderColor: theme.accentColor + '40',
                          backgroundColor: theme.accentColor + '08',
                          color: theme.accentColor
                        }}
                      >
                        Muat Lebih Banyak
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-8" style={{ color: theme.mutedText }}>
                  <MessageSquare className="w-8 h-8 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">Belum ada ucapan</p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}
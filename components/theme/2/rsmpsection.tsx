import { motion } from 'framer-motion';
import { UserCheck, MessageSquare, Send, CheckCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface RsmpSectionProps {
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
  contentUserId: string;
  id?: string;
  plugin?: any;
  status: string;
}

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
  const [attendance, setAttendance] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Don't render if RSVP is not enabled
  if (!plugin?.rsvp) {
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name.trim() || !attendance || !message.trim()) {
      setError('Mohon lengkapi semua field');
      return;
    }

    setIsSubmitting(true);
    setError('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Here you would typically send the data to your API
      console.log({
        contentUserId,
        name: name.trim(),
        attendance,
        message: message.trim(),
        timestamp: new Date().toISOString()
      });

      setIsSubmitted(true);
      setName('');
      setAttendance('');
      setMessage('');
      
      // Reset after 3 seconds
      setTimeout(() => {
        setIsSubmitted(false);
      }, 3000);
      
    } catch (err) {
      setError('Terjadi kesalahan. Silakan coba lagi.');
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
          className="text-center mb-16"
        >
          <div className="inline-block mb-4">
            <span 
              className="px-6 py-3 rounded-full text-sm font-bold tracking-wider uppercase"
              style={{ 
                backgroundColor: theme.accentColor + '20', 
                color: theme.accentColor,
                border: `2px solid ${theme.accentColor}`
              }}
            >
              RSVP
            </span>
          </div>
          
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ 
              color: theme.textColor,
              fontFamily: specialFontFamily || 'serif'
            }}
          >
            Konfirmasi Kehadiran
          </h2>
          
          <p 
            className="text-lg opacity-80 max-w-2xl mx-auto"
            style={{ 
              color: theme.mutedText,
              fontFamily: bodyFontFamily || 'sans-serif'
            }}
          >
            Mohon konfirmasi kehadiran Anda dan berikan ucapan untuk kami
          </p>
        </motion.div>

        {/* RSVP Form */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto"
        >
          <div 
            className="rounded-2xl p-8 backdrop-blur-sm border border-opacity-20"
            style={{ 
              backgroundColor: theme.cardColor + '90',
              borderColor: theme.accentColor + '30'
            }}
          >
            {!isSubmitted ? (
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Name Input */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme.textColor }}
                  >
                    Nama Lengkap
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-opacity-30 bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200"
                    style={{ 
                      backgroundColor: theme.cardColor + '60',
                      borderColor: theme.accentColor + '30',
                      color: theme.textColor,
                      focusRingColor: theme.accentColor
                    }}
                    placeholder="Masukkan nama Anda"
                    required
                  />
                </div>

                {/* Attendance Radio */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-3"
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
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-center font-semibold ${
                          attendance === 'hadir' ? 'scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                          borderColor: attendance === 'hadir' ? theme.accentColor : theme.accentColor + '30',
                          backgroundColor: attendance === 'hadir' ? theme.accentColor + '20' : theme.cardColor + '40',
                          color: theme.textColor
                        }}
                      >
                        <UserCheck className="w-6 h-6 mx-auto mb-2" style={{ color: theme.accentColor }} />
                        Hadir
                      </div>
                    </label>
                    <label className="cursor-pointer">
                      <input
                        type="radio"
                        value="tidak_hadir"
                        checked={attendance === 'tidak_hadir'}
                        onChange={(e) => setAttendance(e.target.value)}
                        className="sr-only"
                      />
                      <div 
                        className={`p-4 rounded-lg border-2 transition-all duration-200 text-center font-semibold ${
                          attendance === 'tidak_hadir' ? 'scale-105' : 'hover:scale-105'
                        }`}
                        style={{
                          borderColor: attendance === 'tidak_hadir' ? theme.accentColor : theme.accentColor + '30',
                          backgroundColor: attendance === 'tidak_hadir' ? theme.accentColor + '20' : theme.cardColor + '40',
                          color: theme.textColor
                        }}
                      >
                        <MessageSquare className="w-6 h-6 mx-auto mb-2" style={{ color: theme.accentColor }} />
                        Tidak Hadir
                      </div>
                    </label>
                  </div>
                </div>

                {/* Message Textarea */}
                <div>
                  <label 
                    className="block text-sm font-semibold mb-2"
                    style={{ color: theme.textColor }}
                  >
                    Ucapan & Doa
                  </label>
                  <textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-opacity-30 bg-opacity-20 focus:outline-none focus:ring-2 focus:ring-opacity-50 transition-all duration-200 resize-none"
                    style={{ 
                      backgroundColor: theme.cardColor + '60',
                      borderColor: theme.accentColor + '30',
                      color: theme.textColor
                    }}
                    placeholder="Berikan ucapan dan doa terbaik untuk kami..."
                    required
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="text-red-400 text-sm font-medium">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-lg font-semibold rounded-lg transition-all duration-300 hover:scale-105 flex items-center justify-center gap-3"
                  style={{
                    backgroundColor: theme.accentColor,
                    color: 'white',
                    border: 'none'
                  }}
                >
                  {isSubmitting ? (
                    <div className="flex items-center gap-2">
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      Mengirim...
                    </div>
                  ) : (
                    <>
                      <Send className="w-5 h-5" />
                      Kirim Konfirmasi
                    </>
                  )}
                </Button>
              </form>
            ) : (
              /* Success Message */
              <div className="text-center py-8">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
                  style={{ backgroundColor: theme.accentColor + '20' }}
                >
                  <CheckCircle className="w-10 h-10" style={{ color: theme.accentColor }} />
                </motion.div>
                <h3 
                  className="text-2xl font-bold mb-4"
                  style={{ color: theme.textColor }}
                >
                  Terima Kasih!
                </h3>
                <p 
                  className="text-lg opacity-80"
                  style={{ color: theme.mutedText }}
                >
                  Konfirmasi kehadiran Anda telah berhasil dikirim.
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
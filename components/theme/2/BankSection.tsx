'use client';

import { motion } from 'framer-motion';
import { CreditCard, Copy, CheckCircle, Gift, Wallet } from 'lucide-react';import { FiLock } from 'react-icons/fi';import { useState } from 'react';
import { submitBankTransfer } from '@/app/actions/bank';

interface BankAccount {
  bank_name?: string;
  bankName?: string;
  account_number?: string;
  accountNumber?: string;
  account_name?: string;
  accountName?: string;
}

interface BankSectionProps {
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor?: string;
    mutedText?: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
  bankTransfer: {
    enabled: boolean;
    accounts: BankAccount[];
  };
  contentUserId: string | number;
  status?: string;
}

export default function BankSection({
  theme,
  specialFontFamily,
  bodyFontFamily,
  bankTransfer,
  contentUserId,
  status,
}: BankSectionProps) {
  
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);
  const [selectedAccountIdx, setSelectedAccountIdx] = useState(0);
  const [nama, setNama] = useState('');
  const [nominal, setNominal] = useState('');
  const [formattedNominal, setFormattedNominal] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [showForm, setShowForm] = useState(false);

  if (!bankTransfer?.enabled || !bankTransfer?.accounts || bankTransfer.accounts.length === 0) {
    return null;
  }

  const copyToClipboard = async (text: string, accountId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedAccount(accountId);
      setTimeout(() => setCopiedAccount(null), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  const formatToRupiah = (value: string) => {
    const numericValue = parseFloat(value.replace(/[^0-9]/g, ''));
    if (isNaN(numericValue)) return '';
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(numericValue);
  };

  const handleNominalChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/[^0-9]/g, '');
    setNominal(raw);
    setFormattedNominal(formatToRupiah(raw));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!nama.trim() || !nominal.trim()) {
      setError('Mohon lengkapi semua field');
      return;
    }

    setLoading(true);
    try {
      // Use server action to submit bank transfer
      await submitBankTransfer({
        nominal: parseFloat(nominal),
        user_id: contentUserId as number,
        nama_pemberi: nama.trim()
      });

      setSuccess(true);
      setNama('');
      setNominal('');
      setFormattedNominal('');
      
      setTimeout(() => {
        setSuccess(false);
        setShowForm(false);
      }, 3000);
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan. Silakan coba lagi.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Normalize account data to handle both naming conventions
  const normalizedAccounts = bankTransfer.accounts.map(acc => ({
    bankName: acc.bank_name || acc.bankName || '',
    accountNumber: acc.account_number || acc.accountNumber || '',
    accountName: acc.account_name || acc.accountName || ''
  })).filter(acc => acc.bankName && acc.accountNumber && acc.accountName);

  if (normalizedAccounts.length === 0) return null;

  return (
    <section 
      id="gift"
      className="py-12 sm:py-16 md:py-20 lg:py-24 relative"
      style={{ backgroundColor: theme.backgroundColor }}
    >
      {/* Free Mode Overlay */}
      {status === "tidak" && (
        <div className="absolute inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-10">
          <div className="text-center p-6 bg-white bg-opacity-90 rounded-lg shadow-xl max-w-xs mx-4">
            <FiLock className="mx-auto mb-3 text-4xl" style={{ color: theme.accentColor }} />
            <h3 className="text-lg font-semibold mb-2" style={{ color: theme.accentColor, fontFamily: specialFontFamily }}>
              Mode Gratis
            </h3>
            <p className="text-sm" style={{ color: theme.accentColor, fontFamily: bodyFontFamily }}>
              Fitur tidak tersedia.<br />Silahkan klik tombol aktifkan sekarang di header untuk menggunakan fitur ini.
            </p>
          </div>
        </div>
      )}
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
              Hadiah
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-4 sm:mb-6"
            style={{ 
              color: theme.textColor,
              fontFamily: specialFontFamily || 'serif'
            }}
          >
            Kirim Hadiah
          </h2>
          
          <p 
            className="text-sm sm:text-base md:text-lg opacity-85 max-w-2xl mx-auto"
            style={{ 
              color: theme.mutedText || '#b3b3b3',
              fontFamily: bodyFontFamily || 'sans-serif'
            }}
          >
            Kehadiran Anda sudah merupakan hadiah yang sangat berharga bagi kami. 
            Namun jika ingin memberikan hadiah, dapat melalui:
          </p>
        </motion.div>

        {/* Bank Accounts Grid */}
        <div className={`grid grid-cols-1 ${normalizedAccounts.length > 1 ? 'md:grid-cols-2' : ''} gap-6 sm:gap-8 max-w-5xl mx-auto mb-12 sm:mb-16`}>
          {normalizedAccounts.map((account, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div 
                className={`rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md border-2 shadow-2xl transition-all duration-500 cursor-pointer ${selectedAccountIdx === index ? 'scale-105' : 'hover:scale-[1.02]'}`}
                style={{ 
                  backgroundColor: selectedAccountIdx === index 
                    ? theme.accentColor + '20'
                    : (theme.cardColor ? theme.cardColor + 'CC' : theme.accentColor + '10'),
                  borderColor: selectedAccountIdx === index ? theme.accentColor : (theme.accentColor + '40'),
                  boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
                }}
                onClick={() => setSelectedAccountIdx(index)}
              >
                {/* Bank Icon */}
                <div className="mb-6 flex justify-center">
                  <div 
                    className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center shadow-lg"
                    style={{ backgroundColor: theme.accentColor + '20' }}
                  >
                    <CreditCard className="w-8 h-8 sm:w-10 sm:h-10" style={{ color: theme.accentColor }} />
                  </div>
                </div>

                {/* Bank Name */}
                <h3 
                  className="text-xl sm:text-2xl md:text-3xl font-bold mb-6 sm:mb-8 text-center"
                  style={{ 
                    color: theme.textColor,
                    fontFamily: specialFontFamily || 'serif'
                  }}
                >
                  {account.bankName}
                </h3>

                {/* Account Details */}
                <div className="space-y-4 sm:space-y-5">
                  {/* Account Number */}
                  <div>
                    <p 
                      className="text-xs sm:text-sm uppercase tracking-wider font-semibold mb-3 opacity-80"
                      style={{ color: theme.mutedText || '#b3b3b3' }}
                    >
                      Nomor Rekening
                    </p>
                    <div 
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300"
                      style={{ 
                        borderColor: theme.accentColor + '40',
                        backgroundColor: theme.accentColor + '08'
                      }}
                    >
                      <span 
                        className="text-base sm:text-lg font-mono font-bold break-all"
                        style={{ color: theme.textColor }}
                      >
                        {account.accountNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, `${index}-number`)}
                        className="p-2 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
                        style={{ backgroundColor: theme.accentColor + '20' }}
                        title="Copy to clipboard"
                      >
                        {copiedAccount === `${index}-number` ? (
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.accentColor }} />
                        ) : (
                          <Copy className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.accentColor }} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div>
                    <p 
                      className="text-xs sm:text-sm uppercase tracking-wider font-semibold mb-3 opacity-80"
                      style={{ color: theme.mutedText || '#b3b3b3' }}
                    >
                      Atas Nama
                    </p>
                    <div 
                      className="flex items-center justify-between p-3 sm:p-4 rounded-lg sm:rounded-xl border-2 transition-all duration-300"
                      style={{ 
                        borderColor: theme.accentColor + '40',
                        backgroundColor: theme.accentColor + '08'
                      }}
                    >
                      <span 
                        className="text-base sm:text-lg font-semibold break-all"
                        style={{ color: theme.textColor }}
                      >
                        {account.accountName}
                      </span>
                      <button
                        onClick={() => copyToClipboard(account.accountName, `${index}-name`)}
                        className="p-2 rounded-lg transition-all duration-200 flex-shrink-0 ml-2"
                        style={{ backgroundColor: theme.accentColor + '20' }}
                        title="Copy to clipboard"
                      >
                        {copiedAccount === `${index}-name` ? (
                          <CheckCircle className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.accentColor }} />
                        ) : (
                          <Copy className="w-5 h-5 sm:w-6 sm:h-6" style={{ color: theme.accentColor }} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Thank You Note */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="flex justify-center"
        >
          <div 
            className="inline-flex items-center justify-center gap-3 px-6 sm:px-8 py-3 sm:py-4 rounded-full sm:rounded-2xl backdrop-blur-md border-2"
            style={{ 
              backgroundColor: theme.cardColor ? theme.cardColor + '60' : theme.accentColor + '10',
              borderColor: theme.accentColor + '40'
            }}
          >
            <Gift className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0" style={{ color: theme.accentColor }} />
            <span 
              className="text-sm sm:text-base font-semibold"
              style={{ color: theme.textColor }}
            >
              Terima kasih atas kebaikan Anda
            </span>
          </div>
        </motion.div>

        {/* Confirmation Form */}
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mt-12 sm:mt-16 max-w-2xl mx-auto"
          >
            <div 
              className="rounded-2xl sm:rounded-3xl p-6 sm:p-8 backdrop-blur-md border-2 shadow-2xl"
              style={{
                backgroundColor: theme.cardColor ? theme.cardColor + 'CC' : theme.accentColor + '10',
                borderColor: theme.accentColor + '40',
                boxShadow: `0 25px 50px -12px rgba(0,0,0,0.6), 0 0 0 1px ${theme.accentColor}20`
              }}
            >
              <h3 
                className="text-xl sm:text-2xl font-bold mb-6"
                style={{ color: theme.textColor, fontFamily: specialFontFamily || 'serif' }}
              >
                Konfirmasi Transfer
              </h3>

              {!success ? (
                <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
                  {/* Bank Selection Info */}
                  <div className="p-4 sm:p-5 rounded-lg sm:rounded-xl" style={{ backgroundColor: theme.accentColor + '08', borderColor: theme.accentColor + '30', borderWidth: '2px' }}>
                    <p className="text-xs sm:text-sm font-semibold opacity-70" style={{ color: theme.mutedText || '#b3b3b3' }}>Bank Terpilih</p>
                    <p className="text-base sm:text-lg font-bold mt-1" style={{ color: theme.textColor }}>
                      {normalizedAccounts[selectedAccountIdx]?.bankName}
                    </p>
                  </div>

                  {/* Name Input */}
                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: theme.textColor }}>
                      Nama Pengirim
                    </label>
                    <input
                      type="text"
                      value={nama}
                      onChange={(e) => setNama(e.target.value)}
                      placeholder="Masukkan nama Anda"
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: theme.accentColor + '08',
                        borderColor: theme.accentColor + '40',
                        color: theme.textColor
                      }}
                    />
                  </div>

                  {/* Nominal Input */}
                  <div>
                    <label className="block text-sm font-semibold mb-3" style={{ color: theme.textColor }}>
                      Jumlah Transfer
                    </label>
                    <input
                      type="text"
                      value={formattedNominal}
                      onChange={handleNominalChange}
                      placeholder="Rp 0"
                      className="w-full px-4 sm:px-5 py-3 sm:py-4 rounded-lg sm:rounded-xl border-2 focus:outline-none transition-all duration-200"
                      style={{
                        backgroundColor: theme.accentColor + '08',
                        borderColor: theme.accentColor + '40',
                        color: theme.textColor
                      }}
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
                    disabled={loading}
                    className="w-full py-3 sm:py-4 text-base sm:text-lg font-semibold rounded-lg sm:rounded-xl transition-all duration-300 flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed"
                    style={{
                      backgroundColor: theme.accentColor,
                      color: 'white'
                    }}
                  >
                    {loading ? (
                      <>
                        <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Wallet className="w-5 h-5" />
                        Kirim Konfirmasi
                      </>
                    )}
                  </button>
                </form>
              ) : (
                <div className="text-center py-8 sm:py-12">
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full flex items-center justify-center mx-auto mb-6"
                    style={{ backgroundColor: theme.accentColor + '20' }}
                  >
                    <CheckCircle className="w-10 h-10 sm:w-12 sm:h-12" style={{ color: theme.accentColor }} />
                  </motion.div>
                  <h4 className="text-xl sm:text-2xl font-bold mb-3" style={{ color: theme.textColor }}>
                    Terima Kasih!
                  </h4>
                  <p className="text-sm sm:text-base opacity-85" style={{ color: theme.mutedText || '#b3b3b3' }}>
                    Konfirmasi transfer Anda telah berhasil dikirim.
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}

        {/* Toggle Form Button */}
        {!showForm && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true }}
            className="text-center mt-8 sm:mt-12"
          >
            <button
              onClick={() => setShowForm(true)}
              className="px-8 sm:px-12 py-3 sm:py-4 rounded-lg sm:rounded-xl font-semibold transition-all duration-300 hover:scale-105 border-2"
              style={{
                borderColor: theme.accentColor + '40',
                backgroundColor: theme.accentColor + '08',
                color: theme.accentColor
              }}
            >
              Konfirmasi Transfer
            </button>
          </motion.div>
        )}
      </div>
    </section>
  );
}
import { motion } from 'framer-motion';
import { CreditCard, Copy, CheckCircle, Gift } from 'lucide-react';
import { useState } from 'react';

interface BankAccount {
  bankName: string;
  accountNumber: string;
  accountName: string;
}

interface BankSectionProps {
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
  specialFontFamily?: string;
  bodyFontFamily?: string;
  bankTransfer: {
    enabled: boolean;
    accounts: BankAccount[];
  };
  contentUserId: string;
  status: string;
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

  return (
    <section 
      id="gift"
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
              Hadiah
            </span>
          </div>
          
          <h2 
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ 
              color: theme.textColor,
              fontFamily: specialFontFamily || 'serif'
            }}
          >
            Kirim Hadiah
          </h2>
          
          <p 
            className="text-lg opacity-80 max-w-2xl mx-auto"
            style={{ 
              color: theme.mutedText,
              fontFamily: bodyFontFamily || 'sans-serif'
            }}
          >
            Kehadiran Anda sudah merupakan hadiah yang sangat berharga bagi kami. 
            Namun jika ingin memberikan hadiah, dapat melalui:
          </p>
        </motion.div>

        {/* Bank Accounts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {bankTransfer.accounts.map((account, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div 
                className="rounded-2xl p-8 backdrop-blur-sm border border-opacity-20 hover:scale-105 transition-transform duration-300"
                style={{ 
                  backgroundColor: theme.cardColor + '90',
                  borderColor: theme.accentColor + '30'
                }}
              >
                {/* Bank Icon */}
                <div className="mb-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: theme.accentColor + '20' }}
                  >
                    <CreditCard className="w-8 h-8" style={{ color: theme.accentColor }} />
                  </div>
                </div>

                {/* Bank Name */}
                <h3 
                  className="text-2xl font-bold mb-6 text-center"
                  style={{ 
                    color: theme.textColor,
                    fontFamily: specialFontFamily || 'serif'
                  }}
                >
                  {account.bankName}
                </h3>

                {/* Account Details */}
                <div className="space-y-4">
                  {/* Account Number */}
                  <div>
                    <p 
                      className="text-sm uppercase tracking-wide mb-2 opacity-80"
                      style={{ color: theme.mutedText }}
                    >
                      Nomor Rekening
                    </p>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-opacity-20" style={{ borderColor: theme.accentColor, backgroundColor: theme.accentColor + '10' }}>
                      <span 
                        className="text-lg font-mono font-bold"
                        style={{ color: theme.textColor }}
                      >
                        {account.accountNumber}
                      </span>
                      <button
                        onClick={() => copyToClipboard(account.accountNumber, `${index}-number`)}
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{ backgroundColor: theme.accentColor + '20' }}
                      >
                        {copiedAccount === `${index}-number` ? (
                          <CheckCircle className="w-5 h-5" style={{ color: theme.accentColor }} />
                        ) : (
                          <Copy className="w-5 h-5" style={{ color: theme.accentColor }} />
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Account Name */}
                  <div>
                    <p 
                      className="text-sm uppercase tracking-wide mb-2 opacity-80"
                      style={{ color: theme.mutedText }}
                    >
                      Atas Nama
                    </p>
                    <div className="flex items-center justify-between p-3 rounded-lg border border-opacity-20" style={{ borderColor: theme.accentColor, backgroundColor: theme.accentColor + '10' }}>
                      <span 
                        className="text-lg font-semibold"
                        style={{ color: theme.textColor }}
                      >
                        {account.accountName}
                      </span>
                      <button
                        onClick={() => copyToClipboard(account.accountName, `${index}-name`)}
                        className="p-2 rounded-lg transition-colors duration-200"
                        style={{ backgroundColor: theme.accentColor + '20' }}
                      >
                        {copiedAccount === `${index}-name` ? (
                          <CheckCircle className="w-5 h-5" style={{ color: theme.accentColor }} />
                        ) : (
                          <Copy className="w-5 h-5" style={{ color: theme.accentColor }} />
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
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          viewport={{ once: true }}
          className="text-center mt-12"
        >
          <div 
            className="inline-flex items-center gap-3 px-8 py-4 rounded-full backdrop-blur-sm"
            style={{ 
              backgroundColor: theme.cardColor + '60',
              border: `1px solid ${theme.accentColor}30`
            }}
          >
            <Gift className="w-5 h-5" style={{ color: theme.accentColor }} />
            <span 
              className="text-lg font-semibold"
              style={{ color: theme.textColor }}
            >
              Terima kasih atas kebaikan Anda
            </span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
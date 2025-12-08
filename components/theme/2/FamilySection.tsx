import { motion } from 'framer-motion';
import { Users, Heart } from 'lucide-react';

interface FamilySectionProps {
  childrenData: Array<{ name: string; nickname?: string }>;
  parents?: {
    groom?: {
      father: string;
      mother: string;
    };
    bride?: {
      father: string;
      mother: string;
    };
  };
  isWedding: boolean;
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor: string;
    mutedText: string;
  };
  category_type?: { id: number; name: string };
}

export default function FamilySection({
  childrenData,
  parents,
  isWedding,
  theme,
  category_type,
}: FamilySectionProps) {
  
  if (!parents || (!parents.groom && !parents.bride)) return null;

  const lowerCategory = (category_type?.name || '').toLowerCase();
  const isKhitan = lowerCategory.includes('khitan');
  const person1 = childrenData?.[0];
  const person2 = childrenData?.[1];

  return (
    <section 
      className="py-20 relative"
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
              Keluarga
            </span>
          </div>
          
          <h2 
            className="text-3xl md:text-4xl font-bold"
            style={{ color: theme.textColor }}
          >
            Keluarga Besar
          </h2>
        </motion.div>

        {/* Family Cards */}
        <div className={`grid grid-cols-1 ${isWedding && !isKhitan ? 'md:grid-cols-2' : ''} gap-8 max-w-6xl mx-auto`}>
          
          {/* Groom/Child Family */}
          {parents.groom && (
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <div 
                className="rounded-2xl p-8 backdrop-blur-sm border border-opacity-20 text-center h-full"
                style={{ 
                  backgroundColor: theme.cardColor + '90',
                  borderColor: theme.accentColor + '30'
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: theme.accentColor + '20' }}
                  >
                    <Users className="w-8 h-8" style={{ color: theme.accentColor }} />
                  </div>
                </div>

                {/* Child Name */}
                <h3 
                  className="text-2xl md:text-3xl font-bold mb-6"
                  style={{ color: theme.textColor }}
                >
                  {isKhitan ? 'Keluarga' : (person1?.name || 'Mempelai Pria')}
                </h3>

                {/* Parents */}
                <div className="space-y-4">
                  <div>
                    <p 
                      className="text-sm uppercase tracking-wide mb-2 opacity-80"
                      style={{ color: theme.mutedText }}
                    >
                      Putra dari
                    </p>
                    <div className="space-y-2">
                      <p 
                        className="text-lg font-semibold"
                        style={{ color: theme.textColor }}
                      >
                        {parents.groom.father}
                      </p>
                      <p 
                        className="text-lg font-semibold"
                        style={{ color: theme.textColor }}
                      >
                        {parents.groom.mother}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Heart Divider for Wedding */}
          {isWedding && !isKhitan && parents.groom && parents.bride && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              viewport={{ once: true }}
              className="hidden md:flex absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
            >
              <div 
                className="w-16 h-16 rounded-full flex items-center justify-center backdrop-blur-sm"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Heart className="w-8 h-8 text-white" fill="currentColor" />
              </div>
            </motion.div>
          )}

          {/* Bride Family */}
          {parents.bride && isWedding && !isKhitan && (
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: true }}
            >
              <div 
                className="rounded-2xl p-8 backdrop-blur-sm border border-opacity-20 text-center h-full"
                style={{ 
                  backgroundColor: theme.cardColor + '90',
                  borderColor: theme.accentColor + '30'
                }}
              >
                {/* Icon */}
                <div className="mb-6">
                  <div 
                    className="w-16 h-16 rounded-full flex items-center justify-center mx-auto"
                    style={{ backgroundColor: theme.accentColor + '20' }}
                  >
                    <Users className="w-8 h-8" style={{ color: theme.accentColor }} />
                  </div>
                </div>

                {/* Child Name */}
                <h3 
                  className="text-2xl md:text-3xl font-bold mb-6"
                  style={{ color: theme.textColor }}
                >
                  {person2?.name || 'Mempelai Wanita'}
                </h3>

                {/* Parents */}
                <div className="space-y-4">
                  <div>
                    <p 
                      className="text-sm uppercase tracking-wide mb-2 opacity-80"
                      style={{ color: theme.mutedText }}
                    >
                      Putri dari
                    </p>
                    <div className="space-y-2">
                      <p 
                        className="text-lg font-semibold"
                        style={{ color: theme.textColor }}
                      >
                        {parents.bride.father}
                      </p>
                      <p 
                        className="text-lg font-semibold"
                        style={{ color: theme.textColor }}
                      >
                        {parents.bride.mother}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </section>
  );
}
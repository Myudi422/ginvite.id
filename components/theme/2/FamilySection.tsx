import { motion } from 'framer-motion';
import { Users, Heart } from 'lucide-react';
import Image from 'next/image';

interface FamilySectionProps {
  childrenData: Array<{ name: string; nickname?: string; profile?: string }>;
  parents?: {
    groom?: {
      father: string;
      mother: string;
    };
    bride?: {
      father: string;
      mother: string;
    };
    father?: string;
    mother?: string;
  };
  isWedding: boolean;
  theme: {
    accentColor: string;
    textColor: string;
    backgroundColor: string;
    cardColor?: string;
    mutedText?: string;
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
  const isWeddingCategory = lowerCategory.includes('pernikahan');
  const person1 = childrenData?.[0];
  const person2 = childrenData?.[1];

  const renderCard = (person: any, parentInfo: any, role: 'groom' | 'bride', idx: number) => (
    <motion.div
      key={person.name}
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, delay: idx * 0.2 }}
      viewport={{ once: true }}
      className="w-full max-w-xs"
    >
      {person?.profile ? (
        <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
          <div className="relative w-full aspect-square">
            <Image 
              src={person.profile} 
              alt={person.name} 
              fill 
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
            {/* Strong gradient overlay for text contrast */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/20" />
          </div>
          
          {/* Text overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-6 text-center text-white">
            <h3 
              className="text-2xl md:text-3xl font-bold mb-2"
              style={{ color: theme.accentColor }}
            >
              {person.name}
            </h3>
            
            {isWeddingCategory && (
              <p className="text-sm uppercase tracking-wide mb-3 opacity-90">
                {role === 'groom' ? 'Pengantin Pria' : 'Pengantin Wanita'}
              </p>
            )}
            
            <div className="text-sm space-y-1">
              <p className="uppercase tracking-wide opacity-80 text-xs mb-2">
                {role === 'groom' ? 'Putra dari' : 'Putri dari'}
              </p>
              <p className="font-semibold">{parentInfo.father}</p>
              <p className="font-semibold">{parentInfo.mother}</p>
            </div>
          </div>
        </div>
      ) : (
        <div 
          className="rounded-2xl p-8 text-center shadow-2xl border-2"
          style={{ 
            backgroundColor: theme.cardColor || theme.accentColor + '10',
            borderColor: theme.accentColor + '40'
          }}
        >
          <div className="mb-6 flex justify-center">
            <div 
              className="w-16 h-16 rounded-full flex items-center justify-center"
              style={{ backgroundColor: theme.accentColor + '20' }}
            >
              <Users className="w-8 h-8" style={{ color: theme.accentColor }} />
            </div>
          </div>

          <h3 
            className="text-2xl md:text-3xl font-bold mb-2"
            style={{ color: theme.textColor }}
          >
            {person.name}
          </h3>

          {isWeddingCategory && (
            <p className="text-sm uppercase tracking-wide mb-4 opacity-80" style={{ color: theme.mutedText }}>
              {role === 'groom' ? 'Pengantin Pria' : 'Pengantin Wanita'}
            </p>
          )}

          <div className="space-y-2">
            <p 
              className="text-xs uppercase tracking-wide opacity-80"
              style={{ color: theme.mutedText }}
            >
              {role === 'groom' ? 'Putra dari' : 'Putri dari'}
            </p>
            <p className="font-semibold" style={{ color: theme.textColor }}>
              {parentInfo.father}
            </p>
            <p className="font-semibold" style={{ color: theme.textColor }}>
              {parentInfo.mother}
            </p>
          </div>
        </div>
      )}
    </motion.div>
  );

  return (
    <section 
      className="py-16 sm:py-20 md:py-24 relative"
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
          <div className="inline-block mb-4 sm:mb-6">
            <span 
              className="px-6 sm:px-8 py-3 sm:py-4 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase border-2"
              style={{ 
                backgroundColor: theme.accentColor + '15', 
                color: theme.accentColor,
                borderColor: theme.accentColor + '60'
              }}
            >
              {isKhitan ? 'Keluarga' : 'Pengantin'}
            </span>
          </div>
          
          <h2 
            className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold"
            style={{ color: theme.textColor }}
          >
            {isKhitan ? 'Keluarga Besar' : 'Pengantin Kami'}
          </h2>
        </motion.div>

        {/* Content */}
        {isWeddingCategory && !isKhitan ? (
          <div className="flex flex-col lg:flex-row items-center justify-center gap-8 sm:gap-12 lg:gap-20 max-w-6xl mx-auto">
            {/* Groom */}
            {parents.groom && person1 && renderCard(person1, parents.groom, 'groom', 0)}

            {/* Heart Divider */}
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              viewport={{ once: true }}
              className="flex lg:flex-shrink-0"
            >
              <div 
                className="w-16 h-16 lg:w-20 lg:h-20 rounded-full flex items-center justify-center shadow-2xl"
                style={{ backgroundColor: theme.accentColor }}
              >
                <Heart className="w-8 h-8 lg:w-10 lg:h-10 text-white" fill="currentColor" />
              </div>
            </motion.div>

            {/* Bride */}
            {parents.bride && person2 && renderCard(person2, parents.bride, 'bride', 1)}
          </div>
        ) : (
          <div className="flex justify-center">
            {person1 && (parents.groom ? renderCard(person1, parents.groom, 'groom', 0) : null)}
          </div>
        )}
      </div>
    </section>
  );
}
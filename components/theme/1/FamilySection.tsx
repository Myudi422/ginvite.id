// components/theme/1/FamilySection.tsx
import React from 'react';
import Image from 'next/image';
import { Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { sectionVariant, textVariant } from './animasi';

interface Child {
  name: string;
  order: string;
  profile: string;
  nickname?: string;
}

interface Parents {
  bride: { father: string; mother: string };
  groom: { father: string; mother: string };
  father?: string;
  mother?: string;
}

interface FamilySectionProps {
  childrenData: Child[];
  parents: Parents;
  isWedding: boolean;
  theme: { accentColor: string; background: string };
  category_type?: { id: number; name: string }; // Tambahkan prop category_type opsional
}

export default function FamilySection({ childrenData, parents, isWedding, theme, category_type }: FamilySectionProps) {
  if (!childrenData || childrenData.length === 0) return null;

  const isWeddingCategory = category_type?.name?.toLowerCase() === "pernikahan";

  const renderCard = (c: Child, idx: number) => (
    <motion.div
      key={c.name}
      className="relative rounded-lg overflow-hidden shadow-lg w-64"
      variants={textVariant}
      custom={idx}
    >
      {c.profile ? (
        <div className="relative w-full aspect-square">
          <Image src={c.profile} alt={c.name} fill className="object-cover" />
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 text-center">
            <h3 className="text-xl font-semibold" style={{ color: theme.accentColor }}>
              {c.name}
            </h3>
            {/* Hanya tampilkan order jika pernikahan, selain itu kosong */}
            <p className="text-sm text-gray-600 mb-1">
              {isWeddingCategory ? c.order : ""}
            </p>
            <p className="text-xs text-gray-500">
              {isWeddingCategory
                ? (c.order === 'Pengantin Pria'
                    ? `Putra dari ${parents.groom.father} & ${parents.groom.mother}`
                    : `Putri dari ${parents.bride.father} & ${parents.bride.mother}`)
                : (parents.father && parents.mother
                    ? `Putra/Putri dari ${parents.father} & ${parents.mother}`
                    : '')}
            </p>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <h3 className="text-xl font-semibold" style={{ color: theme.accentColor }}>
            {c.name}
          </h3>
          {/* Hanya tampilkan order jika pernikahan, selain itu kosong */}
          <p className="text-sm text-gray-600 mb-1">
            {isWeddingCategory ? c.order : ""}
          </p>
          <p className="text-xs text-gray-500">
            {isWeddingCategory
              ? (c.order === 'Pengantin Pria'
                  ? `Putra dari ${parents.groom.father} & ${parents.groom.mother}`
                  : `Putri dari ${parents.bride.father} & ${parents.bride.mother}`)
              : (parents.father && parents.mother
                  ? `Putra/Putri dari ${parents.father} & ${parents.mother}`
                  : '')}
          </p>
        </div>
      )}
    </motion.div>
  );

  return (
    <motion.section
      className="py-6 px-4 flex flex-col items-center gap-8"
      style={{ backgroundImage: `url(${theme.background})`, backgroundSize: 'cover', backgroundRepeat: 'no-repeat' }}
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      {isWeddingCategory ? (
        <>
          {renderCard(childrenData[0], 0)}
          <motion.div
            className="flex items-center justify-center gap-2"
            style={{ color: theme.accentColor }}
            variants={textVariant}
            custom={1}
          >
            <div className="border-t border-solid border-current w-16"></div>
            <Heart size={36} />
            <div className="border-t border-solid border-current w-16"></div>
          </motion.div>
          {renderCard(childrenData[1], 2)}
        </>
      ) : (
        renderCard(childrenData[0], 0)
      )}
    </motion.section>
  );
}

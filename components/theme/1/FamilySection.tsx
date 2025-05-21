import Image from 'next/image';
import { Heart } from 'lucide-react';

interface Child {
  name: string;
  order: string;
  profile: string;
  nickname?: string;
}

interface Parents {
  bride: { father: string; mother: string };
  groom: { father: string; mother: string };
}

interface FamilySectionProps {
  childrenData: Child[];
  parents: Parents;
  isWedding: boolean;
  theme: { accentColor: string; background: string };
}

export default function FamilySection({ childrenData, parents, isWedding, theme }: FamilySectionProps) {
  if (childrenData.length < 2) return null; // need both bride & groom

  const [bride, groom] = childrenData;

  const renderCard = (c: Child) => (
    <div className="relative rounded-lg overflow-hidden shadow-lg w-64">
      {c.profile ? (
        // Layout dengan gambar
        <div className="relative w-full aspect-square">
          <Image
            src={c.profile}
            alt={c.name}
            fill
            className="object-cover"
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white/80 backdrop-blur-sm p-4 text-center">
            <h3 className="text-xl font-semibold" style={{ color: theme.accentColor }}>
              {c.name}
            </h3>
            <p className="text-sm text-gray-600 mb-1">{c.order}</p>
            <p className="text-xs text-gray-500">
              {isWedding
                ? c.order === 'Pengantin Pria'
                  ? `Putra dari ${parents.groom.father} & ${parents.groom.mother}`
                  : `Putri dari ${parents.bride.father} & ${parents.bride.mother}`
                : ''}
            </p>
          </div>
        </div>
      ) : (
        // Layout tanpa gambar (hanya teks di dalam kotak)
        <div className="bg-white rounded-lg p-6 text-center shadow-lg">
          <h3 className="text-xl font-semibold" style={{ color: theme.accentColor }}>
            {c.name}
          </h3>
          <p className="text-sm text-gray-600 mb-1">{c.order}</p>
          <p className="text-xs text-gray-500">
            {isWedding
              ? c.order === 'Pengantin Pria'
                ? `Putra dari ${parents.groom.father} & ${parents.groom.mother}`
                : `Putri dari ${parents.bride.father} & ${parents.bride.mother}`
              : ''}
          </p>
        </div>
      )}
    </div>
  );

  return (
    <section
      className="py-6 px-4 flex flex-col items-center gap-8"
      style={{ backgroundImage: `url(${theme.background})` }}
    >
      {/* Bride Card */}
      {renderCard(bride)}

      {/* Improved Heart Divider */}
      <div className="flex items-center justify-center gap-2" style={{ color: theme.accentColor }}>
        <div className="border-t border-solid border-current w-16"></div>
        <Heart size={36} />
        <div className="border-t border-solid border-current w-16"></div>
      </div>

      {/* Groom Card */}
      {renderCard(groom)}
    </section>
  );
}
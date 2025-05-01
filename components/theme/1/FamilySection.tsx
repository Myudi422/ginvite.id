// components/family/FamilySection.tsx
import Image from 'next/image';

export default function FamilySection({ children, parents, isWedding, theme }) {
  return (
    <section id="family" className="home-section" style={{ padding: '2rem 1rem' }}>
      <div className="home-inner">
        <div className="home-children-parent">
          {children.map((c, i) => (
            <div key={i} className="home-children-parent__item">
              {c.profile1 && (
                <div className="home-children-parent__avatar">
                  <Image
                    src={c.profile1}
                    alt={`${c.name} Profile`}
                    width={96}
                    height={96}
                    className="object-cover"
                  />
                </div>
              )}
              <h3
                className="home-children-parent__name"
                style={{ color: theme.accentColor }}
              >
                {c.name}
              </h3>
              <p className="home-children-parent__nickname">({c.nickname})</p>
              <p className="home-children-parent__order">{c.order}</p>
              <p className="home-children-parent__parents">
                {isWedding
                  ? c.order === 'Pengantin Pria'
                    ? `Putra dari ${parents.groom.father} & ${parents.groom.mother}`
                    : `Putri dari ${parents.bride.father} & ${parents.bride.mother}`
                  : `Putra dari ${parents.father} & ${parents.mother}`}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

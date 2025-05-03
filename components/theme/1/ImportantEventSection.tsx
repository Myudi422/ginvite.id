// components/important-event/ImportantEventSection.tsx
interface ImportantEventSectionProps {
  quotes: {
    importantEvent: string;
  };
  specialFontFamily?: string; // Tambahkan properti specialFontFamily
  BodyFontFamily?: string;
  theme: {
    defaultBgImage: string;
    accentColor: string;
    textColor: string;
  };
}

export default function ImportantEventSection({
  quotes,
  specialFontFamily,
  theme,
  BodyFontFamily,
}: ImportantEventSectionProps) {
  return (
    <section
      id="important-event"
      className="home-section"
      style={{
        padding: '2rem 1rem',
        backgroundImage: `url(${theme.defaultBgImage})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
    >
      <div className="home-inner">
        <div
          className="home-important-event"
          style={{
            backgroundColor: theme.accentColor, // Latar belakang kotak menggunakan accentColor
            opacity: 0.7, // Tingkat transparansi kotak
            borderRadius: '10px', // Membuat sudut membulat (sesuaikan nilai sesuai keinginan)
            padding: '1.5rem', // Ruang di dalam kotak agar teks tidak terlalu mepet
            backdropFilter: 'blur(5px)', // Efek blur pada latar belakang di bawah kotak
          }}
        >
          <p
            className="home-important-event__description"
            style={{ fontFamily: BodyFontFamily, color: theme.textColor }} // Terapkan BodyFontFamily dan textColor
            dangerouslySetInnerHTML={{
              __html: quotes.importantEvent.replace(/\n/g, '<br/>'),
            }}
          />
        </div>
      </div>
    </section>
  );
}
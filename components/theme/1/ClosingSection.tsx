// components/theme/1/ClosingSection.tsx

interface ClosingSectionProps {
    closing: {
      title: string;
      text: string;
    };
    defaultBgImage: string;
  }
  
  export default function ClosingSection({
    closing,
    defaultBgImage,
  }: ClosingSectionProps) {
    return (
      <section
        id="penutup"
        className="home-section text-center"
        style={{
          backgroundImage: `url(${defaultBgImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          padding: '3rem 1.5rem',
        }}
      >
        <div className="home-inner">
          <h2 className="text-2xl font-bold mb-6">{closing.title}</h2>
          <p
            className="text-sm leading-relaxed"
            dangerouslySetInnerHTML={{ __html: closing.text }}
          />
        </div>
      </section>
    );
  }
  
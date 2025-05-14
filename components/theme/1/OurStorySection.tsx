// components/our-story/OurStorySection.tsx
import Image from 'next/image';

interface StoryItem {
  title: string;
  date?: string;
  description: string;
  pictures?: string[];
}

interface OurStorySectionProps {
  ourStory: StoryItem[];
  theme: {
    textColor: string;
    bgColor: string;
    accentColor: string;
    background: string;
  };
}

export default function OurStorySection({ ourStory, theme }: OurStorySectionProps) {
  return (
    <section
      id="ourstory"
      className="py-16 relative overflow-hidden" // Tambahkan relative dan overflow-hidden untuk overlay
      style={{ backgroundImage: `url(${theme.background})` }}
    >
      {/* Background overlay (optional, bisa dihapus jika tidak perlu) */}
      {/* <div
        className="absolute inset-0 bg-center bg-cover opacity-10 pointer-events-none z-0"
        style={{ backgroundImage: `url(${theme.background})` }}
      /> */}

      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-12">
        {/* Enhanced Section Title with decorative lines */}
        <div className="flex items-center justify-center mb-12">
          <span
            className="h-px flex-grow"
            style={{ backgroundColor: theme.accentColor, opacity: 0.5 }}
          />
          <h2
            className="mx-4 text-2xl font-bold whitespace-nowrap"
            style={{ color: theme.accentColor }}
          >
            ✨ Our Journey ✨
          </h2>
          <span
            className="h-px flex-grow"
            style={{ backgroundColor: theme.accentColor, opacity: 0.5 }}
          />
        </div>

        {/* Single-column story items */}
        <div className="grid grid-cols-1 gap-12">
          {ourStory.map((item, idx) => (
            <div key={idx} className="relative"> {/* Tambahkan relative di sini untuk positioning absolute pada tanggal */}
              {/* Card Title with underline accent */}
              <div className="mb-4">
                <h3
                  className="text-xl font-semibold inline-block relative pb-2"
                  style={{ color: theme.accentColor }}
                >
                  {item.title}
                  <span
                    className="absolute left-0 bottom-0 h-1 w-10"
                    style={{ backgroundColor: theme.accentColor }}
                  />
                </h3>
                {item.date && (
                  <span
                    className="absolute top-0 right-0 text-sm text-gray-600 italic" // Posisi tanggal di pojok kanan atas
                    style={{ color: theme.textColor }}
                  >
                    {item.date}
                  </span>
                )}
              </div>

              {/* Image with gradient overlay description */}
              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={item.pictures?.[0] || theme.background}
                  alt={item.title}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover"
                />
                <div className="absolute bottom-0 left-0 right-0 p-4 rounded-b-lg bg-gradient-to-t from-black/70 to-transparent">
                  <p
                    className="text-sm leading-relaxed"
                    style={{ color: theme.textColor }}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
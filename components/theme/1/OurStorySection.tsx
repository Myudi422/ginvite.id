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
      className="py-6 relative overflow-hidden"
      style={{ backgroundImage: `url(${theme.background})` }}
    >
      <div className="max-w-4xl mx-auto px-4 relative z-10 space-y-12">
        <div className="flex items-center justify-center mb-12">
          <span
            className="h-px flex-grow"
            style={{ backgroundColor: theme.accentColor, opacity: 0.5 }}
          />
          <h2
            className="mx-4 text-2xl font-bold whitespace-nowrap"
            style={{ color: theme.accentColor }}
          >
            ✨ Our Story ✨
          </h2>
          <span
            className="h-px flex-grow"
            style={{ backgroundColor: theme.accentColor, opacity: 0.5 }}
          />
        </div>

        <div className="grid grid-cols-1 gap-12">
          {ourStory.map((item, idx) => (
            <div key={idx} className="relative">
              <div className="mb-10">
                <h3
                  className="text-xl font-semibold inline-block relative"
                  style={{ color: theme.textColor }}
                >
                  <span
                    className="bg-white rounded-md px-4 py-2 z-0 relative"
                    style={{ backgroundColor: theme.accentColor, opacity: 0.8 }}
                  >
                    <span className="relative z-10" style={{ color: theme.textColor }}>{item.title}</span>
                  </span>
                </h3>
                {item.date && (
                  <span
                    className="absolute top-0 right-0 text-sm text-gray-600 italic"
                    style={{ color: theme.textColor }}
                  >
                    {item.date}
                  </span>
                )}
              </div>

              <div className="relative rounded-lg overflow-hidden shadow-lg">
                <Image
                  src={item.pictures?.[0] || theme.background}
                  alt={item.title}
                  width={800}
                  height={500}
                  className="w-full h-auto object-cover grayscale hover:grayscale-0 transition duration-300" // Pastikan kedua kelas ini ada
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
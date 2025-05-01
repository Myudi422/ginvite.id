// components/our-story/OurStorySection.tsx
import Image from 'next/image';

interface StoryItem {
  title: string;
  description: string;
  pictures?: string[];
}

interface OurStorySectionProps {
  ourStory: StoryItem[];
  theme: {
    accentColor: string;
    defaultBgImage: string;
  };
}

export default function OurStorySection({ ourStory, theme }: OurStorySectionProps) {
  return (
    <section
      id="ourstory"
      className="home-section"
      style={{
        background: `linear-gradient(rgba(255,255,255,0.97), rgba(255,255,255,0.95)), url(${theme.defaultBgImage})`,
      }}
    >
      <div className="home-inner">
        <h2 className="text-3xl font-bold mb-8 text-center" style={{ color: theme.accentColor }}>
          🌸 Kisah Kami 🌸
        </h2>
        <div className="space-y-12">
          {ourStory.map((item, idx) => (
            <div key={idx} className="flex flex-col">
              <div className="relative pl-5 mb-4">
                <span
                  className="absolute left-0 top-1 w-1 h-10 rounded-full"
                  style={{ backgroundColor: theme.accentColor }}
                />
                <h3 className="text-xl font-semibold text-gray-800">{item.title}</h3>
              </div>
              <p className="text-gray-600 leading-relaxed text-sm sm:text-base">
                {item.description}
              </p>
              {item.pictures?.[0] && (
                <div className="w-full mt-4 rounded-xl overflow-hidden shadow-md">
                  <Image
                    src={item.pictures[0]}
                    alt={item.title}
                    width={600}
                    height={400}
                    className="w-full h-48 sm:h-56 object-cover object-center"
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// components/invitation-text/InvitationTextSection.tsx
import React from 'react';

interface Theme {
  textColor: string;
  bgColor: string;
  accentColor: string;
  background: string;
}

interface InvitationTextSectionProps {
  invitation: string;
  theme: Theme;
}

export default function InvitationTextSection({ invitation, theme }: InvitationTextSectionProps) {
  return (
    <section
      id="invitation"
      className="py-6" // Mengganti home-section dengan padding yang lebih generik
      style={{backgroundImage: `url(${theme.background})` }} // Menggunakan background dari theme
    >
      <div className="max-w-3xl mx-auto px-6 text-center"> {/* Menambahkan centering dan max-width */}
        <div
          className="home-invitation"
          dangerouslySetInnerHTML={{ __html: invitation }}
          style={{ color: theme.accentColor }} // Menggunakan accentColor untuk warna teks
        />
      </div>
    </section>
  );
}
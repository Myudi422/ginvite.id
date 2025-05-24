// components/invitation-text/InvitationTextSection.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { sectionVariant, textVariant } from './animasi';

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
  const lines = invitation.split(/<br\s*\/?\>/g);

  return (
    <motion.section
      id="invitation"
      className="py-6"
      style={{
        backgroundImage: `url(${theme.background})`,
        backgroundSize: 'cover',
        backgroundRepeat: 'no-repeat',
      }}
      variants={sectionVariant}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.3 }}
    >
      <div className="max-w-3xl mx-auto px-6 text-center">
        {lines.map((line, idx) => (
          <motion.p
            key={idx}
            className="text-lg leading-relaxed"
            style={{ color: theme.accentColor, marginBottom: '0.5rem' }}
            variants={textVariant}
            custom={idx}
          >
            <span dangerouslySetInnerHTML={{ __html: line.trim() }} />
          </motion.p>
        ))}
      </div>
    </motion.section>
  );
}
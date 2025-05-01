// components/FooterSection.tsx

interface FooterSectionProps {
    textColor?: string;
  }
  
  export default function FooterSection({ textColor }: FooterSectionProps) {
    return (
      <footer className="text-center py-8 text-sm" style={{ color: textColor }}>
        <p>© ginvite.id – By PT DIGITAL INTER NUSA</p>
      </footer>
    );
  }
  
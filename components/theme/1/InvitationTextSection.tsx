// components/invitation-text/InvitationTextSection.tsx
export default function InvitationTextSection({ invitation }) {
    return (
      <section id="invitation" className="home-section" style={{ padding: '2rem 1rem' }}>
        <div className="home-inner">
          <div
            className="home-invitation"
            dangerouslySetInnerHTML={{ __html: invitation }}
          />
        </div>
      </section>
    );
  }
  
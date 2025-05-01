// components/important-event/ImportantEventSection.tsx
export default function ImportantEventSection({ quotes }) {
    return (
      <section id="important-event" className="home-section" style={{ padding: '2rem 1rem' }}>
        <div className="home-inner">
          <div className="home-important-event">
            <h2 className="home-important-event__title">Peristiwa Penting</h2>
            <p
              className="home-important-event__description"
              dangerouslySetInnerHTML={{
                __html: quotes.importantEvent.replace(/\n/g, '<br/>'),
              }}
            />
          </div>
        </div>
      </section>
    );
  }
  
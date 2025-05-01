// components/quote/QuoteSection.tsx
export default function QuoteSection({ quotes }) {
    return (
      <section id="quote" className="home-section" style={{ padding: '2rem 1rem' }}>
        <div className="home-inner">
          <div className="home-quote">
            <h2 className="home-quote__arabic">{quotes.arabic}</h2>
            <p className="home-quote__latin">{quotes.latin}</p>
          </div>
        </div>
      </section>
    );
  }
  
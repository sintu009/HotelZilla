const POSTS = [
  { title: 'Top 10 Budget Hotels in Goa for 2025', date: 'June 10, 2025', tag: 'Travel Tips', excerpt: 'Planning a Goa trip on a budget? We rounded up the best value stays near the beach.' },
  { title: 'How to Get the Best Hotel Deals on HotelZilla', date: 'May 22, 2025', tag: 'Guide', excerpt: 'From early bird discounts to last-minute offers, here\'s how to save on every booking.' },
  { title: 'Why Boutique Hotels Are Trending in India', date: 'April 15, 2025', tag: 'Trends', excerpt: 'Travelers are increasingly choosing unique, locally-owned stays over big chains. Here\'s why.' },
  { title: 'A Weekend Getaway Guide: Hill Stations Near Bangalore', date: 'March 30, 2025', tag: 'Destinations', excerpt: 'Coorg, Chikmagalur, Ooty — the best hill station escapes within 5 hours of Bangalore.' },
]

export default function Blog() {
  return (
    <div className="container" style={{ maxWidth: 800, padding: '48px 16px' }}>
      <h1>Blog</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: '1.05rem', marginBottom: 40 }}>Travel tips, destination guides, and hotel booking advice.</p>

      <div style={{ display: 'grid', gap: 24 }}>
        {POSTS.map(({ title, date, tag, excerpt }) => (
          <div key={title} style={{ border: '1px solid var(--border)', borderRadius: 12, padding: '20px 24px' }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 8 }}>
              <span style={{ background: 'var(--primary-light, #e0f2fe)', color: 'var(--primary)', fontSize: '0.75rem', fontWeight: 600, padding: '2px 10px', borderRadius: 20 }}>{tag}</span>
              <span style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}>{date}</span>
            </div>
            <h3 style={{ margin: '0 0 8px' }}>{title}</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', margin: 0 }}>{excerpt}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

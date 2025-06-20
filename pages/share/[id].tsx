import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import HighlightEditor from '../../components/HighlightEditor';

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;

  const [articleText, setArticleText] = useState('');
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    async function fetchShare() {
      try {
        setLoading(true);
        const res = await fetch(`/api/share/${id}`);
        const data = await res.json();
        if (data.url) {
          // Fetch parsed article text dynamically:
          const parsedRes = await fetch(`/api/parse?url=${encodeURIComponent(data.url)}`);
          const parsedData = await parsedRes.json();
          setArticleText(parsedData.article?.textContent || '');
          setHighlights(data.highlights);
        } else {
          setError('Invalid share data');
        }
      } catch {
        setError('Failed to load shared highlights');
      } finally {
        setLoading(false);
      }
    }
    fetchShare();
  }, [id]);

  if (loading) return <p>Loading shared highlights...</p>;
  if (error) return <p style={{ color: 'red' }}>{error}</p>;

  return (
    <div style={{ maxWidth: 900, margin: '2rem auto', padding: '0 1rem' }}>
      <h1>Shared Highlights</h1>
      <HighlightEditor articleText={articleText} initialHighlights={highlights} readOnly />
    </div>
  );
}

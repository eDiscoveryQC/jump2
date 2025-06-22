import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import HighlightEditor from '../../components/HighlightEditor'; // adjust path if needed
import styled from 'styled-components';

const PageContainer = styled.div`
  max-width: 900px;
  margin: 2rem auto;
  padding: 0 1rem;
  user-select: text;
`;

const Title = styled.h1`
  font-weight: 700;
  color: #1e4268;
  margin-bottom: 1.5rem;
  font-size: 2rem;
`;

const LoadingMessage = styled.p`
  font-style: italic;
  color: #64748b;
`;

const ErrorMessage = styled.p`
  color: #e55353;
  font-weight: 600;
`;

interface LegacyHighlight {
  id: string;
  text: string;
  start: number;
  end: number;
}

interface Highlight extends LegacyHighlight {
  color: string;
}

export default function SharePage() {
  const router = useRouter();
  const { id } = router.query;

  const [articleText, setArticleText] = useState('');
  const [highlights, setHighlights] = useState<Highlight[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || typeof id !== 'string') return;

    const fetchSharedData = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/share/${id}`);
        if (!res.ok) throw new Error('Failed to fetch shared highlights');
        const data = await res.json();

        setArticleText(data.articleText || '');
        const safeHighlights: Highlight[] = (data.highlights || []).map((h: LegacyHighlight) => ({
          ...h,
          color: '#ffe58a', // default color
        }));
        setHighlights(safeHighlights);
      } catch (err) {
        setError('Failed to load shared highlights. Please check the link or try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchSharedData();
  }, [id]);

  return (
    <PageContainer>
      <Title>Shared Highlights</Title>

      {loading && <LoadingMessage>Loading shared highlights...</LoadingMessage>}

      {error && <ErrorMessage role="alert">{error}</ErrorMessage>}

      {!loading && !error && (
        <HighlightEditor
          htmlContent={articleText}
          initialHighlights={highlights}
          readOnly
          sharing={false}
        />
      )}
    </PageContainer>
  );
}

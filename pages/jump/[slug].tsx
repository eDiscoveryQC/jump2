// pages/jump/[slug].tsx – Jump2 Viewer Page

import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 2rem;
  background: #f1f5f9;
  font-family: 'Segoe UI', sans-serif;
`;

const Frame = styled.iframe`
  width: 100%;
  max-width: 1000px;
  height: 80vh;
  border: 2px solid #cbd5e1;
  border-radius: 1rem;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.05);
`;

const Info = styled.div`
  margin-top: 1.5rem;
  text-align: center;
  color: #475569;
`;

export default function JumpViewer() {
  const router = useRouter();
  const { slug } = router.query;
  const [decoded, setDecoded] = useState({ url: '', jump: '' });

  useEffect(() => {
    if (slug && typeof slug === 'string') {
      const full = decodeURIComponent(slug);
      const [url, jump] = full.split('#');
      setDecoded({ url, jump });
    }
  }, [slug]);

  return (
    <Container>
      {decoded.url ? (
        <>
          <Frame src={decoded.url} allowFullScreen />
          <Info>
            <p>Jump target: <strong>{decoded.jump || 'Not specified'}</strong></p>
            <p>If the jump didn’t work, scroll to or search the keyword above manually.</p>
          </Info>
        </>
      ) : (
        <p>Loading...</p>
      )}
    </Container>
  );
}

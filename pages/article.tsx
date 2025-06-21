import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import styled from "styled-components";
import HighlightEditorLongTerm from "../components/HighlightEditorLongTerm"; // The component from the previous message

const PageContainer = styled.div`
  max-width: 960px;
  margin: 2rem auto;
  padding: 0 1rem;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
`;

const Header = styled.h1`
  color: #2563eb;
  font-weight: 700;
  margin-bottom: 1rem;
  text-align: center;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-style: italic;
`;

const ErrorMessage = styled.p`
  color: #dc2626;
  font-weight: 600;
  text-align: center;
  margin: 2rem 0;
`;

export default function ArticlePage() {
  const router = useRouter();
  const { url } = router.query;

  const [articleHtml, setArticleHtml] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!url || typeof url !== "string") return;

    setLoading(true);
    setError(null);

    fetch(`/api/parse?url=${encodeURIComponent(url)}`)
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch article");
        const data = await res.json();
        if (data.article?.content) {
          setArticleHtml(data.article.content);
        } else {
          throw new Error("Article content missing in response");
        }
      })
      .catch((err) => {
        console.error(err);
        setError("Failed to load article content.");
      })
      .finally(() => setLoading(false));
  }, [url]);

  return (
    <PageContainer>
      <Header>Article Highlights</Header>

      {loading && <LoadingMessage>Loading article...</LoadingMessage>}
      {error && <ErrorMessage>{error}</ErrorMessage>}

      {!loading && !error && articleHtml && (
        <HighlightEditorLongTerm htmlContent={articleHtml} />
      )}

      {!loading && !error && !articleHtml && (
        <ErrorMessage>No preview available for this link.</ErrorMessage>
      )}
    </PageContainer>
  );
}

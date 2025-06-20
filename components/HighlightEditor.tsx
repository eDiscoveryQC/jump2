// Add sharing to Props interface
interface Props {
  articleText: string;
  onShare?: (highlights: Highlight[]) => void;
  initialHighlights?: Highlight[];
  readOnly?: boolean;
  sharing?: boolean;  // <-- added here
}

export default function HighlightEditor({
  articleText,
  onShare,
  initialHighlights = [],
  readOnly = false,
  sharing = false,   // <-- added default
}: Props) {
  const [highlights, setHighlights] = React.useState<Highlight[]>(initialHighlights);

  React.useEffect(() => {
    setHighlights(initialHighlights);
  }, [initialHighlights]);

  // ... rest of your component unchanged ...

  return (
    <Container>
      <ArticleArea onMouseUp={addHighlight}>{renderHighlightedText()}</ArticleArea>
      <Sidebar>
        <h3>Highlights</h3>
        {highlights.length === 0 && <p>No highlights yet. Select text above to add.</p>}
        {highlights.map(h => (
          <HighlightItem key={h.id} title={h.text}>
            <span>{h.text}</span>
            {!readOnly && (
              <RemoveButton onClick={() => removeHighlight(h.id)} aria-label="Remove highlight">
                &times;
              </RemoveButton>
            )}
          </HighlightItem>
        ))}
        {!readOnly && highlights.length > 0 && (
          <Button 
            onClick={() => onShare && onShare(highlights)} 
            disabled={sharing}  // <-- disable while sharing
          >
            {sharing ? 'Generating...' : 'Generate Share Link'}
          </Button>
        )}
      </Sidebar>
    </Container>
  );
}

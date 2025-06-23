import styled from "styled-components";

const Wrapper = styled.div`
  background: rgba(16,23,45,0.97);
  border-radius: 1.15em;
  max-width: 780px;
  margin: 2em auto;
  padding: 2.8em 2em 2.3em 2em;
  box-shadow: 0 8px 32px 0 #1e293b33, 0 0 0 2.5px #2563eb77;
`;

const Headline = styled.h1`
  color: #ffe066;
  font-size: 2.1em;
  font-weight: 900;
  margin-bottom: 0.7em;
`;

const Section = styled.section`
  margin-bottom: 2.1em;
`;

const Step = styled.div`
  margin-bottom: 1.2em;
  font-size: 1.15em;
  font-weight: 600;
  color: #67b7fd;
`;

const Para = styled.p`
  margin-bottom: 1.3em;
  font-size: 1.1em;
`;

export default function HowItWorks() {
  return (
    <Wrapper>
      <Headline>How Jump2 Works</Headline>
      <Section>
        <Step>1. Highlight Anything</Step>
        <Para>
          Whether you’re reading an article, watching a YouTube video, or reviewing a document, just highlight the text or select the moment you want to share.
        </Para>
        <Step>2. Clip Instantly</Step>
        <Para>
          Click the Jump2 button to create a precise, shareable link—pointing right to your selection, even at a specific timestamp in a video.
        </Para>
        <Step>3. Share with Impact</Step>
        <Para>
          Send your Jump2 link anywhere: in chat, email, or on social. Recipients jump straight to what matters—no hunting, no scrolling.
        </Para>
      </Section>
      <Section>
        <Step>Supports All Kinds of Content</Step>
        <Para>
          - Articles and blogs<br/>
          - YouTube and other videos<br/>
          - Documents, PDFs, more!
        </Para>
      </Section>
      <Section>
        <Step>Smart Integrations</Step>
        <Para>
          Use our browser extension, web app, or integrate via API to bring Jump2’s clipping and sharing power anywhere you work.
        </Para>
      </Section>
    </Wrapper>
  );
}
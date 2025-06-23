import styled from "styled-components";

const PageBg = styled.div`
  min-height: 100vh;
  background: #0e1a2b;
  display: flex;
  flex-direction: column;
`;

const Wrapper = styled.div`
  background: rgba(16,23,45,0.97);
  border-radius: 1.15em;
  max-width: 780px;
  margin: 3.5em auto 2em;
  padding: 2.8em 2em 2.4em 2em;
  box-shadow: 0 8px 32px 0 #1e293b33, 0 0 0 2.5px #2563eb77;
  color: #eaf0fa;
  font-family: 'Inter', sans-serif;
`;

const Title = styled.h1`
  color: #67b7fd;
  font-size: 2.18em;
  font-weight: 900;
  margin-bottom: 0.7em;
`;

const Section = styled.section`
  margin: 1.8em 0 1.3em 0;
`;

const SectionTitle = styled.h2`
  color: #ffe066;
  font-size: 1.17em;
  font-weight: 800;
  margin-bottom: 0.5em;
`;

const Link = styled.a`
  color: #3b82f6;
  text-decoration: underline dotted;
  &:hover {
    text-decoration: underline solid;
    color: #ffd100;
  }
`;

export default function TermsPage() {
  return (
    <PageBg>
      <Wrapper>
        <Title>Terms of Service</Title>
        <p>
          Welcome to Jump2! By using our platform, you agree to the following terms. Please read them carefully. If you have any questions, contact us at <Link href="mailto:support@jump2share.com">support@jump2share.com</Link>.
        </p>
        <Section>
          <SectionTitle>Use of Service</SectionTitle>
          <ul>
            <li>Jump2 is designed to help you create, share, and access highlighted content in articles, YouTube videos, and more.</li>
            <li>Do not use Jump2 for unlawful, harmful, or abusive purposes. We reserve the right to suspend access for violations.</li>
            <li>You are responsible for the content you share via Jump2 links. Do not share copyrighted or confidential content without permission.</li>
          </ul>
        </Section>
        <Section>
          <SectionTitle>Intellectual Property</SectionTitle>
          <ul>
            <li>All Jump2 branding, code, and platform features are the property of Jump2, except for shared content which belongs to its original owners.</li>
            <li>You retain rights to your own content and highlights created on Jump2, but grant us permission to store and display shared content as part of the platform.</li>
          </ul>
        </Section>
        <Section>
          <SectionTitle>Disclaimer</SectionTitle>
          <ul>
            <li>Jump2 is provided “as is” and we strive for 99.9% uptime and reliability.</li>
            <li>We are not responsible for third-party content linked through the platform.</li>
            <li>We may update these terms from time to time. Material changes will be announced on this page.</li>
          </ul>
        </Section>
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <p>
            Reach us at <Link href="mailto:support@jump2share.com">support@jump2share.com</Link> for any questions, feedback, or legal inquiries.
          </p>
        </Section>
        <Section>
          <SectionTitle>Effective Date</SectionTitle>
          <p>
            These terms are effective as of June 23, 2025.
          </p>
        </Section>
      </Wrapper>
    </PageBg>
  );
}
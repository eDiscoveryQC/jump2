import Menu from "../components/Menu";
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

export default function PrivacyPage() {
  return (
    <PageBg>
      <Menu />
      <Wrapper>
        <Title>Privacy Policy</Title>
        <p>
          At Jump2, your privacy and trust are our top priorities. We are committed to protecting your personal information and being transparent about how we use it. This policy explains what data we collect, why we collect it, and how you can control your information.
        </p>
        <Section>
          <SectionTitle>Information We Collect</SectionTitle>
          <ul>
            <li><b>Links & Highlights:</b> When you use Jump2, we store links and highlight anchors you create, solely to enable sharing and platform features.</li>
            <li><b>Usage Data:</b> We collect minimal technical data (such as browser type, device, and usage patterns) to improve performance and reliability. We do <b>not</b> track your browsing history.</li>
            <li><b>No Ad Tracking:</b> We do not sell your data or serve third-party ads.</li>
          </ul>
        </Section>
        <Section>
          <SectionTitle>How We Use Your Data</SectionTitle>
          <ul>
            <li>To provide and improve Jump2’s core features, including link sharing, previews, and highlights.</li>
            <li>To ensure platform security, prevent abuse, and diagnose technical issues.</li>
            <li>To respond to your support requests and feedback.</li>
          </ul>
        </Section>
        <Section>
          <SectionTitle>Your Choices & Rights</SectionTitle>
          <ul>
            <li>You may request deletion of your data at any time by contacting us.</li>
            <li>We do not require account registration for core usage.</li>
            <li>We comply with applicable privacy laws, including GDPR and CCPA.</li>
          </ul>
        </Section>
        <Section>
          <SectionTitle>Contact</SectionTitle>
          <p>
            Questions or concerns? Email us at{" "}
            <Link href="mailto:support@jump2share.com">support@jump2share.com</Link>
            . We’re here to help.
          </p>
        </Section>
        <Section>
          <SectionTitle>Updates</SectionTitle>
          <p>
            We may update this policy to reflect best practices or regulatory changes. If material changes occur, we’ll notify users on this page.
          </p>
        </Section>
      </Wrapper>
    </PageBg>
  );
}
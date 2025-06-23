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

const StatusDot = styled.span<{ status: string }>`
  display: inline-block;
  width: 1em;
  height: 1em;
  margin-right: 0.6em;
  border-radius: 50%;
  background: ${({ status }) =>
    status === "operational" ? "#17f17e"
    : status === "degraded" ? "#ffe066"
    : "#f87171"};
  box-shadow: 0 0 8px ${({ status }) =>
    status === "operational" ? "#17f17e88"
    : status === "degraded" ? "#ffe06677"
    : "#f8717188"};
`;

const Section = styled.section`
  margin: 1.7em 0 1.2em 0;
`;

const ServiceList = styled.ul`
  margin: 0.7em 0 1.2em 1.1em;
  li {
    margin-bottom: 0.4em;
    font-size: 1.07em;
    color: #fff;
  }
`;

const FooterNote = styled.div`
  margin-top: 2.2em;
  font-size: 0.98em;
  color: #b3c8e4;
`;

export default function StatusPage() {
  // In production, you might fetch service status from your backend/status API.
  // For now, this is hardcoded to "operational". Change as needed!
  const status = "operational";
  return (
    <PageBg>
      <Menu />
      <Wrapper>
        <Title>
          <StatusDot status={status} /> Jump2 System Status
        </Title>
        <Section>
          <b>All systems operational.</b>
        </Section>
        <ServiceList>
          <li><StatusDot status={status} /> API: Operational</li>
          <li><StatusDot status={status} /> Link Shortener: Operational</li>
          <li><StatusDot status={status} /> Previews & Highlights: Operational</li>
          <li><StatusDot status={status} /> Dashboard: Operational</li>
        </ServiceList>
        <Section>
          We proactively monitor all core Jump2 services 24/7. If you encounter any issues, please email <a href="mailto:support@jump2share.com" style={{color:'#ffe066', fontWeight:700}}>support@jump2share.com</a>.
        </Section>
        <FooterNote>
          Last updated: {new Date().toLocaleString(undefined, { dateStyle: "long", timeStyle: "short" })}
        </FooterNote>
      </Wrapper>
    </PageBg>
  );
}
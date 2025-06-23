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
  padding: 2.8em 2em 2.2em 2em;
  box-shadow: 0 8px 32px 0 #1e293b33, 0 0 0 2.5px #2563eb77;
`;

const Title = styled.h1`
  color: #67b7fd;
  font-size: 2em;
  font-weight: 900;
  margin-bottom: 0.7em;
`;

const Para = styled.p`
  font-size: 1.12em;
  margin-bottom: 1.5em;
`;

const SocialLink = styled.a`
  color: #ffe066;
  font-weight: 700;
  text-decoration: none;
  &:hover, &:focus {
    text-decoration: underline;
  }
`;

export default function ContactPage() {
  return (
    <PageBg>
      <Menu />
      <Wrapper>
        <Title>Contact Us</Title>
        <Para>
          Have a question, feedback, or want to partner? Reach out to the Jump2 team!
        </Para>
        <Para>
          Connect via{" "}
          <SocialLink href="https://www.linkedin.com/company/jump2share/" target="_blank" rel="noopener noreferrer">
            LinkedIn
          </SocialLink>
          {" "}or{" "}
          <SocialLink href="https://x.com/jump2share" target="_blank" rel="noopener noreferrer">
            Twitter
          </SocialLink>
          .
        </Para>
        <Para>
          For support or inquiries, email us at <SocialLink href="mailto:hello@jump2.sh">hello@jump2.sh</SocialLink>.
        </Para>
      </Wrapper>
    </PageBg>
  );
}
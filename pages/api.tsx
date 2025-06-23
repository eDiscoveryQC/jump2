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
  padding: 2.7em 2em 2.3em 2em;
  box-shadow: 0 8px 32px 0 #1e293b33, 0 0 0 2.5px #2563eb77;
`;

const Title = styled.h1`
  color: #67b7fd;
  font-size: 2.13em;
  font-weight: 900;
  margin-bottom: 0.6em;
`;

const SubTitle = styled.h2`
  color: #ffe066;
  font-size: 1.17em;
  font-weight: 800;
  margin: 2em 0 0.7em 0;
`;

const List = styled.ul`
  margin-left: 1.2em;
  margin-bottom: 1.2em;
  li {
    margin-bottom: 0.5em;
    font-size: 1.05em;
  }
`;

const CTAButton = styled.a`
  display: inline-block;
  margin-top: 1.7em;
  padding: 0.78em 2.2em;
  background: linear-gradient(90deg, #3b82f6 10%, #2563eb 90%);
  color: #fff;
  font-weight: 800;
  border-radius: 0.7em;
  font-size: 1.14em;
  letter-spacing: 0.01em;
  box-shadow: 0 3px 16px #2563eb66;
  text-decoration: none;
  transition: background 0.13s, transform 0.12s;
  &:hover, &:focus {
    background: linear-gradient(90deg, #2563eb 10%, #3b82f6 90%);
    transform: scale(1.04);
    outline: none;
  }
`;

export default function ApiPage() {
  return (
    <PageBg>
      <Menu />
      <Wrapper>
        <Title>Jump2 API</Title>
        <p>
          Power up your platform by integrating Jump2’s smart content highlights. Our API makes it easy to extract, clip, and share key moments from articles, videos (including YouTube!), documents, and more.
        </p>
        <SubTitle>What You Can Do:</SubTitle>
        <List>
          <li>Extract highlights and generate shareable links via REST</li>
          <li>Retrieve user-generated clips from any article or video</li>
          <li>Embed Jump2’s magic into your apps and workflows</li>
        </List>
        <SubTitle>Get Started</SubTitle>
        <p>
          Ready to build? Check out our{" "}
          <a href="mailto:hello@jump2.sh" style={{color:'#ffe066', fontWeight:700}}>developer docs</a>
          {" "}or email us for API access.
        </p>
        <CTAButton href="mailto:hello@jump2.sh">
          Request API Access
        </CTAButton>
      </Wrapper>
    </PageBg>
  );
}
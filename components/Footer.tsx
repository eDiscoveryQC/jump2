import styled from "styled-components";

const FooterBar = styled.footer`
  width: 100%;
  background: rgba(16,23,45,0.97);
  color: #b8c6e4;
  text-align: center;
  padding: 1.2em 2em 1.2em 2em;
  font-size: 1.05em;
  margin-top: 2em;
  border-top: 1.5px solid #23305c;
`;

const SocialLinks = styled.div`
  margin-bottom: 0.5em;
  a {
    color: #67b7fd;
    margin: 0 0.7em;
    font-weight: 700;
    text-decoration: none;
    &:hover, &:focus {
      text-decoration: underline;
      color: #ffe066;
    }
  }
`;

export default function Footer() {
  return (
    <FooterBar>
      <SocialLinks>
        <a href="https://www.linkedin.com/company/jump2share/" target="_blank" rel="noopener noreferrer">
          LinkedIn
        </a>
        <a href="https://x.com/jump2share" target="_blank" rel="noopener noreferrer">
          Twitter
        </a>
      </SocialLinks>
      &copy; {new Date().getFullYear()} Jump2. All rights reserved.
    </FooterBar>
  );
}
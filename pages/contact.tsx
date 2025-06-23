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
  transition: color 0.16s, text-decoration 0.16s;
  &:hover, &:focus {
    text-decoration: underline;
    color: #67b7fd;
    outline: none;
  }
`;

const IconList = styled.div`
  margin: 2em 0 1em 0;
  display: flex;
  gap: 1.6em;
  align-items: center;
  justify-content: flex-start;
  a {
    display: inline-flex;
    align-items: center;
    font-size: 1.16em;
    color: #3b82f6;
    font-weight: 700;
    gap: 0.5em;
    background: #1e293b;
    padding: 0.43em 1em 0.43em 0.9em;
    border-radius: 0.7em;
    text-decoration: none;
    transition: background 0.14s, color 0.16s, box-shadow 0.14s;
    box-shadow: 0 1px 8px #0ea5e933;
    &:hover, &:focus {
      background: #ffe066;
      color: #223050;
      box-shadow: 0 6px 22px #ffe06655;
      outline: 2px solid #67b7fd44;
    }
    svg {
      font-size: 1.32em;
    }
  }
`;

export default function ContactPage() {
  return (
    <PageBg>
      <Wrapper>
        <Title>Contact Us</Title>
        <Para>
          Have a question, feedback, or want to partner? Reach out to the Jump2 team!
        </Para>
        <IconList>
          <a href="mailto:support@jump2share.com" aria-label="Email">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M6 8v8h12V8H6Zm10 0-4 3.5L8 8" stroke="#fff" strokeWidth="1.3" strokeLinejoin="round"/></svg>
            Email
          </a>
          <a href="https://www.linkedin.com/company/jump2share/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M7.75 8.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5ZM7 10h1.5v6H7v-6Zm3.75 0h1.43v.82h.02c.2-.36.7-.82 1.47-.82 1.57 0 1.86.99 1.86 2.27V16H15V12.5c0-.84-.01-1.91-1.16-1.91-1.16 0-1.34.91-1.34 1.85V16h-1.5v-6Z" fill="#fff"/></svg>
            LinkedIn
          </a>
          <a href="https://x.com/jump2share" target="_blank" rel="noopener noreferrer" aria-label="Twitter / X">
            <svg width="1em" height="1em" viewBox="0 0 24 24" fill="none"><rect width="24" height="24" rx="5" fill="#67b7fd"/><path d="M17.8 7H15.6l-2.1 2.8L11.4 7H9.2l2.9 4.1L9 17h2.2l1.8-2.5 1.8 2.5H17l-3.1-4.3L17.8 7Zm-4.1 6.7-.6-.8-1.7-2.3h1.1l1.2 1.6 1.2-1.6h1.1l-1.7 2.3-.6.8Z" fill="#fff"/></svg>
            Twitter
          </a>
        </IconList>
        <Para>
          For direct support or inquiries, just email us at <SocialLink href="mailto:support@jump2share.com">support@jump2share.com</SocialLink>.<br />
          We respond fast!
        </Para>
      </Wrapper>
    </PageBg>
  );
}
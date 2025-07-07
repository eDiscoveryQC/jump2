// styles/metaHomeStyles.tsx — Final Meta-Style + Mobile Responsive

import styled from "styled-components";
import { motion } from "framer-motion";

// Reusable breakpoint
const breakpoints = {
  sm: "640px",
  md: "768px"
};

export const Hero = styled(motion.section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 5rem 1.5rem 6rem;
  background: linear-gradient(to right, #0f172a, #1e293b);
  color: #ffffff;

  @media (max-width: ${breakpoints.sm}) {
    padding: 3rem 1rem 4rem;
  }
`;

export const Logo = styled(motion.h1)`
  font-size: 3.6rem;
  font-weight: 900;
  letter-spacing: -1.4px;
  margin-bottom: 1.4rem;
  color: #facc15;
  text-shadow: 0 2px 6px #0ea5e9aa;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 2.4rem;
  }
`;

export const Subtitle = styled.p`
  font-size: 1.4rem;
  font-weight: 400;
  max-width: 600px;
  margin-bottom: 2rem;
  line-height: 1.6;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 1.1rem;
    padding: 0 1rem;
  }
`;

export const CTAGroup = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
  margin-bottom: 2.4rem;
  justify-content: center;

  a.primary {
    background: #8b5cf6;
    color: #fff;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 600;
    text-decoration: none;
    transition: background 0.3s ease;
    &:hover {
      background: #7c3aed;
    }
  }

  a.secondary {
    background: transparent;
    color: #e2e8f0;
    border: 1px solid #64748b;
    padding: 0.75rem 1.5rem;
    border-radius: 8px;
    font-weight: 500;
    text-decoration: none;
    transition: border 0.3s ease, color 0.3s ease;
    &:hover {
      color: #fff;
      border-color: #fff;
    }
  }

  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;

    a {
      width: 100%;
      text-align: center;
    }
  }
`;

export const SearchBar = styled.input`
  margin-top: 1rem;
  padding: 0.75rem 1.25rem;
  border-radius: 10px;
  border: none;
  max-width: 420px;
  width: 100%;
  font-size: 1rem;
  box-shadow: 0 0 0 1px #334155;
  background: #1e293b;
  color: #e2e8f0;

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.95rem;
    padding: 0.65rem 1rem;
  }
`;

export const Section = styled(motion.section)`
  padding: 4rem 1.5rem;
  text-align: center;

  @media (max-width: ${breakpoints.sm}) {
    padding: 3rem 1rem;
  }
`;

export const Heading = styled.h2`
  font-size: 2rem;
  margin-bottom: 1rem;
  color: #f8fafc;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 1.6rem;
  }
`;

export const Text = styled.p`
  font-size: 1.1rem;
  color: #cbd5e1;
  max-width: 660px;
  margin: 0 auto 2rem;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 1rem;
  }
`;

export const StatBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2rem;
  align-items: center;
  font-size: 1.15rem;
  color: #e0f2fe;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 1rem;
    gap: 0.75rem;
  }
`;

export const StatItem = styled.div`
  display: flex;
  gap: 0.4rem;
  align-items: center;
  font-weight: 500;
`;

export const VideoPreview = styled.div`
  max-width: 800px;
  margin: 0 auto;
  border-radius: 14px;
  overflow: hidden;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
  video {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const Footer = styled.footer`
  padding: 3rem 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #94a3b8;
  background: #0f172a;
  line-height: 1.6;
`;

export const HelpBeacon = styled.button`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background: #38bdf8;
  color: #0f172a;
  font-size: 1.3rem;
  padding: 0.6rem 1rem;
  border: none;
  border-radius: 50px;
  box-shadow: 0 4px 14px rgba(0, 0, 0, 0.3);
  cursor: pointer;
  z-index: 9999;
  &:hover {
    background: #0ea5e9;
  }
`;

export const HelpModal = styled.div`
  position: fixed;
  bottom: 4.5rem;
  right: 1.5rem;
  background: #1e293b;
  color: #f1f5f9;
  padding: 1.2rem 1.4rem;
  border-radius: 12px;
  max-width: 300px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.4);
  font-size: 0.95rem;
  line-height: 1.6;
  z-index: 10000;
  a {
    color: #38bdf8;
    text-decoration: underline;
    &:hover {
      color: #0ea5e9;
    }
  }
`;

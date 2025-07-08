// styles/metaHomeStyles.ts — ✨ Meta-Perfect UI/UX Styling

import styled from "styled-components";
import { motion } from "framer-motion";

// Breakpoints
const breakpoints = {
  sm: "640px",
  md: "768px",
  lg: "1024px",
};

// 🎯 Hero Section
export const Hero = styled(motion.section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 6rem 2rem 7rem;
  background: linear-gradient(135deg, #0f172a, #1e293b);
  text-align: center;
  color: #ffffff;

  @media (max-width: ${breakpoints.sm}) {
    padding: 3.5rem 1.25rem 5rem;
  }
`;

// 🟡 Logo Heading
export const Logo = styled(motion.h1)`
  font-size: 3.8rem;
  font-weight: 900;
  letter-spacing: -1.5px;
  color: #facc15;
  text-shadow: 0 3px 10px rgba(14, 165, 233, 0.7);
  margin-bottom: 1.5rem;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 2.6rem;
  }
`;

// 🧾 Subtitle Text
export const Subtitle = styled.p`
  font-size: 1.5rem;
  font-weight: 400;
  max-width: 640px;
  line-height: 1.65;
  color: #e2e8f0;
  margin-bottom: 2.5rem;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 1.15rem;
    padding: 0 1rem;
  }
`;

// 🔎 Search Input
export const SearchBar = styled.input`
  margin-top: 1rem;
  padding: 0.8rem 1.3rem;
  border-radius: 10px;
  max-width: 420px;
  width: 100%;
  font-size: 1rem;
  background: #1e293b;
  color: #e2e8f0;
  border: none;
  box-shadow: 0 0 0 1px #334155;

  &::placeholder {
    color: #94a3b8;
  }

  @media (max-width: ${breakpoints.sm}) {
    font-size: 0.95rem;
    padding: 0.65rem 1rem;
  }
`;

// 🧭 CTA Buttons
export const CTA = styled.a`
  background: #8b5cf6;
  color: #ffffff;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 600;
  text-decoration: none;
  transition: background 0.3s ease;
  &:hover {
    background: #7c3aed;
  }
`;

export const SecondaryCTA = styled.a`
  background: transparent;
  color: #e2e8f0;
  border: 1px solid #64748b;
  padding: 0.75rem 1.5rem;
  border-radius: 10px;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.3s ease;
  &:hover {
    color: #ffffff;
    border-color: #ffffff;
  }
`;

export const ButtonGroup = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
  justify-content: center;
  margin: 2rem 0;

  @media (max-width: ${breakpoints.sm}) {
    flex-direction: column;
    align-items: stretch;

    a {
      width: 100%;
      text-align: center;
    }
  }
`;

// 🧠 Section Layout
export const Section = styled(motion.section)`
  padding: 5rem 2rem;
  text-align: center;
  background: #0f172a;

  @media (max-width: ${breakpoints.sm}) {
    padding: 3rem 1.25rem;
  }
`;

export const Heading = styled.h2`
  font-size: 2.2rem;
  color: #f8fafc;
  margin-bottom: 1rem;

  @media (max-width: ${breakpoints.sm}) {
    font-size: 1.75rem;
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

// 📊 Stats
export const StatBarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-top: 2.5rem;
  align-items: center;
  color: #e0f2fe;
  font-size: 1.15rem;

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

// 🎥 Video Preview
export const VideoPreview = styled.div`
  max-width: 800px;
  margin: 0 auto;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);

  video {
    width: 100%;
    height: auto;
    display: block;
  }
`;

// 🦶 Footer
export const Footer = styled.footer`
  background: #0f172a;
  padding: 3rem 1.5rem;
  text-align: center;
  color: #94a3b8;
  font-size: 0.95rem;
  line-height: 1.6;
`;

// 🆘 Help Button + Modal
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
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  max-width: 320px;
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.4);
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

// styles/metaHomeStyles.tsx

import styled from "styled-components";
import { motion } from "framer-motion";

export const Hero = styled(motion.section)`
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 8rem 2rem 4rem;
  background: radial-gradient(circle at top left, #0f172a, #1e293b);
  color: #ffffff;
  min-height: 100vh;

  @media (max-width: 768px) {
    padding: 6rem 1.2rem 3rem;
  }
`;

export const Logo = styled(motion.h1)`
  font-size: 3.8rem;
  font-weight: 900;
  letter-spacing: -1px;
  color: #facc15;
  text-shadow: 0 4px 8px rgba(14, 165, 233, 0.4);

  @media (max-width: 768px) {
    font-size: 2.8rem;
  }
`;

export const Subtitle = styled.h2`
  font-size: 1.5rem;
  max-width: 700px;
  margin: 1.4rem auto 2rem;
  color: #cbd5e1;
  font-weight: 500;

  @media (max-width: 768px) {
    font-size: 1.25rem;
  }
`;

export const CTAGroup = styled.div`
  display: flex;
  gap: 1.2rem;
  margin-top: 1.5rem;

  a {
    padding: 0.9rem 1.6rem;
    border-radius: 999px;
    font-weight: 600;
    font-size: 1rem;
    transition: all 0.3s ease;
    text-decoration: none;

    &.primary {
      background: #6366f1;
      color: white;
      &:hover {
        background: #4f46e5;
        transform: scale(1.05);
      }
    }

    &.secondary {
      background: transparent;
      color: #cbd5e1;
      border: 1px solid #475569;
      &:hover {
        background: #334155;
        transform: scale(1.05);
      }
    }
  }

  @media (max-width: 480px) {
    flex-direction: column;
    width: 100%;
    a {
      width: 100%;
      text-align: center;
    }
  }
`;

export const SearchBar = styled.input`
  margin-top: 2rem;
  padding: 1rem 1.4rem;
  width: 100%;
  max-width: 460px;
  border-radius: 999px;
  font-size: 1rem;
  border: none;
  outline: none;
  background-color: #1e293b;
  color: #f1f5f9;
  box-shadow: 0 0 0 1px #334155;

  &::placeholder {
    color: #94a3b8;
  }

  &:focus {
    box-shadow: 0 0 0 2px #3b82f6;
  }
`;

export const Section = styled(motion.section)`
  padding: 5rem 2rem;
  text-align: center;

  @media (max-width: 768px) {
    padding: 4rem 1rem;
  }
`;

export const Heading = styled.h3`
  font-size: 2.2rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 1rem;

  @media (max-width: 768px) {
    font-size: 1.8rem;
  }
`;

export const Text = styled.p`
  font-size: 1.1rem;
  color: #cbd5e1;
  max-width: 660px;
  margin: 0 auto 2rem;
`;

export const StatBar = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  font-size: 1.2rem;
  color: #f8fafc;
  font-weight: 600;
`;

export const VideoPreview = styled.div`
  margin: 2rem auto 3rem;
  max-width: 640px;
  border-radius: 1rem;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.4);

  video {
    width: 100%;
    height: auto;
    display: block;
  }
`;

export const Footer = styled.footer`
  text-align: center;
  padding: 3rem 1rem;
  background: #0f172a;
  color: #94a3b8;
  font-size: 0.95rem;
`;

export const HelpBeacon = styled.button`
  position: fixed;
  bottom: 1.8rem;
  right: 1.8rem;
  background: #0ea5e9;
  color: white;
  border: none;
  border-radius: 999px;
  padding: 0.8rem 1.2rem;
  font-weight: 600;
  font-size: 1rem;
  box-shadow: 0 8px 20px rgba(14, 165, 233, 0.5);
  cursor: pointer;
  transition: background 0.3s ease;

  &:hover {
    background: #0284c7;
  }

  @media (max-width: 480px) {
    font-size: 0.85rem;
    padding: 0.6rem 1rem;
  }
`;

export const HelpModal = styled.div`
  position: fixed;
  bottom: 5.2rem;
  right: 1.8rem;
  background: #1e293b;
  padding: 1.2rem 1.4rem;
  border-radius: 1rem;
  color: #f8fafc;
  width: 300px;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.6);
  font-size: 0.95rem;
  z-index: 999;

  a {
    color: #3b82f6;
    text-decoration: underline;
    font-weight: 500;
  }
`;

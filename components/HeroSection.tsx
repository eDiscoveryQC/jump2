// components/HeroSection.tsx — Meta-Style Hero Component

import React from "react";
import { Hero, Logo, Subtitle, CTAGroup, SearchBar } from "../styles/metaHomeStyles";

const HeroSection = () => {
  return (
    <Hero>
      <Logo
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Jump2
      </Logo>
      <Subtitle>Share the moment — not the mess. Welcome to Share-Tech.</Subtitle>
      <CTAGroup>
        <a href="/share" className="primary" aria-label="Create a Jump2 link">
          Create a Jump2
        </a>
        <a href="/contact" className="secondary" aria-label="Contact support">
          Contact
        </a>
      </CTAGroup>
      <SearchBar placeholder="🔍 Try 'Taylor Swift quote'..." aria-label="Jump2 smart search" />
    </Hero>
  );
};

export default HeroSection;

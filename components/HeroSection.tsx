// components/HeroSection.tsx — Final Meta-Grade Hero Component (Full Polish)

import React from "react";
import { useSpring, animated } from "@react-spring/web";
import {
  Hero,
  Logo,
  Subtitle,
  CTAGroup,
  SearchBar,
  StatBarWrapper,
  StatItem
} from "../styles/metaHomeStyles";
import LightToggle from "./LightToggle";

const HeroSection = () => {
  const stats = [
    { label: "Jump2s created this week", value: 1187542 },
    { label: "Countries active", value: 102 },
    { label: "Creator accounts", value: 83241 }
  ];

  const animatedStats = stats.map(stat =>
    useSpring({ from: { val: 0 }, to: { val: stat.value }, config: { duration: 1200 } })
  );

  return (
    <Hero>
      <Logo
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7 }}
      >
        Jump2
      </Logo>
      <Subtitle>
        Share the moment — not the mess. Welcome to Share-Tech.
      </Subtitle>
      <CTAGroup>
        <a href="/share" className="primary" aria-label="Create a Jump2 link">
          🚀 Create a Jump2
        </a>
        <a href="/contact" className="secondary" aria-label="Contact support">
          💬 Contact
        </a>
        <LightToggle />
      </CTAGroup>
      <SearchBar
        placeholder="🔍 Try 'Taylor Swift quote' or 'YouTube timestamp'..."
        aria-label="Jump2 smart search"
      />
      <StatBarWrapper>
        {animatedStats.map((style, index) => (
          <StatItem key={index}>
            <strong>
              <animated.span>
                {style.val.to(val => Math.floor(val).toLocaleString())}
              </animated.span>
            </strong>{" "}
            {stats[index].label}
          </StatItem>
        ))}
      </StatBarWrapper>
    </Hero>
  );
};

export default HeroSection;

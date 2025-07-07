// components/StatBarSection.tsx — Meta-Style Animated Stat Bar

import React from "react";
import { useSpring, animated } from "@react-spring/web";
import { Section, Heading, Text, StatBar } from "../styles/metaHomeStyles";

const stats = [
  { label: "Jump2s created this week", value: 1187542 },
  { label: "Countries active", value: 102 },
  { label: "Creator accounts", value: 83241 }
];

const StatBarSection = () => {
  const animatedCounters = stats.map(stat =>
    useSpring({ from: { val: 0 }, to: { val: stat.value }, config: { duration: 1200 } })
  );

  return (
    <Section
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
    >
      <Heading>Jump2 Momentum</Heading>
      <Text>We're building the new layer of the internet — one highlight at a time.</Text>
      <StatBar>
        {animatedCounters.map((props, i) => (
          <animated.div key={i} style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
            <animated.span>
              {props.val.to(val => `${Math.floor(val).toLocaleString()}`)}
            </animated.span>
            <span>{stats[i].label}</span>
          </animated.div>
        ))}
      </StatBar>
    </Section>
  );
};

export default StatBarSection;

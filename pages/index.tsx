// pages/index.tsx — Meta-Grade Unicorn Home v13.0+ (Production Ready)

import React, { useState } from "react";
import Head from "next/head";
import Lottie from "lottie-react";
import animationData from "../public/animated-preview.json";
import { useSpring, animated } from "@react-spring/web";
import {
  Hero,
  Logo,
  Subtitle,
  CTAGroup,
  Section,
  Heading,
  Text,
  StatBar,
  VideoPreview,
  Footer,
  SearchBar,
  HelpBeacon,
  HelpModal
} from "../styles/metaHomeStyles";

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);

  const stats = [
    { label: "Jump2s created this week", value: 1187542 },
    { label: "Countries active", value: 102 },
    { label: "Creator accounts", value: 83241 }
  ];

  const animatedCounters = stats.map(stat =>
    useSpring({ from: { val: 0 }, to: { val: stat.value }, config: { duration: 1200 } })
  );

  return (
    <>
      <Head>
        <title>Jump2 — The First Share-Tech Company</title>
        <meta name="description" content="Jump2 lets you highlight, timestamp, and share the exact moment that matters." />
        <meta property="og:image" content="https://jump2share.com/og-image.jpg" />
        <meta property="og:title" content="Jump2 — Share the Moment, Not the Mess" />
        <meta property="og:description" content="Create viral links from quotes, timestamps, and memes — Jump2 is your toolkit for sharing smarter." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

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
          <a href="/share" className="primary" aria-label="Create a Jump2 link">Create a Jump2</a>
          <a href="/contact" className="secondary" aria-label="Contact support">Contact</a>
        </CTAGroup>
        <SearchBar placeholder="🔍 Try 'Taylor Swift quote'..." aria-label="Jump2 smart search" />
      </Hero>

      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Heading>Jump2 Momentum</Heading>
        <Text>We're building the new layer of the internet — one highlight at a time.</Text>
        <StatBar>
          {animatedCounters.map((props, i) => (
            <animated.div key={i}>{props.val.to(val => Math.floor(val).toLocaleString())} {stats[i].label}</animated.div>
          ))}
        </StatBar>
      </Section>

      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Heading>Product in Action</Heading>
        <VideoPreview>
          <video src="/preview.mp4" autoPlay muted loop playsInline />
        </VideoPreview>
      </Section>

      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Heading>Interactive Visual</Heading>
        <Lottie animationData={animationData} style={{ maxWidth: 520, margin: "0 auto" }} />
      </Section>

      <Footer>
        <div><strong>Jump2 — The First Share-Tech Company</strong></div>
        <div style={{ marginTop: "0.6rem" }}>support@jump2share.com | GitHub | Terms</div>
      </Footer>

      <HelpBeacon onClick={() => setShowHelp(!showHelp)} aria-label="Open help dialog">💬 Help</HelpBeacon>
      {showHelp && (
        <HelpModal>
          Need help? Contact us at <strong>support@jump2share.com</strong> or try our <a href="/contact">contact form</a>.
        </HelpModal>
      )}
    </>
  );
}

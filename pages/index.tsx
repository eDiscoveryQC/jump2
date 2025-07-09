// pages/index.tsx — Meta-Grade Homepage with Layout Integration

import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import {
  Hero,
  Logo,
  Subtitle,
  ButtonGroup,
  CTAGroup,
  Section,
  Heading,
  Text,
  FeatureGrid,
  FeatureCard,
  TimelineVisualizer,
  VideoPreview,
  HelpBeacon,
  HelpModal,
} from "../styles/metaHomeStyles";

const LightToggle = dynamic(() => import("../components/LightToggle"), { ssr: false });

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <Layout>
      <Head>
        <title>Jump2 — The First Share-Tech Company</title>
        <meta
          name="description"
          content="Jump2 lets you highlight, timestamp, and share the exact moment that matters."
        />
        <meta property="og:title" content="Jump2 — Share the Moment, Not the Mess" />
        <meta
          property="og:description"
          content="Create viral links from quotes, timestamps, and memes — Jump2 is your toolkit for sharing smarter."
        />
        <meta property="og:image" content="https://jump2share.com/og-image.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Hero Section */}
      <Hero
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Logo>Jump2</Logo>
        <Subtitle>Smart links for the moments that matter — not the whole thing.</Subtitle>
        <ButtonGroup>
          <a className="primary" href="/share">
            Try Jump2 Free
          </a>
          <a className="secondary" href="#demo">
            See How It Works
          </a>
        </ButtonGroup>
      </Hero>

      {/* What is Share-Tech */}
      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading>What is Share-Tech?</Heading>
        <Text>
          Jump2 created the world’s first Share-Tech platform — tools built to share moments, not media dumps.
        </Text>
        <TimelineVisualizer />
      </Section>

      {/* Tools & Features Section */}
      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading>Powered by Jump2</Heading>
        <FeatureGrid>
          <FeatureCard icon="🖍️" title="Highlight Link" />
          <FeatureCard icon="⏱️" title="Timestamp Link" />
          <FeatureCard icon="🧠" title="Meme Generator" />
          <FeatureCard icon="🌐" title="Chrome Extension" />
          <FeatureCard icon="📊" title="Smart Dashboard" />
        </FeatureGrid>
      </Section>

      {/* Creator Personalization */}
      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading>Make Every Link Yours</Heading>
        <Text>
          Customize your smart links with personal styles, branded handles, and creator-first design.
        </Text>
      </Section>

      {/* Growth Loop Section */}
      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading>Built for Growth</Heading>
        <Text>
          Every tool includes built-in share loops, meme virality, and click insights.
        </Text>
        <FeatureGrid>
          <FeatureCard icon="📈" title="Share Analytics" />
          <FeatureCard icon="🔁" title="Re-share Tools" />
          <FeatureCard icon="💥" title="Auto-Meme Watermarking" />
        </FeatureGrid>
      </Section>

      {/* Final CTA */}
      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <Heading>Start sharing like it’s 2025.</Heading>
        <ButtonGroup>
          <a className="primary" href="/share">
            Join Beta
          </a>
          <a className="secondary" href="#demo">
            Watch Demo
          </a>
        </ButtonGroup>
      </Section>

      {/* Help Button + Modal */}
      <HelpBeacon onClick={() => setShowHelp(!showHelp)} aria-label="Open help dialog">
        💬 Help
      </HelpBeacon>

      {showHelp && (
        <HelpModal>
          Need help? Contact us at <strong>support@jump2share.com</strong> or try our{" "}
          <a href="/contact">contact form</a>.
        </HelpModal>
      )}
    </Layout>
  );
}

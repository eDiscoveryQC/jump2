// pages/index.tsx — Meta-Grade Homepage with Layout Integration

import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Layout from "../components/Layout";
import {
  Section,
  Heading,
  Text,
  ButtonGroup,
  CTA,
  SecondaryCTA,
  FeatureGrid,
  FeatureCard,
  TimelineVisualizer,
  VideoPreview,
  HelpBeacon,
  HelpModal
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
      <Section>
        <Heading>Share Smarter. Jump2 It.</Heading>
        <Text>
          Smart links for the moments that matter — not the whole thing.
        </Text>
        <ButtonGroup>
          <CTA href="/share">Try Jump2 Free</CTA>
          <SecondaryCTA href="#demo">See How It Works</SecondaryCTA>
        </ButtonGroup>
      </Section>

      {/* What is Share-Tech */}
      <Section>
        <Heading>What is Share-Tech?</Heading>
        <Text>
          Jump2 created the world’s first Share-Tech platform — tools built to share moments, not media dumps.
        </Text>
        <TimelineVisualizer />
      </Section>

      {/* Tools & Features Section */}
      <Section>
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
      <Section>
        <Heading>Make Every Link Yours</Heading>
        <Text>
          Customize your smart links with personal styles, branded handles, and creator-first design.
        </Text>
      </Section>

      {/* Growth Loop Section */}
      <Section>
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
      <Section>
        <Heading>Start sharing like it’s 2025.</Heading>
        <ButtonGroup>
          <CTA href="/share">Join Beta</CTA>
          <SecondaryCTA href="#demo">Watch Demo</SecondaryCTA>
        </ButtonGroup>
      </Section>

      {/* Help Floating Button */}
      <HelpBeacon onClick={() => setShowHelp(!showHelp)} aria-label="Open help dialog">
        💬 Help
      </HelpBeacon>

      {/* Help Modal */}
      {showHelp && (
        <HelpModal>
          Need help? Contact us at <strong>support@jump2share.com</strong> or try our{" "}
          <a href="/contact">contact form</a>.
        </HelpModal>
      )}
    </Layout>
  );
}

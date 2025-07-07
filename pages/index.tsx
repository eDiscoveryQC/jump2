// pages/index.tsx — Meta-Level Homepage

import React, { useState } from "react";
import Head from "next/head";
import dynamic from "next/dynamic";
import Lottie from "lottie-react";
import animationData from "../public/animated-preview.json";
import {
  Section,
  Heading,
  Text,
  VideoPreview,
  Footer,
  HelpBeacon,
  HelpModal
} from "../styles/metaHomeStyles";
import HeroSection from "../components/HeroSection";

const LightToggle = dynamic(() => import("../components/LightToggle"), { ssr: false });

export default function Home() {
  const [showHelp, setShowHelp] = useState(false);

  return (
    <>
      <Head>
        <title>Jump2 — The First Share-Tech Company</title>
        <meta name="description" content="Jump2 lets you highlight, timestamp, and share the exact moment that matters." />
        <meta property="og:title" content="Jump2 — Share the Moment, Not the Mess" />
        <meta property="og:description" content="Create viral links from quotes, timestamps, and memes — Jump2 is your toolkit for sharing smarter." />
        <meta property="og:image" content="https://jump2share.com/og-image.jpg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </Head>

      {/* Hero Section with full motion */}
      <HeroSection />

      {/* Section: Product Video */}
      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <Heading>Product in Action</Heading>
        <VideoPreview>
          <video src="/preview.mp4" autoPlay muted loop playsInline />
        </VideoPreview>
      </Section>

      {/* Section: Interactive Lottie */}
      <Section
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        <Heading>Live Interactive Preview</Heading>
        <Lottie
          animationData={animationData}
          style={{ maxWidth: 520, margin: "0 auto" }}
        />
      </Section>

      {/* Footer */}
      <Footer>
        <div><strong>Jump2 — The First Share-Tech Company</strong></div>
        <div style={{ marginTop: "0.6rem" }}>
          support@jump2share.com | GitHub | Terms
        </div>
      </Footer>

      {/* Help Floating Button */}
      <HelpBeacon onClick={() => setShowHelp(!showHelp)} aria-label="Open help dialog">
        💬 Help
      </HelpBeacon>

      {/* Help Modal */}
      {showHelp && (
        <HelpModal>
          Need help? Contact us at <strong>support@jump2share.com</strong> or try our <a href="/contact">contact form</a>.
        </HelpModal>
      )}
    </>
  );
}

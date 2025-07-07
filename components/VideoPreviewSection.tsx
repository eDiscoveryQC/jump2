// components/VideoPreviewSection.tsx — Meta-Style Interactive Preview

import React from "react";
import { VideoPreview } from "../styles/metaHomeStyles";

const VideoPreviewSection = () => {
  return (
    <VideoPreview initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
      <video
        src="/demo-preview.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{
          maxWidth: "100%",
          borderRadius: "1.2rem",
          boxShadow: "0 6px 24px rgba(0,0,0,0.3)",
          border: "2px solid #3f3f46"
        }}
        aria-label="Jump2 demo video preview"
      />
    </VideoPreview>
  );
};

export default VideoPreviewSection;

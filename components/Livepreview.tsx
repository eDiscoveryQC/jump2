import React from "react";
import styled, { keyframes } from "styled-components";
import { motion } from "framer-motion";
import { FaEye, FaFileAlt, FaLink } from "react-icons/fa";

const shimmer = keyframes`
  0% { background-position: -400px 0; }
  100% { background-position: 400px 0; }
`;

const PreviewWrapper = styled(motion.div)`
  width: 100%;
  max-width: 900px;
  margin: 2rem auto;
  padding: 2rem;
  background: #0f172a;
  border: 1px solid #1e293b;
  border-radius: 1.2rem;
  box-shadow: 0 0 30px rgba(14, 165, 233, 0.15);
  display: flex;
  flex-direction: column;
  gap: 1.8rem;
`;

const PreviewHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 1.6rem;
  font-weight: 600;
  color: #facc15;
`;

const PreviewBox = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.8rem;
  padding: 1.4rem;
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
`;

const ShimmerLine = styled.div`
  height: 1.1rem;
  width: 100%;
  border-radius: 0.3rem;
  background: linear-gradient(90deg, #1e293b 25%, #334155 50%, #1e293b 75%);
  background-size: 800px 100%;
  animation: ${shimmer} 1.6s linear infinite;
`;

const InfoRow = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
  color: #94a3b8;
  font-size: 0.95rem;
`;

export default function LivePreview() {
  return (
    <PreviewWrapper
      initial={{ opacity: 0, y: 25 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <PreviewHeader>
        <FaEye /> Smart Preview Mode
      </PreviewHeader>

      <PreviewBox>
        <InfoRow>
          <FaFileAlt /> Simulated file content preview
        </InfoRow>
        <ShimmerLine style={{ width: "70%" }} />
        <ShimmerLine style={{ width: "90%" }} />
        <ShimmerLine style={{ width: "65%" }} />
        <ShimmerLine style={{ width: "80%" }} />
      </PreviewBox>

      <PreviewBox>
        <InfoRow>
          <FaLink /> Auto-generated smart link behavior
        </InfoRow>
        <ShimmerLine style={{ width: "60%" }} />
        <ShimmerLine style={{ width: "85%" }} />
        <ShimmerLine style={{ width: "75%" }} />
      </PreviewBox>
    </PreviewWrapper>
  );
}
 
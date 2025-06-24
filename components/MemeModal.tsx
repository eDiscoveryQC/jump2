import React from "react";
import styled from "styled-components";
import MemeGenerator from "./MemeGenerator";

export interface MemeModalProps {
  highlightText: string;
  articleUrl: string;
  onClose: () => void;
}

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalBox = styled.div`
  background: #fff;
  padding: 2rem;
  border-radius: 10px;
  max-width: 600px;
  width: 90%;
  position: relative;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2);
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 12px;
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #333;
`;

const ExportButton = styled.button`
  padding: 0.6em 1.2em;
  background-color: #1e3af2;
  color: #fff;
  border: none;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  margin-top: 1.5rem;
`;

const MemeModal: React.FC<MemeModalProps> = ({ highlightText, articleUrl, onClose }) => {
  return (
    <Overlay onClick={onClose}>
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>✖</CloseButton>
        <h2 style={{ marginBottom: "1rem" }}>Your Meme Preview</h2>
        <MemeGenerator
          highlightText={highlightText}
          articleUrl={articleUrl}
          onClose={onClose}
        />
        <div style={{ textAlign: "center" }}>
          <ExportButton onClick={() => window.print()}>Export Meme</ExportButton>
        </div>
      </ModalBox>
    </Overlay>
  );
};

export default MemeModal;
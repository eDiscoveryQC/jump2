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
  inset: 0;
  background: rgba(0, 0, 0, 0.65);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 2000;
  backdrop-filter: blur(3px);
`;

const ModalBox = styled.div`
  background: #fefefe;
  padding: 2.5rem;
  border-radius: 14px;
  max-width: 720px;
  width: 92%;
  position: relative;
  box-shadow: 0 12px 36px rgba(0, 0, 0, 0.25);
  animation: fadeIn 0.3s ease-out;

  @keyframes fadeIn {
    from {
      transform: scale(0.96);
      opacity: 0;
    }
    to {
      transform: scale(1);
      opacity: 1;
    }
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 12px;
  right: 16px;
  background: transparent;
  border: none;
  font-size: 1.8rem;
  cursor: pointer;
  color: #334155;
  transition: color 0.2s;
  &:hover {
    color: #1e3a8a;
  }
  &:focus {
    outline: 2px solid #facc15;
    border-radius: 4px;
  }
`;

const Title = styled.h2`
  margin-bottom: 1.25rem;
  font-size: 1.6rem;
  color: #1e293b;
  text-align: center;
  font-weight: 700;
`;

const MemeModal: React.FC<MemeModalProps> = ({ highlightText, articleUrl, onClose }) => {
  return (
    <Overlay onClick={onClose} aria-modal="true" role="dialog">
      <ModalBox onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose} aria-label="Close Meme Modal">
          ✖
        </CloseButton>
        <Title>Your Meme Preview</Title>
        <MemeGenerator
          highlightText={highlightText}
          articleUrl={articleUrl}
          onClose={onClose}
        />
      </ModalBox>
    </Overlay>
  );
};

export default MemeModal;

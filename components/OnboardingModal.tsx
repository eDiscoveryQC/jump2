// components/OnboardingModal.tsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { motion, AnimatePresence } from 'framer-motion';

const steps = [
  {
    title: 'Welcome to JUMP2!',
    description: 'The smartest way to highlight and share key parts of any link.',
  },
  {
    title: 'Paste a Link',
    description: 'Copy any article or video URL and paste it to get started.',
  },
  {
    title: 'Generate Highlights',
    description: 'Use AI or select your own key moments to share.',
  },
  {
    title: 'Share Smart Links',
    description: 'Send deep links that jump right to the important parts.',
  },
];

const Overlay = styled(motion.div)`
  position: fixed;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0,0,0,0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const Modal = styled(motion.div)`
  background: #fff;
  border-radius: 12px;
  max-width: 460px;
  width: 90%;
  padding: 24px 32px;
  box-shadow: 0 8px 24px rgba(0,0,0,0.15);
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 12px;
  font-weight: 700;
  font-size: 1.6rem;
`;

const Description = styled.p`
  margin-bottom: 24px;
  font-size: 1rem;
  color: #555;
`;

const ButtonRow = styled.div`
  display: flex;
  justify-content: space-between;
`;

const Button = styled.button<{ primary?: boolean }>`
  padding: 10px 18px;
  font-weight: 600;
  border-radius: 6px;
  border: none;
  cursor: pointer;
  background: ${({ primary }) => (primary ? '#1E4268' : '#ccc')};
  color: ${({ primary }) => (primary ? '#fff' : '#333')};
  transition: background 0.3s ease;

  &:hover {
    background: ${({ primary }) => (primary ? '#163559' : '#bbb')};
  }
`;

export default function OnboardingModal() {
  const [step, setStep] = useState(0);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const completed = localStorage.getItem('jump2OnboardingComplete');
    if (!completed) {
      setVisible(true);
    }
  }, []);

  function handleNext() {
    if (step === steps.length - 1) {
      localStorage.setItem('jump2OnboardingComplete', 'true');
      setVisible(false);
    } else {
      setStep(step + 1);
    }
  }

  function handleSkip() {
    localStorage.setItem('jump2OnboardingComplete', 'true');
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <AnimatePresence>
      <Overlay
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={handleSkip}
      >
        <Modal
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          onClick={(e) => e.stopPropagation()}
        >
          <Title>{steps[step].title}</Title>
          <Description>{steps[step].description}</Description>
          <ButtonRow>
            <Button onClick={handleSkip}>Skip</Button>
            <Button primary onClick={handleNext}>{step === steps.length -1 ? 'Done' : 'Next'}</Button>
          </ButtonRow>
        </Modal>
      </Overlay>
    </AnimatePresence>
  );
}

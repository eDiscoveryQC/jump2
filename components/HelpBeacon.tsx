// components/HelpBeacon.tsx — Meta-Style Interactive Help Beacon

import React, { useState } from "react";
import styled from "styled-components";
import { motion, AnimatePresence } from "framer-motion";

const Beacon = styled(motion.div)`
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #3b82f6;
  color: white;
  padding: 0.8rem 1rem;
  border-radius: 2rem;
  font-weight: 600;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 1000;
  &:hover {
    background: #2563eb;
    transform: scale(1.05);
  }
`;

const ModalOverlay = styled(motion.div)`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`;

const ModalContent = styled(motion.div)`
  background: white;
  color: #111827;
  padding: 2rem;
  border-radius: 1rem;
  width: 90%;
  max-width: 480px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25);
`;

const HelpBeacon = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <Beacon
        whileTap={{ scale: 0.9 }}
        whileHover={{ scale: 1.05 }}
        onClick={() => setIsOpen(true)}
        aria-label="Open help modal"
      >
        💬 Help
      </Beacon>

      <AnimatePresence>
        {isOpen && (
          <ModalOverlay
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
          >
            <ModalContent
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
            >
              <h2>Need Help?</h2>
              <p>
                Email us at <strong>support@jump2share.com</strong> or check our upcoming Help Center.
              </p>
              <button
                onClick={() => setIsOpen(false)}
                style={{ marginTop: "1.5rem", background: "#3b82f6", color: "white", border: "none", padding: "0.75rem 1.25rem", borderRadius: "0.5rem" }}
              >
                Close
              </button>
            </ModalContent>
          </ModalOverlay>
        )}
      </AnimatePresence>
    </>
  );
};

export default HelpBeacon;

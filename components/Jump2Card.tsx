import React from "react";
import styled from "styled-components";
import { FaCopy, FaTrash, FaExternalLinkAlt } from "react-icons/fa";

const Card = styled.div`
  background: #1e293b;
  border: 1px solid #334155;
  border-radius: 10px;
  padding: 1.2rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  transition: all 0.2s;
  &:hover {
    border-color: #facc15;
    transform: translateY(-2px);
  }
`;

const Title = styled.h3`
  font-size: 1.05rem;
  color: #facc15;
  margin-bottom: 0.3rem;
`;

const Domain = styled.p`
  font-size: 0.85rem;
  color: #94a3b8;
  margin-bottom: 0.8rem;
`;

const Footer = styled.div`
  display: flex;
  justify-content: space-between;
  font-size: 0.85rem;
  margin-top: 0.6rem;
`;

const Actions = styled.div`
  display: flex;
  gap: 0.8rem;

  button {
    background: none;
    border: none;
    color: #cbd5e1;
    cursor: pointer;
    font-size: 1rem;

    &:hover {
      color: #facc15;
    }
  }
`;

interface Props {
  id: number;
  title: string;
  domain: string;
  url: string;
  createdAt: string;
  onCopy: () => void;
  onDelete: (id: number) => void;
}

export default function Jump2Card({
  id,
  title,
  domain,
  url,
  createdAt,
  onCopy,
  onDelete,
}: Props) {
  return (
    <Card>
      <div>
        <Title>{title || "Untitled Share"}</Title>
        <Domain>{domain}</Domain>
      </div>
      <Footer>
        <span>{new Date(createdAt).toLocaleDateString()}</span>
        <Actions>
          <button onClick={() => window.open(url, "_blank")}>
            <FaExternalLinkAlt />
          </button>
          <button onClick={onCopy}>
            <FaCopy />
          </button>
          <button onClick={() => onDelete(id)}>
            <FaTrash />
          </button>
        </Actions>
      </Footer>
    </Card>
  );
}

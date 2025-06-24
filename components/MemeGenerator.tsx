import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

interface MemeModalProps {
  text: string
  sourceUrl: string
  onClose: () => void
}

const MemeModal: React.FC<MemeModalProps> = ({ text, sourceUrl, onClose }) => {
  const [memeSrc, setMemeSrc] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const generateMeme = async () => {
      setLoading(true)
      try {
        const res = await fetch('/api/meme', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ text, sourceUrl }),
        })

        const blob = await res.blob()
        const url = URL.createObjectURL(blob)
        setMemeSrc(url)
      } catch (err) {
        console.error('Error generating meme:', err)
      } finally {
        setLoading(false)
      }
    }

    generateMeme()
  }, [text, sourceUrl])

  const downloadImage = () => {
    if (!memeSrc) return
    const link = document.createElement('a')
    link.href = memeSrc
    link.download = 'jump2-meme.png'
    link.click()
  }

  return (
    <Overlay>
      <Modal>
        <Header>
          <h2>🎉 Meme Ready</h2>
          <CloseBtn onClick={onClose}>×</CloseBtn>
        </Header>

        {loading ? (
          <p>Generating your meme...</p>
        ) : memeSrc ? (
          <>
            <ImagePreview src={memeSrc} alt="Generated Meme" />
            <Actions>
              <Button onClick={downloadImage}>Download</Button>
              <Button onClick={onClose}>Close</Button>
            </Actions>
          </>
        ) : (
          <p>Error generating meme.</p>
        )}
      </Modal>
    </Overlay>
  )
}

export default MemeModal

// Styled Components
const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 999;
`

const Modal = styled.div`
  background: #111;
  border-radius: 16px;
  padding: 2rem;
  width: 90%;
  max-width: 640px;
  color: white;
  text-align: center;
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const CloseBtn = styled.button`
  background: none;
  border: none;
  font-size: 1.8rem;
  color: white;
  cursor: pointer;
`

const ImagePreview = styled.img`
  margin-top: 1rem;
  max-width: 100%;
  border-radius: 8px;
  box-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
`

const Actions = styled.div`
  margin-top: 1.5rem;
  display: flex;
  justify-content: center;
  gap: 1rem;
`

const Button = styled.button`
  padding: 0.6rem 1.2rem;
  font-size: 1rem;
  background: #1e3af2;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`


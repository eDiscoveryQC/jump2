// pages/api/meme.ts

import type { NextApiRequest, NextApiResponse } from 'next'
import { createCanvas, loadImage, registerFont } from 'canvas'
import { parse } from 'url'

registerFont('./public/fonts/Inter-Bold.ttf', { family: 'Inter' })

const WIDTH = 1080
const HEIGHT = 1080

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' })
  }

  const { text, sourceUrl, theme = 'blue-yellow' } = req.body

  if (!text || !sourceUrl) {
    return res.status(400).json({ error: 'Missing text or sourceUrl' })
  }

  const canvas = createCanvas(WIDTH, HEIGHT)
  const ctx = canvas.getContext('2d')

  // === Background Gradient ===
  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  gradient.addColorStop(0, '#1e3af2') // Blue
  gradient.addColorStop(1, '#ffd700') // Gold
  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // === Main Quote Text ===
  ctx.fillStyle = '#ffffff'
  ctx.font = 'bold 48px Inter'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'

  const lines = wrapText(ctx, text, WIDTH * 0.8)
  lines.forEach((line, i) => {
    ctx.fillText(line, WIDTH / 2, HEIGHT / 2 - 30 + i * 60)
  })

  // === Attribution ===
  const domain = parse(sourceUrl).hostname?.replace('www.', '') || 'jump2.link'
  const credit = `— ${domain} • jump2.link`

  ctx.font = '24px Inter'
  ctx.fillText(credit, WIDTH / 2, HEIGHT - 80)

  // === Return Image ===
  const buffer = canvas.toBuffer('image/png')
  res.setHeader('Content-Type', 'image/png')
  res.send(buffer)
}

// === Text Wrapping Helper ===
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let line = ''

  for (const word of words) {
    const testLine = `${line}${word} `
    const metrics = ctx.measureText(testLine)
    if (metrics.width > maxWidth && line !== '') {
      lines.push(line.trim())
      line = `${word} `
    } else {
      line = testLine
    }
  }
  lines.push(line.trim())
  return lines
}

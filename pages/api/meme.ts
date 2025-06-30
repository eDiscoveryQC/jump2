import type { NextApiRequest, NextApiResponse } from 'next';
import { createCanvas, loadImage, registerFont, CanvasRenderingContext2D } from 'canvas';
import { parse } from 'url';
import path from 'path';

registerFont(path.resolve('./public/fonts/Inter-Bold.ttf'), { family: 'Inter' });

const WIDTH = 1080;
const HEIGHT = 1080;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { text, sourceUrl, theme = 'blue-yellow' } = req.body;

  if (!text || !sourceUrl) {
    return res.status(400).json({ error: 'Missing text or sourceUrl' });
  }

  const canvas = createCanvas(WIDTH, HEIGHT);
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT);
  if (theme === 'dark') {
    gradient.addColorStop(0, '#111');
    gradient.addColorStop(1, '#222');
  } else if (theme === 'mono') {
    gradient.addColorStop(0, '#fefefe');
    gradient.addColorStop(1, '#e0e0e0');
  } else {
    gradient.addColorStop(0, '#1e3af2');
    gradient.addColorStop(1, '#ffd700');
  }

  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, WIDTH, HEIGHT);

  const dynamicFontSize = text.length > 240 ? 38 : text.length > 140 ? 44 : 48;
  ctx.fillStyle = theme === 'mono' ? '#111' : '#ffffff';
  ctx.font = `bold ${dynamicFontSize}px Inter`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.shadowColor = theme === 'mono' ? 'transparent' : 'rgba(0, 0, 0, 0.4)';
  ctx.shadowBlur = theme === 'mono' ? 0 : 4;

  const lines = wrapText(ctx, text, WIDTH * 0.8);
  const lineHeight = dynamicFontSize + 12;
  const totalHeight = lines.length * lineHeight;
  const startY = (HEIGHT - totalHeight) / 2 + lineHeight / 2;

  lines.forEach((line, i) => {
    ctx.fillText(line, WIDTH / 2, startY + i * lineHeight);
  });

  const domain = parse(sourceUrl).hostname?.replace('www.', '') || 'jump2.link';
  const credit = `— ${domain} • jump2.link`;

  ctx.font = '24px Inter';
  ctx.shadowBlur = 0;
  ctx.fillStyle = theme === 'mono' ? '#333' : '#ffffff';
  ctx.fillText(credit, WIDTH / 2, HEIGHT - 80);

  try {
    const logo = await loadImage(path.resolve('./public/jump2-logo.png'));
    ctx.drawImage(logo, 40, HEIGHT - 160, 120, 120);
  } catch (err) {
    console.warn("Logo not found or failed to load.");
  }

  const buffer = canvas.toBuffer('image/png');
  res.setHeader('Content-Type', 'image/png');
  res.send(buffer);
}

function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ');
  const lines: string[] = [];
  let line = '';

  for (const word of words) {
    const testLine = `${line}${word} `;
    const metrics = ctx.measureText(testLine);
    if (metrics.width > maxWidth && line !== '') {
      lines.push(line.trim());
      line = `${word} `;
    } else {
      line = testLine;
    }
  }
  lines.push(line.trim());
  return lines;
}

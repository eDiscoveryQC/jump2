// lib/shortCode.ts
import crypto from "crypto";

const ALPHABET = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ" as const;
const BASE = ALPHABET.length;

// Cached char array for perf
const CHARSET = ALPHABET.split("") as readonly string[];

export function generateShortCode(length = 6, prefix = ""): string {
  if (length <= 0) throw new Error("Shortcode length must be greater than 0");

  const buffer = crypto.randomBytes(length);
  let code = "";

  for (let i = 0; i < length; i++) {
    const index = buffer[i] % BASE;
    code += CHARSET[index];
  }

  return prefix ? `${prefix}_${code}` : code;
}

// Optional async generator (for example with collision-checking)
export async function createShortCode(options: {
  type: "url" | "file";
  value: string;
  filename?: string;
}): Promise<{ shortcode: string }> {
  const shortcode = generateShortCode(8, options.type.slice(0, 1).toUpperCase());
  // Optionally store this mapping in DB here
  return { shortcode };
}

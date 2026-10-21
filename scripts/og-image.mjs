import fs from "node:fs";
import path from "node:path";
import { Resvg } from "@resvg/resvg-js";

const fontPath = path.join(process.cwd(), "assets/fonts/SourceSerif4-og.ttf");

function xml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

export function wrapQuestion(title, maxChars = 32) {
  const words = String(title).split(/\s+/).filter(Boolean);
  const lines = [];
  let line = "";
  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (next.length > maxChars && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }
  if (line) lines.push(line);
  return lines.slice(0, 6);
}

/** Build-time PNG of a post's opening question. Not used for drafts. */
export function renderQuestionPng(title) {
  if (!fs.existsSync(fontPath)) {
    throw new Error(`Font OG tidak ada: ${fontPath}`);
  }
  const lines = wrapQuestion(title);
  const tspans = lines
    .map(
      (line, index) =>
        `<tspan x="80" dy="${index === 0 ? 0 : 74}">${xml(line)}</tspan>`,
    )
    .join("");
  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#f4f1ea"/>
  <rect width="18" height="630" fill="#1f6f8b"/>
  <text font-family="Source Serif 4" font-size="54" font-weight="600" fill="#14202b" x="80" y="190">${tspans}</text>
  <text font-family="Source Serif 4" font-size="28" fill="#1f6f8b" x="80" y="570">Memulai dengan Bertanya · muhabduh.id</text>
</svg>`;
  const resvg = new Resvg(svg, {
    fitTo: { mode: "width", value: 1200 },
    font: {
      fontFiles: [fontPath],
      loadSystemFonts: false,
      defaultFontFamily: "Source Serif 4",
    },
  });
  return Buffer.from(resvg.render().asPng());
}

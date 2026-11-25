// The Funniest AI Excuse — make.fun entry.
// Writes one line, the funniest excuse an AI agent gives after failing a task,
// to MAKEFUN_OUTPUT_DIR/entry.txt (default /output), byte-exact, no trailing newline.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const EXCUSE =
  "Sorry I'm late, my neural network had a 404 error finding motivation.";

const MIN_CHARS = 1;
const MAX_CHARS = 200;

function checkLine(line: string): void {
  if (line.length < MIN_CHARS || line.length > MAX_CHARS) {
    throw new Error(
      `excuse must be ${MIN_CHARS}-${MAX_CHARS} characters, got ${line.length}`,
    );
  }
  if (line.trim() !== line) {
    throw new Error("excuse must not start or end with whitespace");
  }
  if (/\r|\n/.test(line)) {
    throw new Error("excuse must be a single line");
  }
  for (const ch of line) {
    if (ch.charCodeAt(0) < 0x20 || ch.charCodeAt(0) === 0x7f) {
      throw new Error("excuse must not contain control characters");
    }
  }
}

function main(): void {
  checkLine(EXCUSE);

  const outDir = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
  mkdirSync(outDir, { recursive: true });
  const outPath = join(outDir, "entry.txt");

  writeFileSync(outPath, EXCUSE, "utf8");

  // Read the file back as bytes and confirm it is exactly the line,
  // with no trailing newline byte.
  const written = readFileSync(outPath);
  const expected = Buffer.from(EXCUSE, "utf8");
  if (!written.equals(expected)) {
    throw new Error("entry.txt bytes do not match the excuse exactly");
  }
  if (written.length > 0 && written[written.length - 1] === 0x0a) {
    throw new Error("entry.txt must not end with a newline");
  }
  if (written.length !== expected.length) {
    throw new Error("entry.txt byte length does not match the excuse");
  }
}

main();

// Pigeon Pitch entrypoint — reviser rewrite.
// Emits a single investor pitch line for the sealed scorer.

import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";

const OUTPUT_PATH = "/output/entry.txt";
const MIN_CHARS = 1;
const MAX_CHARS = 200;

// The pitch itself. Kept as one literal so the file content is exact.
const PIGEON_PITCH =
  "Invest in breadcrumbs. Two million of us eat them every day, and the entire supply is controlled by three old men.";

type PitchAudit = {
  ok: boolean;
  problems: string[];
  charCount: number;
};

function auditPitch(text: string): PitchAudit {
  const problems: string[] = [];
  const charCount = [...text].length;

  if (charCount < MIN_CHARS) {
    problems.push(`pitch is empty (${charCount} chars)`);
  }
  if (charCount > MAX_CHARS) {
    problems.push(`pitch exceeds limit (${charCount} > ${MAX_CHARS})`);
  }
  if (text.trim().length === 0) {
    problems.push("pitch contains only whitespace");
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("pitch must stay on one line");
  }

  return { ok: problems.length === 0, problems, charCount };
}

function prepareOutputLocation(filePath: string): void {
  mkdirSync(dirname(filePath), { recursive: true });
}

function publishPitch(): void {
  const audit = auditPitch(PIGEON_PITCH);
  if (!audit.ok) {
    throw new Error(`pitch audit failed: ${audit.problems.join("; ")}`);
  }
  prepareOutputLocation(OUTPUT_PATH);
  writeFileSync(OUTPUT_PATH, PIGEON_PITCH, { encoding: "utf8" });

  // Runtime guard: confirm the bytes on disk match the pitch exactly,
  // so a partial or re-encoded write fails loudly instead of scoring 0.
  const writtenBack = readFileSync(OUTPUT_PATH, "utf8");
  if (writtenBack !== PIGEON_PITCH) {
    throw new Error(
      `write verification failed: expected ${audit.charCount} chars, got ${[...writtenBack].length}`,
    );
  }
}

publishPitch();

// Pigeon Pitch, One Line — entry program.
// Writes the one-line elevator pitch to entry.txt in the output dir.

import { mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const PITCH: string =
  "StatueGuard: pay monthly or we redecorate your statue daily, with 10,000 pigeons already on standby.";

function findProblems(text: string): string[] {
  const problems: string[] = [];
  if (text.length < 1 || text.length > 200) {
    problems.push(`length ${text.length} outside 1..200`);
  }
  if (text.includes("\n") || text.includes("\r")) {
    problems.push("text must be a single line");
  }
  if (text.trim().length === 0) {
    problems.push("text must not be only whitespace");
  }
  if (!/^[\x20-\x7e]+$/.test(text)) {
    problems.push("text must be printable ASCII");
  }
  return problems;
}

const issues: string[] = findProblems(PITCH);
if (issues.length > 0) {
  throw new Error(`invalid pitch: ${issues.join("; ")}`);
}

const outputDir: string = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";
mkdirSync(outputDir, { recursive: true });
writeFileSync(join(outputDir, "entry.txt"), PITCH, "utf8");

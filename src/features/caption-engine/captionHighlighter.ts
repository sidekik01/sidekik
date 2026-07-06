import type { CaptionBlock, HighlightedWord } from "./types";

const strongActionWords = new Set([
  "build",
  "create",
  "launch",
  "grow",
  "move",
  "publish",
  "ship",
  "start",
  "stop",
  "turn",
  "win",
]);

const moneyWords = new Set([
  "cash",
  "cost",
  "deal",
  "free",
  "money",
  "paid",
  "profit",
  "revenue",
  "sale",
  "sales",
]);

const urgencyWords = new Set([
  "fast",
  "faster",
  "immediately",
  "minutes",
  "now",
  "quick",
  "today",
  "urgent",
]);

const negativeWords = new Set([
  "avoid",
  "bad",
  "broken",
  "fail",
  "hard",
  "lost",
  "mistake",
  "problem",
  "slow",
  "worse",
]);

function normalizeWord(word: string) {
  return word.toLowerCase().replace(/[^a-z0-9]/g, "");
}

function getHighlightReasons(word: string) {
  const normalizedWord = normalizeWord(word);
  const reasons: string[] = [];

  if (strongActionWords.has(normalizedWord)) {
    reasons.push("Strong action word");
  }

  if (moneyWords.has(normalizedWord)) {
    reasons.push("Money word");
  }

  if (urgencyWords.has(normalizedWord)) {
    reasons.push("Urgency word");
  }

  if (negativeWords.has(normalizedWord)) {
    reasons.push("Negative word");
  }

  if (/\d/.test(word)) {
    reasons.push("Number");
  }

  if (/^[A-Z0-9]{2,}$/.test(word.replace(/[^a-z0-9]/gi, ""))) {
    reasons.push("All caps");
  }

  if (normalizedWord.length > 8) {
    reasons.push("Long emphasis word");
  }

  return reasons;
}

function getConfidence(reasons: string[]) {
  return Math.min(100, 58 + reasons.length * 12);
}

export function generateHighlightedWords(
  captionBlocks: CaptionBlock[],
): HighlightedWord[] {
  return captionBlocks.flatMap((captionBlock) =>
    captionBlock.words.flatMap((entry, index) => {
      const reasons = getHighlightReasons(entry.word);

      if (!reasons.length) {
        return [];
      }

      return {
        ...entry,
        captionId: captionBlock.id,
        confidence: getConfidence(reasons),
        emphasis: reasons.length > 1 ? "strong" : "normal",
        id: `${captionBlock.id}-word-${index + 1}`,
        index,
        reasons,
      };
    }),
  );
}

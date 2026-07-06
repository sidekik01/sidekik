import type { CaptionDifficulty, ReadingSpeed } from "./types";

export function calculateReadingSpeed(wordCount: number, duration: number) {
  if (!duration) {
    return 0;
  }

  return Math.round(wordCount / (duration / 60));
}

export function getReadingSpeedLevel(
  wordsPerMinute: number,
): ReadingSpeed["level"] {
  if (wordsPerMinute < 120) {
    return "slow";
  }

  if (wordsPerMinute > 180) {
    return "fast";
  }

  return "comfortable";
}

export function analyzeReadingSpeed(
  wordCount: number,
  duration: number,
): ReadingSpeed {
  const wordsPerMinute = calculateReadingSpeed(wordCount, duration);

  return {
    level: getReadingSpeedLevel(wordsPerMinute),
    wordsPerMinute,
  };
}

export function estimateDifficulty(
  averageReadingSpeed: number,
  averageCaptionLength: number,
): CaptionDifficulty {
  if (averageReadingSpeed > 190 || averageCaptionLength > 5) {
    return "Hard";
  }

  if (averageReadingSpeed > 160 || averageCaptionLength > 4) {
    return "Moderate";
  }

  return "Easy";
}

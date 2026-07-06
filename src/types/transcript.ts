export type TranscriptWord = {
  word: string;
  start: number;
  end: number;
};

export type CaptionBlock = {
  id: string;
  text: string;
  start: number;
  end: number;
  words: TranscriptWord[];
};

export type TranscriptResult = {
  transcript: string;
  duration: number;
  words: TranscriptWord[];
};

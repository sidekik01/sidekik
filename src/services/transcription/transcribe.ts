import { execFile } from "node:child_process";
import { createReadStream } from "node:fs";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { promisify } from "node:util";
import OpenAI from "openai";
import type { TranscriptResult } from "@/src/types/transcript";

const execFileAsync = promisify(execFile);

export async function transcribeVideoFile({
  fileBuffer,
  filename,
  apiKey,
}: {
  apiKey: string;
  fileBuffer: Buffer;
  filename: string;
}): Promise<TranscriptResult> {
  const workingDirectory = await mkdtemp("/tmp/sidekik-");
  const inputPath = `${workingDirectory}/${sanitizeFilename(filename)}`;
  const audioPath = `${workingDirectory}/audio.mp3`;

  try {
    await writeFile(inputPath, fileBuffer);
    await extractAudio(inputPath, audioPath);

    return transcribeWithOpenAI({
      apiKey,
      audioPath,
    });
  } finally {
    await rm(workingDirectory, { force: true, recursive: true });
  }
}

export async function transcribeWithOpenAI({
  apiKey,
  audioPath,
}: {
  apiKey: string;
  audioPath: string;
}): Promise<TranscriptResult> {
  const client = new OpenAI({
    apiKey,
  });

  const response = await client.audio.transcriptions.create({
    file: createReadStream(audioPath),
    model: "whisper-1",
    response_format: "verbose_json",
    timestamp_granularities: ["word"],
  });

  const words =
    "words" in response && response.words
      ? response.words.map((entry) => ({
          end: entry.end,
          start: entry.start,
          word: entry.word,
        }))
      : [];

  // TODO: Add speaker detection and diarization metadata once the transcript
  // pipeline supports multi-speaker analysis.
  return {
    duration: "duration" in response ? response.duration : 0,
    transcript: "text" in response ? response.text : "",
    words,
  };
}

async function extractAudio(inputPath: string, audioPath: string) {
  await execFileAsync("ffmpeg", [
    "-y",
    "-i",
    inputPath,
    "-vn",
    "-acodec",
    "libmp3lame",
    "-ar",
    "44100",
    "-ac",
    "2",
    audioPath,
  ]);
}

function sanitizeFilename(filename: string) {
  return filename.replace(/[^a-zA-Z0-9._-]/g, "_") || "upload.mp4";
}

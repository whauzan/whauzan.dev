/**
 * Turns an audio file into the level array HeroWaveform draws. Run offline.
 *
 *   afconvert -f WAVE -d LEI16@8000 -c 1 track.mp3 /tmp/track.wav
 *   node scripts/extract-waveform.mjs /tmp/track.wav 120 "Track — Artist" \
 *     > src/components/studio/hero-waveform.levels.json
 */
import { readFileSync } from "node:fs";

const [, , wavPath, barsArg, sourceArg] = process.argv;
if (!wavPath) {
  console.error('usage: extract-waveform.mjs <file.wav> [bars] ["source"]');
  process.exit(1);
}
const BARS = Number(barsArg ?? 120);
const SOURCE = sourceArg ?? "unknown";
const buf = readFileSync(wavPath);

// Walk the RIFF chunks rather than assuming a 44-byte header: afconvert emits a
// FLLR padding chunk before `data`, so a fixed offset reads noise.
let offset = 12;
let dataStart = -1;
let dataLen = 0;
let sampleRate = 0;
while (offset < buf.length - 8) {
  const id = buf.toString("ascii", offset, offset + 4);
  const size = buf.readUInt32LE(offset + 4);
  if (id === "fmt ") sampleRate = buf.readUInt32LE(offset + 12);
  if (id === "data") {
    dataStart = offset + 8;
    dataLen = size;
    break;
  }
  offset += 8 + size + (size % 2);
}
if (dataStart < 0) throw new Error("no data chunk found — is this a WAV?");

const totalSamples = Math.floor(dataLen / 2);
const perBar = Math.floor(totalSamples / BARS);

// RMS, not peak: over buckets this long a peak detector pins every loud bar to
// the ceiling and the track flattens into a solid block.
const levels = [];
for (let b = 0; b < BARS; b++) {
  let sum = 0;
  for (let i = 0; i < perBar; i++) {
    const s = buf.readInt16LE(dataStart + (b * perBar + i) * 2) / 32768;
    sum += s * s;
  }
  levels.push(Math.sqrt(sum / perBar));
}

const max = Math.max(...levels);
// The 0.05 floor keeps silent bars visible as a baseline.
const normalised = levels.map((v) =>
  Number((0.05 + 0.95 * (v / max) ** 0.8).toFixed(3)),
);

process.stdout.write(
  `${JSON.stringify(
    {
      source: SOURCE,
      seconds: Number((totalSamples / sampleRate).toFixed(2)),
      bars: BARS,
      levels: normalised,
    },
    null,
    2,
  )}\n`,
);

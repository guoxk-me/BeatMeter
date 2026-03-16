import * as FileSystem from 'expo-file-system/legacy';
import { EncodingType } from 'expo-file-system/legacy';
import { CUSTOM_SOUND_PRESET_ID, DEFAULT_SOUND_PRESET_ID } from '../constants/sounds';
import { decodeBase64, encodeBase64 } from './base64';

const TARGET_SAMPLE_RATE = 22050;
const PRESET_SAMPLE_DURATION_MS = 90;

export interface MonoAudioData {
  sampleRate: number;
  samples: Float32Array;
}

export interface LoopBuildResult {
  base64: string;
  durationMs: number;
}

export async function readWavFileAsMonoAudio(uri: string): Promise<MonoAudioData> {
  const base64 = await FileSystem.readAsStringAsync(uri, { encoding: EncodingType.Base64 });

  if (!base64) {
    throw new Error('无法读取 WAV 文件内容');
  }

  return parseWavBytes(decodeBase64(base64));
}

export function getPresetAudioData(soundPresetId: string): MonoAudioData {
  switch (soundPresetId) {
    case 'soft-beep':
      return buildSoftBeepSample();
    case 'sharp-digital':
      return buildSharpDigitalSample();
    case 'woodblock':
      return buildWoodblockSample();
    case 'cowbell':
      return buildCowbellSample();
    case 'hi-hat':
      return buildHiHatSample();
    case 'clave':
      return buildClaveSample();
    case DEFAULT_SOUND_PRESET_ID:
    default:
      return buildClassicClickSample();
  }
}

export function resolveSoundDisplayName(soundPresetId: string, customSoundName?: string | null) {
  if (soundPresetId === CUSTOM_SOUND_PRESET_ID) {
    return customSoundName?.trim() || '自定义 WAV';
  }

  return getPresetAudioData(soundPresetId) && soundPresetId;
}

export function buildLoopWavBase64(params: {
  bpm: number;
  audioData: MonoAudioData;
  beatsPerBar?: number;
}): LoopBuildResult {
  const beatsPerBar = params.beatsPerBar ?? 4;
  const beatDurationMs = 60000 / params.bpm;
  const beatSamples = Math.max(1, Math.round((TARGET_SAMPLE_RATE * beatDurationMs) / 1000));
  const totalSamples = beatSamples * beatsPerBar;
  const loop = new Float32Array(totalSamples);
  const preparedSample = prepareSampleForBeat(params.audioData, Math.max(1, Math.floor(beatSamples * 0.82)));

  for (let beatIndex = 0; beatIndex < beatsPerBar; beatIndex += 1) {
    const gain = beatIndex === 0 ? 1.28 : 0.96;
    const start = beatIndex * beatSamples;

    for (let sampleIndex = 0; sampleIndex < preparedSample.length; sampleIndex += 1) {
      const writeIndex = start + sampleIndex;

      if (writeIndex >= totalSamples) {
        break;
      }

      loop[writeIndex] += preparedSample[sampleIndex] * gain;
    }
  }

  for (let index = 0; index < loop.length; index += 1) {
    loop[index] = clamp(loop[index], -1, 1);
  }

  const wavBytes = encodePcm16Wav(loop, TARGET_SAMPLE_RATE);

  return {
    base64: encodeBase64(wavBytes),
    durationMs: Math.round((totalSamples / TARGET_SAMPLE_RATE) * 1000),
  };
}

export function parseWavBytes(bytes: Uint8Array): MonoAudioData {
  if (bytes.length < 44) {
    throw new Error('WAV 文件太小，无法解析');
  }

  const view = new DataView(bytes.buffer, bytes.byteOffset, bytes.byteLength);

  if (readAscii(bytes, 0, 4) !== 'RIFF' || readAscii(bytes, 8, 4) !== 'WAVE') {
    throw new Error('文件不是有效的 WAV 格式');
  }

  let fmtOffset = -1;
  let fmtSize = 0;
  let dataOffset = -1;
  let dataSize = 0;

  for (let offset = 12; offset + 8 <= bytes.length;) {
    const chunkId = readAscii(bytes, offset, 4);
    const chunkSize = view.getUint32(offset + 4, true);
    const chunkDataOffset = offset + 8;

    if (chunkId === 'fmt ') {
      fmtOffset = chunkDataOffset;
      fmtSize = chunkSize;
    }

    if (chunkId === 'data') {
      dataOffset = chunkDataOffset;
      dataSize = chunkSize;
    }

    offset = chunkDataOffset + chunkSize + (chunkSize % 2);
  }

  if (fmtOffset < 0 || dataOffset < 0 || fmtSize < 16) {
    throw new Error('WAV 文件缺少必要的格式信息');
  }

  const audioFormat = view.getUint16(fmtOffset, true);
  const channelCount = view.getUint16(fmtOffset + 2, true);
  const sampleRate = view.getUint32(fmtOffset + 4, true);
  const bitsPerSample = view.getUint16(fmtOffset + 14, true);

  if (![1, 3].includes(audioFormat)) {
    throw new Error('当前仅支持 PCM 或 Float WAV');
  }

  if (!channelCount || !sampleRate || !bitsPerSample) {
    throw new Error('WAV 参数异常，无法使用');
  }

  const bytesPerSample = bitsPerSample / 8;
  const bytesPerFrame = bytesPerSample * channelCount;

  if (!Number.isInteger(bytesPerSample) || bytesPerFrame <= 0) {
    throw new Error('WAV 位深不受支持');
  }

  const frameCount = Math.floor(dataSize / bytesPerFrame);

  if (frameCount <= 0) {
    throw new Error('WAV 音频数据为空');
  }

  const samples = new Float32Array(frameCount);

  for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
    let mixedSample = 0;
    const frameOffset = dataOffset + frameIndex * bytesPerFrame;

    for (let channelIndex = 0; channelIndex < channelCount; channelIndex += 1) {
      const sampleOffset = frameOffset + channelIndex * bytesPerSample;
      mixedSample += readSample(view, sampleOffset, audioFormat, bitsPerSample);
    }

    samples[frameIndex] = clamp(mixedSample / channelCount, -1, 1);
  }

  return { sampleRate, samples };
}

function buildClassicClickSample(): MonoAudioData {
  return {
    sampleRate: TARGET_SAMPLE_RATE,
    samples: createSynthSample(PRESET_SAMPLE_DURATION_MS, (time, progress) => {
      const envelope = Math.exp(-progress * 12);
      const body = Math.sin(2 * Math.PI * 1640 * time) * 0.75;
      const accent = Math.sin(2 * Math.PI * 2420 * time) * 0.4;
      const transient = Math.sin(2 * Math.PI * 3200 * time) * (1 - progress) * 0.22;

      return (body + accent + transient) * envelope;
    }),
  };
}

function buildSoftBeepSample(): MonoAudioData {
  return {
    sampleRate: TARGET_SAMPLE_RATE,
    samples: createSynthSample(110, (time, progress) => {
      const attack = Math.min(1, progress * 18);
      const decay = Math.exp(-progress * 5);
      const envelope = attack * decay;
      const fundamental = Math.sin(2 * Math.PI * 880 * time);
      const harmonic = Math.sin(2 * Math.PI * 1320 * time) * 0.2;

      return (fundamental * 0.72 + harmonic) * envelope;
    }),
  };
}

function buildSharpDigitalSample(): MonoAudioData {
  return {
    sampleRate: TARGET_SAMPLE_RATE,
    samples: createSynthSample(75, (time, progress) => {
      const envelope = Math.exp(-progress * 10.5);
      const fundamental = Math.sin(2 * Math.PI * 1200 * time);
      const harmonic2 = Math.sin(2 * Math.PI * 2400 * time) / 3;
      const harmonic3 = Math.sin(2 * Math.PI * 3600 * time) / 5;

      return (fundamental + harmonic2 + harmonic3) * envelope * 0.95;
    }),
  };
}

function buildWoodblockSample(): MonoAudioData {
  return {
    sampleRate: TARGET_SAMPLE_RATE,
    samples: createSynthSample(60, (time, progress) => {
      const envelope = Math.exp(-progress * 15);
      const fundamental = Math.sin(2 * Math.PI * 800 * time);
      const harmonic = Math.sin(2 * Math.PI * 1600 * time) * 0.3;
      const transient = Math.random() * (1 - progress) * Math.exp(-progress * 50) * 0.5;

      return (fundamental + harmonic + transient) * envelope;
    }),
  };
}

function buildCowbellSample(): MonoAudioData {
  return {
    sampleRate: TARGET_SAMPLE_RATE,
    samples: createSynthSample(150, (time, progress) => {
      const envelope = Math.exp(-progress * 6);
      const freq1 = Math.sin(2 * Math.PI * 540 * time);
      const freq2 = Math.sin(2 * Math.PI * 800 * time);
      
      return (freq1 * 0.6 + freq2 * 0.4) * envelope * 0.8;
    }),
  };
}

function buildHiHatSample(): MonoAudioData {
  return {
    sampleRate: TARGET_SAMPLE_RATE,
    samples: createSynthSample(50, (time, progress) => {
      const envelope = Math.exp(-progress * 25);
      const noise = (Math.random() * 2 - 1);
      const highPass = noise - Math.sin(2 * Math.PI * 5000 * time) * 0.5; // Pseudo high-pass feel
      
      return highPass * envelope * 0.6;
    }),
  };
}

function buildClaveSample(): MonoAudioData {
  return {
    sampleRate: TARGET_SAMPLE_RATE,
    samples: createSynthSample(40, (time, progress) => {
      const envelope = Math.exp(-progress * 20);
      const fundamental = Math.sin(2 * Math.PI * 2500 * time);
      const harmonic = Math.sin(2 * Math.PI * 5000 * time) * 0.2;

      return (fundamental + harmonic) * envelope * 0.9;
    }),
  };
}

function createSynthSample(durationMs: number, generator: (time: number, progress: number) => number) {
  const sampleCount = Math.max(1, Math.round((TARGET_SAMPLE_RATE * durationMs) / 1000));
  const samples = new Float32Array(sampleCount);

  for (let index = 0; index < sampleCount; index += 1) {
    const time = index / TARGET_SAMPLE_RATE;
    const progress = index / sampleCount;
    samples[index] = clamp(generator(time, progress), -1, 1);
  }

  return samples;
}

function prepareSampleForBeat(audioData: MonoAudioData, maxSamples: number) {
  const mono = audioData.sampleRate === TARGET_SAMPLE_RATE
    ? audioData.samples
    : resampleLinear(audioData.samples, audioData.sampleRate, TARGET_SAMPLE_RATE);

  const trimmed = mono.subarray(0, Math.max(1, Math.min(maxSamples, mono.length)));
  const output = new Float32Array(trimmed.length);
  let peak = 0;

  for (let index = 0; index < trimmed.length; index += 1) {
    const fadeInSamples = Math.max(1, Math.floor(TARGET_SAMPLE_RATE * 0.002));
    const fadeOutSamples = Math.max(8, Math.floor(TARGET_SAMPLE_RATE * 0.015));

    let gain = 1;

    if (index < fadeInSamples) {
      gain *= index / fadeInSamples;
    }

    if (index >= trimmed.length - fadeOutSamples) {
      gain *= Math.max(0, (trimmed.length - index) / fadeOutSamples);
    }

    output[index] = trimmed[index] * gain;
    peak = Math.max(peak, Math.abs(output[index]));
  }

  if (peak > 0.98) {
    const scale = 0.98 / peak;

    for (let index = 0; index < output.length; index += 1) {
      output[index] *= scale;
    }
  }

  return output;
}

function resampleLinear(samples: Float32Array, fromRate: number, toRate: number) {
  if (samples.length <= 1 || fromRate === toRate) {
    return samples;
  }

  const nextLength = Math.max(1, Math.round((samples.length * toRate) / fromRate));
  const output = new Float32Array(nextLength);
  const ratio = fromRate / toRate;

  for (let index = 0; index < nextLength; index += 1) {
    const sourceIndex = index * ratio;
    const leftIndex = Math.floor(sourceIndex);
    const rightIndex = Math.min(samples.length - 1, leftIndex + 1);
    const mix = sourceIndex - leftIndex;
    output[index] = samples[leftIndex] * (1 - mix) + samples[rightIndex] * mix;
  }

  return output;
}

function encodePcm16Wav(samples: Float32Array, sampleRate: number) {
  const bytesPerSample = 2;
  const dataSize = samples.length * bytesPerSample;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  writeAscii(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeAscii(view, 8, 'WAVE');
  writeAscii(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * bytesPerSample, true);
  view.setUint16(32, bytesPerSample, true);
  view.setUint16(34, 16, true);
  writeAscii(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  for (let index = 0; index < samples.length; index += 1) {
    const value = clamp(samples[index], -1, 1);
    view.setInt16(44 + index * 2, value < 0 ? Math.round(value * 0x8000) : Math.round(value * 0x7fff), true);
  }

  return new Uint8Array(buffer);
}

function readSample(view: DataView, offset: number, audioFormat: number, bitsPerSample: number) {
  if (audioFormat === 3 && bitsPerSample === 32) {
    return clamp(view.getFloat32(offset, true), -1, 1);
  }

  switch (bitsPerSample) {
    case 8:
      return (view.getUint8(offset) - 128) / 128;
    case 16:
      return view.getInt16(offset, true) / 32768;
    case 24: {
      const b0 = view.getUint8(offset);
      const b1 = view.getUint8(offset + 1);
      const b2 = view.getUint8(offset + 2);
      const value = ((b2 << 24) | (b1 << 16) | (b0 << 8)) >> 8;
      return value / 8388608;
    }
    case 32:
      return view.getInt32(offset, true) / 2147483648;
    default:
      throw new Error('WAV 位深暂不支持');
  }
}

function readAscii(bytes: Uint8Array, offset: number, length: number) {
  let value = '';

  for (let index = offset; index < offset + length; index += 1) {
    value += String.fromCharCode(bytes[index] ?? 0);
  }

  return value;
}

function writeAscii(view: DataView, offset: number, value: string) {
  for (let index = 0; index < value.length; index += 1) {
    view.setUint8(offset + index, value.charCodeAt(index));
  }
}

function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

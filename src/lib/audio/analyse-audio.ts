export type AudioVisualAnalysis = {
  durationSeconds: number;
  intensity: number[];
  averageIntensity: number;
  peakIntensity: number;
  pitchMovement: number[];
  message?: string;
};

function sampleChannel(channel: Float32Array, buckets: number) {
  const bucketSize = Math.max(1, Math.floor(channel.length / buckets));

  return Array.from({ length: buckets }, (_, index) => {
    const start = index * bucketSize;
    const end = Math.min(channel.length, start + bucketSize);
    let total = 0;
    let crossings = 0;
    let last = channel[start] ?? 0;

    for (let sampleIndex = start; sampleIndex < end; sampleIndex += 1) {
      const value = channel[sampleIndex] ?? 0;
      total += value * value;

      if ((last < 0 && value >= 0) || (last >= 0 && value < 0)) {
        crossings += 1;
      }

      last = value;
    }

    const rms = Math.sqrt(total / Math.max(1, end - start));

    return {
      intensity: Math.min(1, rms * 4),
      movement: Math.min(1, crossings / Math.max(1, bucketSize / 60)),
    };
  });
}

export async function analyseAudioBlob(
  audioBlob: Blob
): Promise<AudioVisualAnalysis> {
  if (typeof window === "undefined") {
    throw new Error("Audio analysis runs in the browser.");
  }

  const AudioContextClass = window.AudioContext ?? window.webkitAudioContext;

  if (!AudioContextClass) {
    throw new Error("This browser does not support audio analysis.");
  }

  const audioContext = new AudioContextClass();

  try {
    const buffer = await audioBlob.arrayBuffer();
    const decoded = await audioContext.decodeAudioData(buffer.slice(0));
    const channel = decoded.getChannelData(0);
    const samples = sampleChannel(channel, 36);
    const intensity = samples.map((sample) => sample.intensity);
    const pitchMovement = samples.map((sample) => sample.movement);
    const averageIntensity =
      intensity.reduce((total, value) => total + value, 0) /
      Math.max(1, intensity.length);
    const peakIntensity = Math.max(...intensity, 0);

    return {
      durationSeconds: decoded.duration,
      intensity,
      averageIntensity,
      peakIntensity,
      pitchMovement,
    };
  } finally {
    await audioContext.close().catch(() => undefined);
  }
}

declare global {
  interface Window {
    webkitAudioContext?: typeof AudioContext;
  }
}

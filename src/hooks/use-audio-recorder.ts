"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import {
  getBestSupportedAudioMimeType,
  maxRecordingSeconds,
} from "@/lib/recordings";

export type AudioRecorderStatus =
  | "idle"
  | "requesting_permission"
  | "recording"
  | "stopped"
  | "failed";

type UseAudioRecorderOptions = {
  maxDurationSeconds?: number;
};

function getRecorderErrorMessage(error: unknown) {
  if (error instanceof DOMException) {
    if (error.name === "NotAllowedError" || error.name === "SecurityError") {
      return "Microphone permission was blocked. You can enable it in your browser settings, then try recording again.";
    }

    if (error.name === "NotFoundError") {
      return "No microphone was found. Connect or enable a microphone, then try again.";
    }
  }

  return "We could not start recording. Check your microphone and try again.";
}

export function useAudioRecorder({
  maxDurationSeconds = maxRecordingSeconds,
}: UseAudioRecorderOptions = {}) {
  const [status, setStatus] = useState<AudioRecorderStatus>("idle");
  const [error, setError] = useState<string | null>(null);
  const [duration, setDuration] = useState(0);
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isSupported, setIsSupported] = useState(false);
  const [mimeType, setMimeType] = useState("");

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const timerRef = useRef<number | null>(null);
  const maxDurationRef = useRef<number | null>(null);
  const startedAtRef = useRef<number | null>(null);
  const audioUrlRef = useRef<string | null>(null);

  const clearTimers = useCallback(() => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }

    if (maxDurationRef.current) {
      window.clearTimeout(maxDurationRef.current);
      maxDurationRef.current = null;
    }
  }, []);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((track) => track.stop());
    streamRef.current = null;
  }, []);

  const revokeAudioUrl = useCallback(() => {
    if (audioUrlRef.current) {
      URL.revokeObjectURL(audioUrlRef.current);
      audioUrlRef.current = null;
    }
  }, []);

  const stopRecording = useCallback(() => {
    const recorder = mediaRecorderRef.current;

    if (recorder?.state === "recording") {
      recorder.stop();
    } else {
      clearTimers();
      stopStream();
    }
  }, [clearTimers, stopStream]);

  useEffect(() => {
    const supported =
      typeof navigator !== "undefined" &&
      Boolean(navigator.mediaDevices?.getUserMedia) &&
      typeof MediaRecorder !== "undefined";

    setIsSupported(supported);
    setMimeType(supported ? getBestSupportedAudioMimeType() : "");
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
      stopStream();
      revokeAudioUrl();
    };
  }, [clearTimers, revokeAudioUrl, stopStream]);

  const startRecording = useCallback(async () => {
    if (!isSupported) {
      setStatus("failed");
      setError(
        "This browser does not support in-page audio recording. Try the latest version of Chrome, Edge, or Safari."
      );
      return;
    }

    if (status === "recording" || status === "requesting_permission") {
      return;
    }

    setStatus("requesting_permission");
    setError(null);
    setAudioBlob(null);
    setAudioUrl(null);
    setDuration(0);
    revokeAudioUrl();

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
      const selectedMimeType = getBestSupportedAudioMimeType();
      const recorder = new MediaRecorder(
        stream,
        selectedMimeType ? { mimeType: selectedMimeType } : undefined
      );

      streamRef.current = stream;
      mediaRecorderRef.current = recorder;
      chunksRef.current = [];
      startedAtRef.current = Date.now();
      setMimeType(selectedMimeType);

      recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          chunksRef.current.push(event.data);
        }
      };

      recorder.onerror = () => {
        setStatus("failed");
        setError("Recording stopped unexpectedly. Please try again.");
        clearTimers();
        stopStream();
      };

      recorder.onstop = () => {
        clearTimers();
        stopStream();
        const finalDuration = startedAtRef.current
          ? Math.ceil((Date.now() - startedAtRef.current) / 1000)
          : duration;
        const blob = new Blob(chunksRef.current, {
          type: selectedMimeType || "audio/webm",
        });

        if (blob.size === 0) {
          setStatus("failed");
          setError("The recording was empty. Please try again.");
          return;
        }

        const nextAudioUrl = URL.createObjectURL(blob);
        audioUrlRef.current = nextAudioUrl;
        setAudioBlob(blob);
        setAudioUrl(nextAudioUrl);
        setDuration(Math.min(finalDuration, maxDurationSeconds));
        setStatus("stopped");
      };

      recorder.start();
      setStatus("recording");

      timerRef.current = window.setInterval(() => {
        if (!startedAtRef.current) return;

        setDuration(
          Math.min(
            Math.floor((Date.now() - startedAtRef.current) / 1000),
            maxDurationSeconds
          )
        );
      }, 250);

      maxDurationRef.current = window.setTimeout(() => {
        stopRecording();
      }, maxDurationSeconds * 1000);
    } catch (recordingError) {
      clearTimers();
      stopStream();
      setStatus("failed");
      setError(getRecorderErrorMessage(recordingError));
    }
  }, [
    clearTimers,
    duration,
    isSupported,
    maxDurationSeconds,
    revokeAudioUrl,
    status,
    stopRecording,
    stopStream,
  ]);

  const resetRecording = useCallback(() => {
    stopRecording();
    clearTimers();
    stopStream();
    revokeAudioUrl();
    mediaRecorderRef.current = null;
    chunksRef.current = [];
    startedAtRef.current = null;
    setStatus("idle");
    setError(null);
    setDuration(0);
    setAudioBlob(null);
    setAudioUrl(null);
  }, [clearTimers, revokeAudioUrl, stopRecording, stopStream]);

  return {
    status,
    error,
    duration,
    audioBlob,
    audioUrl,
    mimeType,
    isRecording: status === "recording",
    isSupported,
    startRecording,
    stopRecording,
    resetRecording,
  };
}

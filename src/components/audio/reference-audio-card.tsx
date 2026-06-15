"use client";

import { useState } from "react";
import { HeadphonesIcon, RefreshCwIcon } from "lucide-react";

import { AudioPlayer } from "@/components/recording/audio-player";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type ReferenceAudioResponse = {
  audioUrl: string | null;
  isMock: boolean;
  cached: boolean;
  message?: string;
  error?: string;
};

export function ReferenceAudioCard({
  text,
  lessonId,
  promptId,
  title = "Listen to the reference",
}: {
  text: string;
  lessonId?: string | null;
  promptId?: string | null;
  title?: string;
}) {
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(
    "Reference audio is optional in local mock mode. You can still shadow the text below."
  );
  const [isMock, setIsMock] = useState(true);
  const [isCached, setIsCached] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function requestReferenceAudio() {
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await fetch("/api/reference-audio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          text,
          lessonId,
          promptId,
          voiceStyle: "clear modern British professional",
        }),
      });
      const payload = (await response.json()) as ReferenceAudioResponse;

      if (!response.ok) {
        throw new Error(payload.error ?? "Reference audio is unavailable.");
      }

      setAudioUrl(payload.audioUrl);
      setIsMock(payload.isMock);
      setIsCached(payload.cached);
      setMessage(
        payload.message ??
          (payload.cached
            ? "Using cached reference audio."
            : "Reference audio is ready.")
      );
    } catch (error) {
      setAudioUrl(null);
      setIsMock(true);
      setMessage(
        error instanceof Error
          ? error.message
          : "Reference audio is unavailable."
      );
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              Use the model phrase to prime rhythm, stress, and pace before
              recording your version.
            </CardDescription>
          </div>
          <div className="flex flex-wrap gap-2">
            {isMock ? <Badge variant="outline">Mock fallback</Badge> : null}
            {isCached ? <Badge variant="secondary">Cached</Badge> : null}
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        <blockquote className="rounded-lg border bg-muted/40 p-4 text-base leading-7">
          {text}
        </blockquote>
        {audioUrl ? (
          <AudioPlayer label="British reference audio" src={audioUrl} />
        ) : (
          <Alert>
            <HeadphonesIcon className="size-4" />
            <AlertTitle>Reference text mode</AlertTitle>
            <AlertDescription>
              {message ??
                "Audio generation is off. Read the phrase aloud once, then record your shadowing attempt."}
            </AlertDescription>
          </Alert>
        )}
        <Button
          disabled={isLoading}
          onClick={requestReferenceAudio}
          type="button"
          variant="outline"
        >
          <RefreshCwIcon data-icon="inline-start" />
          {isLoading ? "Checking..." : "Get reference audio"}
        </Button>
      </CardContent>
    </Card>
  );
}

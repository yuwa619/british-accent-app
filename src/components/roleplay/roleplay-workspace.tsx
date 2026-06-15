"use client";

import { useState } from "react";
import { FlagIcon, PlayIcon, SquareIcon } from "lucide-react";

import { RecentRoleplaySessions } from "@/components/roleplay/recent-roleplay-sessions";
import { RoleplayChat } from "@/components/roleplay/roleplay-chat";
import { RoleplayFeedbackPanel } from "@/components/roleplay/roleplay-feedback-panel";
import { RoleplayRecorder } from "@/components/roleplay/roleplay-recorder";
import { RoleplayScenarioSelector } from "@/components/roleplay/roleplay-scenario-selector";
import { RoleplayTextFallback } from "@/components/roleplay/roleplay-text-fallback";
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
import type {
  RecordingItem,
  RoleplayFeedback,
  RoleplayMessage,
  RoleplayScenario,
  RoleplaySession,
} from "@/lib/types";

type StartResponse = {
  session?: RoleplaySession;
  openingMessage?: RoleplayMessage;
  error?: string;
};

type TurnResponse = {
  userMessage?: RoleplayMessage;
  assistantMessage?: RoleplayMessage;
  error?: string;
};

type EndResponse = {
  session?: RoleplaySession;
  feedback?: RoleplayFeedback;
  error?: string;
};

export function RoleplayWorkspace({
  scenarios,
  initialRecentSessions,
}: {
  scenarios: RoleplayScenario[];
  initialRecentSessions: RoleplaySession[];
}) {
  const [selectedScenario, setSelectedScenario] = useState(scenarios[0]);
  const [session, setSession] = useState<RoleplaySession | null>(null);
  const [messages, setMessages] = useState<RoleplayMessage[]>([]);
  const [recentSessions, setRecentSessions] = useState(initialRecentSessions);
  const [feedback, setFeedback] = useState<RoleplayFeedback | null>(null);
  const [textReply, setTextReply] = useState("");
  const [isStarting, setIsStarting] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isEnding, setIsEnding] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function startRoleplay() {
    setIsStarting(true);
    setError(null);
    setFeedback(null);

    try {
      const response = await fetch("/api/roleplay/start", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ scenarioKey: selectedScenario.key }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as StartResponse | null;

      if (!response.ok || !payload?.session || !payload.openingMessage) {
        throw new Error(payload?.error ?? "Unable to start roleplay.");
      }

      setSession(payload.session);
      setMessages([payload.openingMessage]);
      setRecentSessions((current) => [
        payload.session as RoleplaySession,
        ...current.filter((item) => item.id !== payload.session?.id),
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to start roleplay."
      );
    } finally {
      setIsStarting(false);
    }
  }

  async function sendTurn(input: {
    messageText?: string;
    recordingId?: string | null;
    transcript?: string;
  }) {
    if (!session) {
      setError("Start a roleplay session before replying.");
      return;
    }

    setIsThinking(true);
    setError(null);

    try {
      const response = await fetch("/api/roleplay/turn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          scenarioKey: selectedScenario.key,
          ...input,
        }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as TurnResponse | null;

      if (!response.ok || !payload?.userMessage || !payload.assistantMessage) {
        throw new Error(payload?.error ?? "Unable to send this reply.");
      }

      setMessages((current) => [
        ...current,
        payload.userMessage as RoleplayMessage,
        payload.assistantMessage as RoleplayMessage,
      ]);
      setTextReply("");
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to send this reply."
      );
    } finally {
      setIsThinking(false);
    }
  }

  async function submitRecording({
    recording,
    transcript,
  }: {
    recording: RecordingItem;
    transcript: string;
  }) {
    await sendTurn({
      recordingId: recording.id,
      transcript,
    });
  }

  async function endSession() {
    if (!session) return;

    setIsEnding(true);
    setError(null);

    try {
      const response = await fetch("/api/roleplay/end", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sessionId: session.id,
          scenarioKey: selectedScenario.key,
        }),
      });
      const payload = (await response
        .json()
        .catch(() => null)) as EndResponse | null;

      if (!response.ok || !payload?.session || !payload.feedback) {
        throw new Error(payload?.error ?? "Unable to end this session.");
      }

      setSession(payload.session);
      setFeedback(payload.feedback);
      setRecentSessions((current) => [
        payload.session as RoleplaySession,
        ...current.filter((item) => item.id !== payload.session?.id),
      ]);
    } catch (caughtError) {
      setError(
        caughtError instanceof Error
          ? caughtError.message
          : "Unable to end this session."
      );
    } finally {
      setIsEnding(false);
    }
  }

  const isActive = Boolean(session && session.status === "active");

  return (
    <div className="flex flex-col gap-6">
      <RoleplayScenarioSelector
        onSelect={(scenario) => {
          setSelectedScenario(scenario);
          setSession(null);
          setMessages([]);
          setFeedback(null);
          setError(null);
        }}
        scenarios={scenarios}
        selectedScenario={selectedScenario}
      />

      <div className="grid gap-6 xl:grid-cols-[0.8fr_1.2fr]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <FlagIcon className="size-5 text-primary" />
              <CardTitle>{selectedScenario.title}</CardTitle>
              <CardDescription>{selectedScenario.user_goal}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-wrap gap-2">
                {selectedScenario.focus_skills.map((skill) => (
                  <Badge key={skill} variant="outline">
                    {skill}
                  </Badge>
                ))}
              </div>
              <div className="rounded-lg border bg-background p-4">
                <p className="font-medium">Success looks like</p>
                <ul className="mt-3 flex flex-col gap-2 text-sm leading-6 text-muted-foreground">
                  {selectedScenario.success_criteria.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
              <Button
                disabled={isStarting || isActive}
                onClick={startRoleplay}
                type="button"
              >
                <PlayIcon data-icon="inline-start" />
                {isStarting
                  ? "Starting..."
                  : isActive
                    ? "Session active"
                    : "Start roleplay"}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Record your reply</CardTitle>
              <CardDescription>
                Record a short spoken turn, preview it, then submit. You can
                type a transcript if local mock mode cannot transcribe the clip.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col gap-5">
              <RoleplayRecorder
                disabled={!isActive || isThinking}
                onSubmitRecording={submitRecording}
              />
              <RoleplayTextFallback
                disabled={!isActive || isThinking}
                onChange={setTextReply}
                onSubmit={() => sendTurn({ messageText: textReply })}
                value={textReply}
              />
              <Button
                disabled={!isActive || isEnding || messages.length < 2}
                onClick={endSession}
                type="button"
                variant="outline"
              >
                <SquareIcon data-icon="inline-start" />
                {isEnding
                  ? "Preparing feedback..."
                  : "End session and get feedback"}
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="flex flex-col gap-6">
          {error ? (
            <Alert variant="destructive">
              <AlertTitle>Roleplay needs attention</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : null}

          {session ? (
            <RoleplayChat
              isThinking={isThinking || isEnding}
              messages={messages}
              scenario={selectedScenario}
            />
          ) : (
            <Card>
              <CardHeader>
                <CardTitle>Start a scenario to begin</CardTitle>
                <CardDescription>
                  The assistant will open the conversation, then you can reply
                  by voice or text. This is turn-based practice, not live
                  streaming.
                </CardDescription>
              </CardHeader>
            </Card>
          )}

          {feedback ? <RoleplayFeedbackPanel feedback={feedback} /> : null}
        </div>
      </div>

      <RecentRoleplaySessions sessions={recentSessions} />
    </div>
  );
}

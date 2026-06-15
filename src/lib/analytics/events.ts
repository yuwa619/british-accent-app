export const analyticsEvents = {
  signupStarted: "signup_started",
  signupCompleted: "signup_completed",
  onboardingCompleted: "onboarding_completed",
  diagnosticStarted: "diagnostic_started",
  diagnosticCompleted: "diagnostic_completed",
  recordingStarted: "recording_started",
  recordingUploaded: "recording_uploaded",
  recordingDeleted: "recording_deleted",
  allRecordingsDeleted: "all_recordings_deleted",
  speechAnalysisStarted: "speech_analysis_started",
  speechAnalysisCompleted: "speech_analysis_completed",
  feedbackViewed: "feedback_viewed",
  lessonStarted: "lesson_started",
  lessonCompleted: "lesson_completed",
  shadowingCompleted: "shadowing_completed",
  roleplayStarted: "roleplay_started",
  roleplayTurnCompleted: "roleplay_turn_completed",
  roleplayCompleted: "roleplay_completed",
  settingsUpdated: "settings_updated",
  dataDeleteRequested: "data_delete_requested",
  paywallViewed: "paywall_viewed",
  upgradeClicked: "upgrade_clicked",
} as const;

export type AnalyticsEvent =
  (typeof analyticsEvents)[keyof typeof analyticsEvents];

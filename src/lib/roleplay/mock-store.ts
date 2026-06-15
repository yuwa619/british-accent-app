import type {
  RoleplayFeedback,
  RoleplayMessage,
  RoleplaySession,
  RoleplaySessionBundle,
} from "@/lib/types";

type StoredMockRoleplay = {
  session: RoleplaySession;
  messages: RoleplayMessage[];
  feedback: RoleplayFeedback | null;
};

const globalStore = globalThis as typeof globalThis & {
  __accentCoachMockRoleplay?: Map<string, StoredMockRoleplay>;
};

const store =
  globalStore.__accentCoachMockRoleplay ??
  new Map<string, StoredMockRoleplay>();

globalStore.__accentCoachMockRoleplay = store;

export function saveMockRoleplay(bundle: RoleplaySessionBundle) {
  store.set(bundle.session.id, {
    session: bundle.session,
    messages: bundle.messages,
    feedback: bundle.feedback ?? null,
  });

  return bundle;
}

export function getMockRoleplay(sessionId: string) {
  return store.get(sessionId) ?? null;
}

export function updateMockRoleplay(
  sessionId: string,
  update: Partial<StoredMockRoleplay>
) {
  const current = store.get(sessionId);

  if (!current) return null;

  const next = {
    ...current,
    ...update,
  };
  store.set(sessionId, next);

  return next;
}

export function getMockRoleplaySessions() {
  return Array.from(store.values())
    .map((item) => item.session)
    .sort(
      (left, right) =>
        new Date(right.created_at).getTime() -
        new Date(left.created_at).getTime()
    );
}

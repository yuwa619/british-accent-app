export const supabaseEnv = {
  url: process.env.NEXT_PUBLIC_SUPABASE_URL,
  anonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
};

export function isSupabaseConfigured() {
  return Boolean(supabaseEnv.url && supabaseEnv.anonKey);
}

export function getMissingSupabaseEnvKeys() {
  return [
    ["NEXT_PUBLIC_SUPABASE_URL", supabaseEnv.url],
    ["NEXT_PUBLIC_SUPABASE_ANON_KEY", supabaseEnv.anonKey],
  ]
    .filter(([, value]) => !value)
    .map(([key]) => key);
}

export function getSupabasePublicEnv() {
  if (!isSupabaseConfigured()) {
    throw new Error(
      `Supabase is not configured. Missing: ${getMissingSupabaseEnvKeys().join(
        ", "
      )}`
    );
  }

  return {
    url: supabaseEnv.url as string,
    anonKey: supabaseEnv.anonKey as string,
  };
}

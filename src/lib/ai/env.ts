const required = [
  "SUPABASE_URL",
  "SUPABASE_ANON_KEY",
  "SUPABASE_SERVICE_ROLE_KEY",
] as const;

type RequiredEnvKey = (typeof required)[number];

function getEnv(key: RequiredEnvKey): string {
  const value = process.env[key];
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value;
}

function getOptionalEnv(key: string): string | undefined {
  const value = process.env[key];
  return value || undefined;
}

/** True only when every Supabase var required for vector search is present. */
export function hasSupabaseEnv(): boolean {
  return required.every((key) => Boolean(process.env[key]));
}

/**
 * Lazy accessors. Reading a required Supabase value still throws when it is
 * missing, but only at call time (request handling) — importing this module
 * never throws, so `next build` and every non-AI route work without Supabase
 * credentials configured.
 */
export const aiEnv = {
  get OPENAI_API_KEY(): string | undefined {
    return getOptionalEnv("OPENAI_API_KEY");
  },
  get SUPABASE_URL(): string {
    return getEnv("SUPABASE_URL");
  },
  get SUPABASE_ANON_KEY(): string {
    return getEnv("SUPABASE_ANON_KEY");
  },
  get SUPABASE_SERVICE_ROLE_KEY(): string {
    return getEnv("SUPABASE_SERVICE_ROLE_KEY");
  },
} as const;

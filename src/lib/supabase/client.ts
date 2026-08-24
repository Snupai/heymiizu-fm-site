import { createClient } from "@supabase/supabase-js";
import type { Database } from "./types";

// Keep static builds and local development usable before Supabase is configured.
// Requests made with these placeholders will fail normally, while configured
// environments continue to use their real public credentials.
const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? "http://127.0.0.1:54321";
const SUPABASE_ANON_KEY =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "local-anon-key-placeholder";

export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_ANON_KEY,
  {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
    },
  },
);

import { createBrowserClient } from "@supabase/ssr";

// Browser Supabase client — uses anon key, respects Row Level Security
// Use this in Client Components ("use client") and custom hooks
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
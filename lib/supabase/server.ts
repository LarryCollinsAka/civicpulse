import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

// Server Supabase client — uses service role key, can bypass RLS
// Use ONLY in Server Components, Route Handlers, and Server Actions
// Never import this in a "use client" file
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // Called from a Server Component — cookies can't be set
            // This is safe to ignore for read-only operations
          }
        },
      },
    }
  );
}
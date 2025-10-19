import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export function createClient(opts?: { revalidate?: number }) {
  const cookieStore = cookies()

  // If a revalidate value is provided, wrap fetch to attach Next.js
  // caching options so Supabase network requests are cached for
  // the given number of seconds.
  const revalidateSeconds = opts?.revalidate
  const fetchWrapper = revalidateSeconds
    ? (input: RequestInfo, init?: RequestInit) =>
        // `next` isn't part of the standard RequestInit types so cast to any
        // when adding the revalidate hint. Next.js will pick this up and
        // cache the request for the specified seconds.
        fetch(input, { ...(init as any), next: { ...((init as any)?.next || {}), revalidate: revalidateSeconds } } as any)
    : undefined

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      // only pass a custom fetch implementation when needed
      ...(fetchWrapper ? { fetch: fetchWrapper } : {}),
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  )
}
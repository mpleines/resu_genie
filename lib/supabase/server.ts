import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';

const supabaseClient = () => {
  const cookiesStore = cookies();

  return createServerClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        async getAll() {
          return (await cookiesStore).getAll();
        },
        async setAll(cookiesToSet) {
          try {
            const resolvedCookiesStore = await cookiesStore;

            cookiesToSet.forEach(({ name, value, options }) =>
              resolvedCookiesStore.set(name, value, options)
            );
          } catch {}
        },
      },
    }
  );
};

export default supabaseClient;

import { createServerClient } from '@supabase/ssr';
import { Database } from '@/types/supabase';
import { cookies } from 'next/headers';

const supabaseClient = createServerClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  {
    cookies: {
      getAll() {
        return cookies().getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) =>
          cookies().set(name, value, options)
        );
      },
    },
  }
);

export default supabaseClient;

import NextAuth from 'next-auth';
import { SupabaseAdapter } from '@auth/supabase-adapter';
import GoogleProvider from 'next-auth/providers/google';
import Discord from 'next-auth/providers/discord';
import type { Provider } from 'next-auth/providers';
import { checkIfWelcomeEmailAlreadySent, sendWelcomeEmail } from './lib/emails';

const providers: Provider[] = [
  GoogleProvider({
    clientId: process.env.GOOGLE_CLIENT_ID!,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
  }),
  Discord,
];

export const authOptions = {
  adapter: SupabaseAdapter({
    url: process.env.NEXT_PUBLIC_SUPABASE_URL!,
    secret: process.env.SUPABASE_SERVICE_ROLE_KEY!,
  }),
  providers,
  callbacks: {
    async session({ session }) {
      session.user.id = session.user.id;
      return session;
    },
    async signIn({ user }) {
      // FIXME: refactor this, this is blocking the sign and can be scheduled somewhere else
      try {
        const welcomeMailAlreadySent = await checkIfWelcomeEmailAlreadySent(
          user.id
        );
        if (welcomeMailAlreadySent) {
          return true;
        }

        await sendWelcomeEmail(user);
      } catch (error) {
        console.log(error);
        return true;
      }

      // always allow signing in
      return true;
    },
  },
  pages: {
    signIn: '/signin',
  },
};

export const providerMap = providers
  .map((provider) => {
    if (typeof provider === 'function') {
      const providerData = provider();
      return { id: providerData.id, name: providerData.name };
    } else {
      return { id: provider.id, name: provider.name };
    }
  })
  .filter((provider) => provider.id !== 'credentials');

export const { auth, handlers, signIn, signOut } = NextAuth(authOptions);

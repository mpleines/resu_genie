import { redirect } from 'next/navigation';
import { AuthError } from 'next-auth';
import { providerMap, signIn } from '@/auth';
import { Button } from '@/components/ui/button';
import { DiscordLogoIcon } from '@radix-ui/react-icons';
import { AlertDestructive } from '../../components/AlertDestructive';
import Image from 'next/image';
import GoogleIcon from '/public/google.svg';
import DiscordIcon from '/public/discord.svg';

export default async function SignInPage(props: {
  searchParams: { callbackUrl: string | undefined; error: string | undefined };
}) {
  // FIXME: refactor this
  const errorMessage =
    props.searchParams.error === 'OAuthAccountNotLinked'
      ? 'An account with this email address already exists. Did you log in using a different provider last time?'
      : props.searchParams.error;

  return (
    <div className="py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-xl space-y-8">
        <div className="flex flex-col space-y-4">
          <h1 className="text-center text-3xl font-bold tracking-tight">
            Sign in to resugenie.
          </h1>
          <p className="text-center">
            To use resugenie, you'll have to sign in first.
          </p>
        </div>

        <div className="flex flex-col space-y-4">
          {Object.values(providerMap).map((provider) => (
            <form
              key={provider.name}
              action={async () => {
                'use server';
                try {
                  await signIn(provider.id, {
                    redirectTo: props.searchParams?.callbackUrl ?? '',
                  });
                } catch (error) {
                  if (error instanceof AuthError) {
                    return redirect(`/?error=${error.type}`);
                  }

                  throw error;
                }
              }}
            >
              <Button
                type="submit"
                variant="secondary"
                className="w-full text-center"
              >
                {provider.id === 'discord' ? (
                  <Image
                    src={DiscordIcon}
                    alt="Discord Logo"
                    width={24}
                    height={24}
                  />
                ) : undefined}
                {/* FIXME: use real google icon, radix ui does not have google icon */}
                {provider.id === 'google' ? (
                  <Image
                    src={GoogleIcon}
                    alt="Google Logo"
                    width={24}
                    height={24}
                  />
                ) : undefined}
                <span>Sign in with {provider.name}</span>
              </Button>
            </form>
          ))}
        </div>

        {errorMessage && (
          <AlertDestructive className="my-2" message={errorMessage} />
        )}
      </div>
    </div>
  );
}

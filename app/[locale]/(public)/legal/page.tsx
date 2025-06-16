import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function page() {
  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">Legal Notice</h1>
        </div>
        <Card>
          <CardContent className="space-y-4 mt-4">
            <p className="font-medium">resugenie.</p>
            <h1 className="font-bold text-xl">Developer Information</h1>
            <div className="flex flex-col">
              <span className="font-bold">Maik Pleines</span>
              <span className="text-muted-foreground">
                Independent Software Developer
              </span>
            </div>
            <h1 className="text-xl font-bold">Contact Information</h1>
            <div className="flex flex-col">
              <span className="font-bold">E-Mail</span>
              <span className="text-muted-foreground">
                <a href="mailto:service.mpleines@gmail.com">
                  service.mpleines@gmail.com
                </a>
              </span>
            </div>

            <h1 className="text-xl font-bold">Website Information</h1>
            <div className="flex flex-col">
              <span className="font-bold">Domain</span>
              <span className="text-muted-foreground">
                <a href="https://resugenie.app" className="underline">
                  https://resugenie.app
                </a>{' '}
                is owned and operated by Maik Pleines.
              </span>
            </div>

            <h1 className="text-xl font-bold">Related Legal Documents</h1>
            <div className="flex flex-col">
              <span className="text-muted-foreground">
                For complete information about your rights and obligations when
                using my services, please review the{' '}
                <Link href="/privacy-policy" className="underline">
                  Privacy Policy
                </Link>
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

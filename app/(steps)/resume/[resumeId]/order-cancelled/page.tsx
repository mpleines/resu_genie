import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default async function Page({
  params,
}: {
  params: { resumeId: string };
}) {
  return (
    <div className="flex justify-center mt-8">
      <Card className="max-w-md w-full text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <XCircle className="h-12 w-12 text-destructive" />
          </div>
          <h1 className="text-2xl font-bold tracking-tight">Order Cancelled</h1>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            Your order has been cancelled. No charges have been made to your
            account.
          </p>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button asChild size="lg">
            <Link href={`/resume/${params.resumeId}/download-resume`}>
              Return to Resume
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}

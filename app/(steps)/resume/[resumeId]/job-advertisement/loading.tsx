import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Job Advertisement</CardTitle>
        <CardDescription>
          Copy the Job Advertisement Text in here to get started
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Skeleton className="min-h-[250px]" />
      </CardContent>
    </Card>
  );
}

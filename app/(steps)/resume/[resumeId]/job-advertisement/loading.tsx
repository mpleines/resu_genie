import StepperFooter from '@/app/components/StepperFooter';
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
    <div className="space-y-4">
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

      <StepperFooter isDisabled showBackButton={false} />
    </div>
  );
}

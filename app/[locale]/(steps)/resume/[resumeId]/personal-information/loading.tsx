import StepperFooter from '@/app/components/StepperFooter';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Skeleton } from '@/components/ui/skeleton';

export default function Loading() {
  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Contact Information</CardTitle>
          <CardDescription>
            Enter you Contact Information to start
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Name</Label>
            <Skeleton className="h-9" />
          </div>
          <div className="space-y-2">
            <Label>Phone</Label>
            <Skeleton className="h-9" />
          </div>
          <div className="space-y-2">
            <Label>Street</Label>
            <Skeleton className="h-9" />
          </div>
          <div className="space-y-2">
            <Label>City</Label>
            <Skeleton className="h-9" />
          </div>
          <div className="space-y-2">
            <Label>Professional Experience in Years</Label>
            <Skeleton className="h-9" />
          </div>
        </CardContent>
      </Card>
      <StepperFooter isDisabled />
    </div>
  );
}

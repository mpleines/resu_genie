import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import { Label } from '@/components/ui/label';

export default function Loading() {
  return (
    <div className="flex flex-col space-y-4">
      <h1 className="text-xl">Summary</h1>
      <Card>
        <CardHeader>
          <CardTitle>Job Advertisement</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="min-h-[250px]" />
        </CardContent>
      </Card>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Skeleton className="h-9" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">E-Mail</Label>
              <Skeleton className="h-9" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Skeleton className="h-9" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="street">Street</Label>
              <Skeleton className="h-9" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Skeleton className="h-9" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="professional-experience">
                Professional Experience in Years
              </Label>
              <Skeleton className="h-9" />
            </div>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Skills</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            <Skeleton className="ml-2 w-16 h-6 rounded-lg " />
            <Skeleton className="ml-2 w-16 h-6 rounded-lg " />
            <Skeleton className="ml-2 w-16 h-6 rounded-lg " />
          </div>
        </CardContent>
      </Card>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Work Experience</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
      <div>
        <Card>
          <CardHeader>
            <CardTitle>Education</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

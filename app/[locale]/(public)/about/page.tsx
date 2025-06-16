import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import packageJson from '@/package.json';

export default function Page() {
  const versionNumber = packageJson.version;
  const releaseDate = packageJson.releaseDate;
  const formattedReleaseDate = formatDate(new Date(releaseDate));

  return (
    <div className="min-h-screen bg-background py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight">About</h1>
        </div>
        <Card>
          <CardContent className="space-y-4 mt-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Version</span>
              <Badge variant="outline" className="text-sm">
                {versionNumber}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="font-medium">Released</span>
              <span className="text-muted-foreground">
                {formattedReleaseDate}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

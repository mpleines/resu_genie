import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { FileText } from 'lucide-react';
import Link from 'next/link';
import { FunctionComponent } from 'react';

interface ResumePreviewProps {
  resumeId: string;
  name: string;
  skills: string[];
}

const ResumePreview: FunctionComponent<ResumePreviewProps> = ({
  resumeId,
  name,
  skills,
}) => {
  return (
    <Link href={`/resume/${resumeId}/job-advertisement`}>
      <Card className="w-[250px] h-[300px] cursor-pointer hover:shadow-lg transition-shadow">
        <CardContent className="p-4 flex flex-col items-center justify-center h-full">
          <FileText className="w-12 h-12 text-primary mb-2" />
          <h3 className="text-lg font-semibold text-center mb-1">
            {name ? name : 'Unnamed Resume'}
          </h3>
          <p className="text-sm text-muted-foreground text-center mb-4">
            {'Unknown Job Title'}
          </p>
          <div className="flex flex-wrap justify-center gap-1 min-h-[1.5rem]">
            {skills.length > 0 ? (
              <>
                {skills.slice(0, 4).map((skill, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
                {skills.length > 4 && (
                  <Badge variant="secondary" className="text-xs">
                    +{skills.length - 4} more
                  </Badge>
                )}
              </>
            ) : (
              <span className="text-xs text-muted-foreground">
                No skills listed
              </span>
            )}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default ResumePreview;

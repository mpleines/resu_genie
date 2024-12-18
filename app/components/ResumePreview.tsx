'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { formatDate } from '@/lib/utils';
import { FileText } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FunctionComponent } from 'react';

interface ResumePreviewProps {
  resumeId: string;
  name: string;
  skills: string[];
  last_updated: string;
}

const ResumePreview: FunctionComponent<ResumePreviewProps> = ({
  resumeId,
  name,
  skills,
  last_updated,
}) => {
  const router = useRouter();

  const onClick = () => {
    router.push(`/resume/${resumeId}/job-advertisement`);
  };

  return (
    <Card
      className="w-full md:w-[250px] h-[250px] md:h-[300px] cursor-pointer hover:shadow-lg transition-shadow grid place-items-center"
      onClick={onClick}
    >
      <CardContent className="p-4 flex flex-col items-center justify-center h-full">
        <FileText className="w-12 h-12 text-primary mb-2" />
        <h3 className="text-lg font-semibold text-center mb-1">
          {name ? name : 'Unnamed Resume'}
        </h3>
        <p className="text-sm text-muted-foreground text-center">
          {'Unknown Job Title'}
        </p>
        <span className="text-sm text-muted-foreground mb-4">
          Last updated: {formatDate(new Date(last_updated))}
        </span>
        <div className="flex flex-wrap items-center justify-center gap-1 min-h-[1.5rem]">
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
  );
};

export default ResumePreview;

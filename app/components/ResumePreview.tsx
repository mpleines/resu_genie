'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { createClient } from '@/lib/supabase/client';
import { formatDate } from '@/lib/utils';
import { DotsHorizontalIcon } from '@radix-ui/react-icons';
import { FileText, Loader2, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { FunctionComponent, useEffect, useState, useTransition } from 'react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

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
      className="relative w-full h-[250px] md:h-[300px] cursor-pointer hover:shadow-lg transition-shadow grid place-items-center"
      onClick={onClick}
    >
      <div className="absolute top-2 right-2 z-2">
        <ResumePreviewActions resumeId={resumeId} />
      </div>
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

type ResumePreviewActionsProps = {
  resumeId: string;
};

const ResumePreviewActions = ({ resumeId }: ResumePreviewActionsProps) => {
  const { toast } = useToast();
  const router = useRouter();
  const supabase = createClient();
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const deleteResume = async () => {
    startTransition(async () => {
      // FIXME: refactor this and use a RPC function or transactions
      const deletedRecordsResponse = await Promise.all([
        await supabase
          .from('job_advertisement')
          .delete()
          .eq('resume_id', resumeId),
        await supabase
          .from('work_experience')
          .delete()
          .eq('resume_id', resumeId),
        await supabase.from('education').delete().eq('resume_id', resumeId),
        await supabase.from('skills').delete().eq('resume_id', resumeId),
        await supabase
          .from('personal_information')
          .delete()
          .eq('resume_id', resumeId),
      ]);

      if (deletedRecordsResponse.some((response) => response.error)) {
        toast({
          title: 'Error deleting resume',
          description: 'Please try again',
          variant: 'destructive',
        });

        return;
      }

      const response = await supabase
        .from('resume')
        .delete()
        .eq('id', resumeId);

      if (response.error) {
        toast({
          title: 'Error deleting resume',
          description: 'Please try again',
          variant: 'destructive',
        });
      }

      toast({
        title: 'Resume deleted',
        description: 'Your resume has been deleted',
      });

      router.refresh();
    });
  };

  useEffect(() => {
    if (isPending) {
      toast({
        title: 'Deleting resume',
        description: (
          <div className="flex items-center space-x-2">
            <Loader2 className="h-4 w-4 animate-spin" />
            <span className="text-sm">Please wait</span>
          </div>
        ),
      });
    }
  }, [isPending, toast]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" onClick={(e) => e.stopPropagation()}>
          <DotsHorizontalIcon />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent onClick={(e) => e.stopPropagation()}>
        <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
          <AlertDialogTrigger asChild>
            <DropdownMenuItem onSelect={(e) => e.preventDefault()}>
              <Trash2 className="mr-2 h-4 w-4" />
              <span>Delete</span>
            </DropdownMenuItem>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete your
                resume.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={(e) => e.stopPropagation()}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  e.stopPropagation();
                  deleteResume();
                }}
              >
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ResumePreview;

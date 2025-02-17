import { Input, InputProps } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Textarea, TextareaProps } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';

export const SkeletonTextArea: React.FC<
  TextareaProps & { isLoading: boolean }
> = ({ isLoading, ...props }) => {
  if (isLoading) {
    return <Skeleton className={props.className} />;
  }

  return <Textarea {...props} />;
};

export const SkeletonInput: React.FC<InputProps & { isLoading: boolean }> = ({
  isLoading,
  ...props
}) => {
  if (isLoading) {
    return <Skeleton className={cn('h-9', props.className)} />;
  }

  return <Input {...props} />;
};

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { FileIcon } from 'lucide-react';
import Image from 'next/image';
import { FunctionComponent } from 'react';

type ResumeImageCardProps =
  | {
      imgUrl: string;
      alt: string;
      placeholder?: never;
    }
  | {
      placeholder: string;
      alt?: never;
      imgUrl?: never;
    };

const ResumeImageCard: FunctionComponent<ResumeImageCardProps> = ({
  placeholder,
  imgUrl,
  alt,
}) => {
  return (
    <div className="group relative">
      <div
        className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/50 to-primary blur-lg transition-all group-hover:blur-xl"
        aria-hidden="true"
      />
      <div
        className={cn(
          'relative overflow-hidden rounded-xl border shadow-xl',
          placeholder && 'bg-white'
        )}
        style={{ aspectRatio: '3 / 4' }} // Maintain aspect ratio for consistent sizing
      >
        {imgUrl != null && (
          <Image
            src={imgUrl}
            alt={alt}
            className="h-full w-full object-cover"
            width={400}
            height={600}
            priority
          />
        )}
        {placeholder && (
          <div className="h-full flex justify-center items-center text-muted-foreground font-bold">
            {placeholder}
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent p-6">
          <div className="absolute bottom-6 left-6">
            <Badge className="mb-2 gap-1">
              <FileIcon className="h-3 w-3" />
              Minimalistic Template
            </Badge>
            <p className="text-sm text-white">
              For those who prefer a clean and simple design.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeImageCard;

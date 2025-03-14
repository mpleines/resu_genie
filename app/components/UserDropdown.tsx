'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useIsSmallScreen } from '@/hooks/useIsSmallScreen';
import { LogOut, Settings } from 'lucide-react';
import { signOut } from 'next-auth/react';
import { useTranslations } from 'next-intl';
import { useRouter } from 'next/navigation';
interface UserDropdownProps {
  username: string;
  avatarUrl?: string;
}

export function UserDropdown({ username, avatarUrl }: UserDropdownProps) {
  const isSmallScreen = useIsSmallScreen();
  const router = useRouter();
  const t = useTranslations();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <div className="flex items-center space-x-3 bg-secondary p-2 rounded-full shadow-sm">
          <Avatar className="h-8 w-8 border-2 border-primary">
            <AvatarImage src={avatarUrl} alt={username} />
            <AvatarFallback className="bg-primary-foreground text-primary text-sm font-medium">
              {getInitials(username)}
            </AvatarFallback>
          </Avatar>
          {!isSmallScreen && (
            <span className="text-sm font-medium text-foreground">
              {username}
            </span>
          )}
        </div>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>{t('userDropdown.title')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => router.push('/settings')}>
          <Settings className="mr-2 h4- w-4" />
          <span>{t('settings.title')}</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-red-600 focus:text-red-600 focus:bg-red-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>{t('global.signOut')}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;

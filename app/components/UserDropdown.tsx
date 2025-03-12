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
import { LogOut } from 'lucide-react';
import { signOut } from 'next-auth/react';
interface UserDropdownProps {
  username: string;
  avatarUrl?: string;
}

export function UserDropdown({ username, avatarUrl }: UserDropdownProps) {
  const isSmallScreen = useIsSmallScreen();

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
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => signOut({ callbackUrl: '/' })}
          className="text-red-600 focus:text-red-600 focus:bg-red-100"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default UserDropdown;

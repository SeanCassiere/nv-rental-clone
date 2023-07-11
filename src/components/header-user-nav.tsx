import React from "react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";
import { useGetUserProfile } from "@/hooks/network/user/useGetUserProfile";
import { useAuth } from "react-oidc-context";

// function to get the AvatarFallback text for a person's name
function getAvatarFallbackText(name: string) {
  const nameParts = name.split(" ");
  if (nameParts.length === 1 && nameParts[0]) {
    return nameParts[0].charAt(0);
  }
  return `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(0)}`;
}

export const HeaderUserNav = () => {
  const auth = useAuth();

  const userQuery = useGetUserProfile();
  const fullName = `${userQuery.data?.firstName} ${userQuery.data?.lastName}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-10 w-10 rounded-full">
          <Avatar className="h-10 w-10">
            <AvatarImage
              src={`https://avatars.dicebear.com/api/miniavs/${userQuery.data?.userName}.svg?mood[]=happy`}
              alt={fullName}
            />
            <AvatarFallback>{getAvatarFallbackText(fullName)}</AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">
              {userQuery.data?.userName}
            </p>
            <p className="text-xs leading-none text-muted-foreground">
              {userQuery.data?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem>
            Profile
            <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Billing
            <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            Settings
            <DropdownMenuShortcut>⌘S</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>New Team</DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={() => {
            auth.signoutRedirect();
          }}
        >
          Log out
          <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

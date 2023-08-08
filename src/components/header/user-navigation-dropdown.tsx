import React from "react";
import { useAuth } from "react-oidc-context";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
  DropdownMenuGroup,
} from "@/components/ui/dropdown-menu";

import { useGetUserProfile } from "@/hooks/network/user/useGetUserProfile";
import { UI_APPLICATION_NAME } from "@/utils/constants";
import { removeAllLocalStorageKeysForUser } from "@/utils/user-local-storage";

function getAvatarFallbackText(name: string) {
  const nameParts = name.split(" ");
  if (nameParts.length === 1 && nameParts[0]) {
    return nameParts[0].charAt(0);
  }
  return `${nameParts[0]?.charAt(0)}${nameParts[1]?.charAt(0)}`;
}

export const UserNavigationDropdown = () => {
  const auth = useAuth();

  const userQuery = useGetUserProfile();
  const user = userQuery.data?.status === 200 ? userQuery.data?.body : null;

  const fullName = `${user?.firstName} ${user?.lastName}`.trim();

  const handleLogout = () => {
    const client_id = auth.user?.profile.navotar_clientid;
    const user_id = auth.user?.profile.navotar_userid;
    if (client_id && user_id) {
      removeAllLocalStorageKeysForUser(client_id, user_id);
    }

    auth.signoutRedirect();
  };

  return (
    <AlertDialog>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-10 w-10 rounded-full">
            <Avatar className="h-10 w-10">
              <AvatarImage
                src={`https://avatars.dicebear.com/api/miniavs/${user?.userName}.svg?mood[]=happy`}
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
                {user?.userName}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {user?.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <AlertDialogTrigger asChild>
            <DropdownMenuItem>Log out</DropdownMenuItem>
          </AlertDialogTrigger>
        </DropdownMenuContent>
      </DropdownMenu>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            Continuing with this action will sign you out of the&nbsp;
            <strong>{UI_APPLICATION_NAME}</strong> application.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={handleLogout}>Continue</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

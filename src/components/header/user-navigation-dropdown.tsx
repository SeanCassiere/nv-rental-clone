import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

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
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { useTernaryDarkMode } from "@/hooks/internal/useTernaryDarkMode";

import { UI_APPLICATION_NAME } from "@/utils/constants";
import { userQKeys } from "@/utils/query-key";
import { removeAllLocalStorageKeysForUser } from "@/utils/user-local-storage";

import { getAvatarFallbackText, getAvatarUrl } from "@/utils";

export const UserNavigationDropdown = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const clientId = auth.user?.profile.navotar_clientid || "";
  const userId = auth.user?.profile.navotar_userid || "";
  const authParams = { clientId, userId };

  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();

  const userQuery = useQuery(userQKeys.me(authParams));

  const user = userQuery.data?.status === 200 ? userQuery.data?.body : null;

  const fullName = `${user?.firstName || "N"} ${user?.lastName || "A"}`.trim();

  const imgUrl = getAvatarUrl(user?.userName ?? "none");

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
              <AvatarImage src={user ? imgUrl : undefined} alt={fullName} />
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
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  to: "/settings/$destination",
                  params: {
                    destination: "profile",
                  },
                });
              }}
            >
              Profile
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                navigate({
                  to: "/settings/$destination",
                  params: {
                    destination: "profile",
                  },
                });
              }}
            >
              Settings
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>Theme</DropdownMenuSubTrigger>
              <DropdownMenuPortal>
                <DropdownMenuSubContent alignOffset={0} sideOffset={4}>
                  <DropdownMenuRadioGroup
                    value={ternaryDarkMode}
                    onValueChange={(value) => {
                      if (["system", "light", "dark"].includes(value)) {
                        setTernaryDarkMode(value as any);
                      }
                    }}
                  >
                    <DropdownMenuRadioItem value="system">
                      System
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="light">
                      Light
                    </DropdownMenuRadioItem>
                    <DropdownMenuRadioItem value="dark">
                      Dark
                    </DropdownMenuRadioItem>
                  </DropdownMenuRadioGroup>
                </DropdownMenuSubContent>
              </DropdownMenuPortal>
            </DropdownMenuSub>
            <AlertDialogTrigger asChild>
              <DropdownMenuItem>Log out</DropdownMenuItem>
            </AlertDialogTrigger>
          </DropdownMenuGroup>
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

import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { useAuth } from "react-oidc-context";

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
import { icons } from "@/components/ui/icons";

import { useGlobalDialogContext } from "@/hooks/context/modals";
import { useTernaryDarkMode } from "@/hooks/internal/useTernaryDarkMode";

import { userQKeys } from "@/utils/query-key";

import { getAvatarFallbackText, getAvatarUrl } from "@/utils";

export const UserNavigationDropdown = () => {
  const auth = useAuth();
  const navigate = useNavigate();

  const clientId = auth.user?.profile.navotar_clientid || "";
  const userId = auth.user?.profile.navotar_userid || "";
  const authParams = { clientId, userId };

  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  const { setShowLogout } = useGlobalDialogContext();

  const userQuery = useQuery(userQKeys.me(authParams));

  const user = userQuery.data?.status === 200 ? userQuery.data?.body : null;

  const fullName = `${user?.firstName || "N"} ${user?.lastName || "A"}`.trim();

  const imgUrl = getAvatarUrl(user?.userName ?? "none");

  const handleLogout = () => {
    setShowLogout(true);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="group relative h-10 w-10 rounded-full"
        >
          <Avatar>
            <AvatarImage src={user ? imgUrl : undefined} alt={fullName} />
            <AvatarFallback>{getAvatarFallbackText(fullName)}</AvatarFallback>
          </Avatar>
          <span className="absolute -bottom-0.5 -right-0.5 rounded-full border-2 border-background bg-muted transition-colors">
            <icons.ChevronDown className="h-2.5 w-2.5 md:h-3 md:w-3" />
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user?.userName}</p>
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
          <DropdownMenuItem onClick={handleLogout}>Log out</DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

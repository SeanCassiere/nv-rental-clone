import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
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
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { icons } from "@/components/ui/icons";

import { useTernaryDarkMode } from "@/hooks/useTernaryDarkMode";

import { APP_VERSION, IS_LOCAL_DEV } from "@/utils/constants";
import { fetchUserByIdOptions } from "@/utils/query/user";

import { useGlobalDialogContext } from "@/context/modals";
import { getAvatarFallbackText, getAvatarUrl, IsMacLike } from "@/utils";

export const UserNavigationDropdown = () => {
  const auth = useAuth();

  const clientId = auth.user?.profile.navotar_clientid || "";
  const userId = auth.user?.profile.navotar_userid || "";
  const authParams = { clientId, userId };

  const { ternaryDarkMode, setTernaryDarkMode } = useTernaryDarkMode();
  const { setShowLogout, setShowCommandMenu } = useGlobalDialogContext();

  const userQuery = useQuery(
    fetchUserByIdOptions({ auth: authParams, userId: authParams.userId })
  );

  const user = userQuery.data?.status === 200 ? userQuery.data?.body : null;

  const fullName = `${user?.firstName || "N"} ${user?.lastName || "A"}`.trim();

  const imgUrl = getAvatarUrl(user?.userName ?? "none");

  const handleLogout = () => {
    setShowLogout(true);
  };

  const handleSearch = () => {
    setShowCommandMenu(true);
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
      <DropdownMenuContent className="w-64" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="truncate font-medium leading-none">
              {user?.userName}
            </p>
            <p className="truncate text-sm leading-none text-muted-foreground">
              {user?.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild>
            <Link
              to="/settings/$destination"
              params={{ destination: "profile" }}
            >
              <icons.User className="mr-2 h-4 w-4" />
              Profile
            </Link>
          </DropdownMenuItem>
          <DropdownMenuItem asChild>
            <Link to="/settings">
              <icons.Settings className="mr-2 h-4 w-4" />
              Settings
            </Link>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleSearch}>
            <icons.Search className="mr-2 h-4 w-4" />
            <span>Find something</span>
            <DropdownMenuShortcut>
              {IsMacLike ? "⌘" : "Ctrl"} + K
            </DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              {(() => {
                switch (ternaryDarkMode) {
                  case "system":
                    return <icons.System className="mr-2 h-4 w-4" />;
                  case "dark":
                    return <icons.Moon className="mr-2 h-4 w-4" />;
                  case "light":
                    return <icons.Sun className="mr-2 h-4 w-4" />;
                  default:
                    return null;
                }
              })()}
              Theme
            </DropdownMenuSubTrigger>
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
                  <DropdownMenuRadioItem
                    value="system"
                    onSelect={(evt) => evt.preventDefault()}
                  >
                    <span className="inline-flex w-full items-center justify-between">
                      System
                      <icons.System className="ml-2 h-3.5 w-3.5" />
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="light"
                    onSelect={(evt) => evt.preventDefault()}
                  >
                    <span className="inline-flex w-full items-center justify-between">
                      Light
                      <icons.Sun className="ml-2 h-3.5 w-3.5" />
                    </span>
                  </DropdownMenuRadioItem>
                  <DropdownMenuRadioItem
                    value="dark"
                    onSelect={(evt) => evt.preventDefault()}
                  >
                    <span className="inline-flex w-full items-center justify-between">
                      Dark
                      <icons.Moon className="ml-2 h-3.5 w-3.5" />
                    </span>
                  </DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuPortal>
          </DropdownMenuSub>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem onClick={handleLogout}>
            <icons.Logout className="mr-2 h-4 w-4" />
            Log out
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuLabel className="-mx-1 -my-1 bg-muted px-3 py-2.5 text-xs font-normal leading-none text-muted-foreground">
          {APP_VERSION} {IS_LOCAL_DEV ? "(Development)" : "(Production)"}
        </DropdownMenuLabel>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

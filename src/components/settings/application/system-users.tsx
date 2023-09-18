import React, { Suspense } from "react";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQuery } from "@tanstack/react-query";
import { MoreVerticalIcon, PencilIcon, RotateCcwIcon } from "lucide-react";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";

import { userQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";
import { cn, getAvatarFallbackText, getAvatarUrl } from "@/utils";

const SystemUsersSettings = () => {
  const { t } = useTranslation("settings");

  const auth = useAuth();

  return (
    <Card className="shadow-none">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-lg">{t("titles.systemUsers")}</CardTitle>
        <CardDescription className="text-base">
          {t("descriptions.systemUsers")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 lg:px-6 lg:pb-5">
        <Suspense fallback={<Skeleton className="h-72" />}>
          {auth.user?.profile?.navotar_userid &&
          auth.user?.profile?.navotar_clientid ? (
            <UsersList
              clientId={auth.user?.profile?.navotar_clientid}
              userId={auth.user?.profile?.navotar_userid}
            />
          ) : null}
        </Suspense>
      </CardContent>
    </Card>
  );
};

async function getUsers({
  clientId,
  userId,
}: {
  clientId: string;
  userId: string;
}) {
  return await apiClient.user.getUserConfigurations({
    query: { clientId, userId },
  });
}

function UsersList(props: { clientId: string; userId: string }) {
  const { t } = useTranslation();

  const { data } = useQuery({
    queryKey: userQKeys.userConfigurations(),
    queryFn: () => getUsers(props),
    suspense: true,
  });

  const list = data?.status === 200 ? data.body : [];

  return (
    <ul role="list" className="divide-y divide-muted">
      {list.map((user) => (
        <li
          key={`user_config_${user.userID}`}
          className="flex justify-between gap-x-6 py-5"
        >
          <div className="flex min-w-0 gap-x-4">
            <Avatar className="h-12 w-12 flex-none">
              <AvatarImage
                src={getAvatarUrl(user?.userName)}
                alt={user.fullName}
              />
              <AvatarFallback>
                {getAvatarFallbackText(user.fullName)}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-auto text-sm">
              <p className="font-semibold leading-6 text-foreground">
                {user.userName} ({user.fullName})
              </p>
              <p className="mt-1 truncate leading-5 text-muted-foreground">
                {user.email}
              </p>
            </div>
          </div>
          <div className="flex gap-x-4 text-sm">
            <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
              <p className="leading-6 text-foreground">{user.roleName}</p>
              <div className="mt-1 flex items-center gap-x-1.5">
                <div className="flex-none rounded-full bg-background/20 p-1">
                  <div
                    className={cn(
                      "h-2 w-2 rounded-full",
                      user.isActive ? "bg-emerald-500" : "bg-destructive"
                    )}
                  />
                </div>
                <p className="leading-5 text-muted-foreground">
                  {user.isActive
                    ? t("display.active", { ns: "labels" })
                    : t("display.inactive", { ns: "labels" })}
                </p>
              </div>
            </div>
            <div className="flex grow-0 items-center justify-center">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="h-8 w-8">
                    <MoreVerticalIcon className="h-3 w-3 lg:h-4 lg:w-4" />
                    <span className="sr-only">
                      {t("buttons.edit", { ns: "labels" })}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuGroup>
                    <DropdownMenuItem>
                      <PencilIcon className="mr-2 h-3 w-3" />
                      <span>{t("buttons.edit", { ns: "labels" })}</span>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem className="text-destructive">
                      <RotateCcwIcon className="mr-2 h-3 w-3" />
                      <span>
                        {t("buttons.resetPassword", { ns: "labels" })}
                      </span>
                    </DropdownMenuItem>
                  </DropdownMenuGroup>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}

export default SystemUsersSettings;

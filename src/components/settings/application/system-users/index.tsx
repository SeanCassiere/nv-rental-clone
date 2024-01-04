import React, { Suspense } from "react";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useSuspenseQuery } from "@tanstack/react-query";
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
import { icons } from "@/components/ui/icons";
import { Skeleton } from "@/components/ui/skeleton";

import type { TUserConfigurations } from "@/schemas/user";

import { userQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";
import { cn, getAvatarFallbackText, getAvatarUrl } from "@/utils";

import { EditUserDialog } from "./edit-user";
import { ResetPasswordAlertDialog } from "./reset-password";

const SystemUsersSettings = () => {
  const { t } = useTranslation();

  const auth = useAuth();

  const [showNewUser, setShowNewUser] = React.useState(false);

  return (
    <>
      {auth.user?.profile?.navotar_userid &&
        auth.user?.profile?.navotar_clientid && (
          <EditUserDialog
            mode="new"
            open={showNewUser}
            setOpen={setShowNewUser}
            intendedUserId=""
            clientId={auth.user?.profile?.navotar_clientid}
            userId={auth.user?.profile?.navotar_userid}
          />
        )}
      <Card className="shadow-none">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg">
            {t("titles.systemUsers", { ns: "settings" })}
          </CardTitle>
          <CardDescription className="text-base">
            {t("descriptions.systemUsers", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
          <div className="flex items-center justify-start pb-4">
            <Button size="sm" onClick={() => setShowNewUser(true)}>
              <icons.Plus className="h-4 w-4 sm:mr-2" />
              <span>{t("labels.addUser", { ns: "settings" })}</span>
            </Button>
          </div>
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
    </>
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

interface UserListProps {
  clientId: string;
  userId: string;
}
function UsersList(props: UserListProps) {
  const { data } = useSuspenseQuery({
    queryKey: userQKeys.userConfigurations(),
    queryFn: () =>
      getUsers({
        clientId: props.clientId,
        userId: props.userId,
      }),
  });

  const users = (data?.status === 200 ? data.body : []).sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );

  return (
    <ul role="list" className="divide-y divide-muted">
      {users.map((user) => (
        <SystemUser key={`user_config_${user.userID}`} user={user} {...props} />
      ))}
    </ul>
  );
}

function SystemUser({
  user,
  ...props
}: { user: TUserConfigurations[number] } & UserListProps) {
  const { t } = useTranslation();

  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [showEditUser, setShowEditUser] = React.useState(false);

  return (
    <>
      <ResetPasswordAlertDialog
        open={showForgotPassword}
        setOpen={setShowForgotPassword}
        user={user}
        clientId={props.clientId}
        userId={props.userId}
      />
      <EditUserDialog
        mode="edit"
        open={showEditUser}
        setOpen={setShowEditUser}
        intendedUserId={String(user.userID)}
        clientId={props.clientId}
        userId={props.userId}
      />
      <li className="flex justify-between gap-x-6 py-5">
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
              {user.fullName} ({user.userName})
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
              <p className="select-none leading-5 text-muted-foreground">
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
                  <icons.More className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="sr-only">
                    {t("buttons.moreActions", { ns: "labels" })}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setShowEditUser(true)}>
                    <icons.Edit className="mr-2 h-3 w-3" />
                    <span>{t("buttons.edit", { ns: "labels" })}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setShowForgotPassword(true)}
                  >
                    <icons.RotateBackwards className="mr-2 h-3 w-3" />
                    <span>{t("labels.resetPassword", { ns: "settings" })}</span>
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </li>
    </>
  );
}

export default SystemUsersSettings;

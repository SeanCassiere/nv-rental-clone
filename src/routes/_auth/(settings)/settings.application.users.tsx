import React, { Suspense } from "react";
import { AvatarImage } from "@radix-ui/react-avatar";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button, buttonVariants } from "@/components/ui/button";
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

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import type { TUserConfigurations } from "@/lib/schemas/user";
import {
  fetchUserByIdOptions,
  fetchUserConfigurationOptions,
} from "@/lib/query/user";

import { titleMaker } from "@/lib/utils/title-maker";

import { cn, getAvatarFallbackText, getAvatarUrl } from "@/lib/utils";

import { UserEditDialog } from "./-components/application/user-edit-dialog";
import { UserResetPasswordDialog } from "./-components/application/user-reset-password-dialog";

export const Route = createFileRoute(
  "/_auth/(settings)/settings/application/users"
)({
  beforeLoad: ({ context }) => {
    const { authParams } = context;
    return {
      systemUsersListOptions: fetchUserConfigurationOptions({
        auth: authParams,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, systemUsersListOptions } = context;
    await queryClient.ensureQueryData(systemUsersListOptions);

    return;
  },
  component: ApplicationConfigurationUsersPage,
});

function ApplicationConfigurationUsersPage() {
  const { t } = useTranslation();

  const auth = useAuth();

  const [showNewUser, setShowNewUser] = React.useState(false);

  useDocumentTitle(
    titleMaker(
      t("titles.page", {
        ns: "settings",
        pageTitle: t("titles.systemUsers", { ns: "settings" }),
      })
    )
  );

  return (
    <article className="flex flex-col gap-4">
      {auth.user?.profile?.navotar_userid &&
        auth.user?.profile?.navotar_clientid && (
          <UserEditDialog
            mode="new"
            open={showNewUser}
            setOpen={setShowNewUser}
            intendedUserId=""
            clientId={auth.user?.profile?.navotar_clientid}
            userId={auth.user?.profile?.navotar_userid}
          />
        )}
      <div>
        <Link
          from="/settings/application/users"
          to=".."
          className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
        >
          <icons.ChevronLeft className="mr-2 h-3 w-3" />
          <span>{t("buttons.back", { ns: "labels" })}</span>
        </Link>
      </div>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("titles.systemUsers", { ns: "settings" })}
          </CardTitle>
          <CardDescription>
            {t("descriptions.systemUsers", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex items-center justify-start pb-4">
            <Button size="sm" onClick={() => setShowNewUser(true)}>
              <icons.Plus className="h-4 w-4 sm:mr-2" />
              <span>{t("labels.addUser", { ns: "settings" })}</span>
            </Button>
          </div>
          <Suspense fallback={<Skeleton className="h-72" />}>
            <ListUsers />
          </Suspense>
        </CardContent>
      </Card>
    </article>
  );
}

function ListUsers() {
  const { authParams, systemUsersListOptions } = Route.useRouteContext();
  const { data } = useSuspenseQuery(systemUsersListOptions);

  const users = (data?.status === 200 ? data.body : []).sort((a, b) =>
    a.fullName.localeCompare(b.fullName)
  );

  return (
    <ul role="list" className="divide-y divide-muted">
      {users.map((user) => (
        <ListItemUser
          key={`user_config_${user.userID}`}
          user={user}
          auth={authParams}
        />
      ))}
    </ul>
  );
}

function ListItemUser({
  user,
  auth,
}: {
  user: TUserConfigurations[number];
  auth: { clientId: string; userId: string };
}) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const [showForgotPassword, setShowForgotPassword] = React.useState(false);
  const [showEditUser, setShowEditUser] = React.useState(false);

  const handlePrefetch = () => {
    queryClient.prefetchQuery(
      fetchUserByIdOptions({ auth, userId: user.userID })
    );
  };

  return (
    <>
      <UserResetPasswordDialog
        open={showForgotPassword}
        setOpen={setShowForgotPassword}
        user={user}
        clientId={auth.clientId}
        userId={auth.userId}
      />
      <UserEditDialog
        mode="edit"
        open={showEditUser}
        setOpen={setShowEditUser}
        intendedUserId={String(user.userID)}
        clientId={auth.clientId}
        userId={auth.userId}
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
              <DropdownMenuTrigger
                onMouseOver={handlePrefetch}
                onTouchStart={handlePrefetch}
                asChild
              >
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

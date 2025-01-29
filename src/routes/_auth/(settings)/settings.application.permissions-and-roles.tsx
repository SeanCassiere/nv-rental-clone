import * as React from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/empty-state";
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
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import type { RoleListItem } from "@/lib/schemas/role";
import { fetchRoleByIdOptions, fetchRolesListOptions } from "@/lib/query/role";

import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

import { RoleDeleteDialog } from "./-components/application/role-delete-dialog";
import { RoleEditDialog } from "./-components/application/role-edit-dialog";

export const Route = createFileRoute(
  "/_auth/(settings)/settings/application/permissions-and-roles"
)({
  beforeLoad: ({ context }) => {
    const { authParams } = context;
    return {
      systemRolesListOptions: fetchRolesListOptions({
        auth: authParams,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, systemRolesListOptions } = context;

    await queryClient.ensureQueryData(systemRolesListOptions);

    return;
  },
  component: PermissionsAndRolesPage,
});

function PermissionsAndRolesPage() {
  const { t } = useTranslation();

  const context = Route.useRouteContext();
  const auth = context.authParams;

  const [filterMode, setFilterMode] = React.useState("all");
  const [showNew, setShowNew] = React.useState(false);

  useDocumentTitle(
    titleMaker(
      t("titles.page", {
        ns: "settings",
        pageTitle: t("titles.permissionsAndRoles", { ns: "settings" }),
      })
    )
  );

  return (
    <article className="flex flex-col gap-4">
      <RoleEditDialog
        mode="new"
        open={showNew}
        setOpen={setShowNew}
        clientId={auth.clientId}
        userId={auth.userId}
        roleId={""}
      />
      <div>
        <Link
          from="/settings/application/permissions-and-roles"
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
            {t("titles.permissionsAndRoles", { ns: "settings" })}
          </CardTitle>
          <CardDescription>
            {t("descriptions.permissionsAndRoles", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="pb-4">
          <div className="flex flex-col justify-start gap-2 pb-4 md:flex-row md:items-center">
            <Button
              size="sm"
              className="w-max"
              onClick={() => setShowNew(true)}
            >
              <icons.Plus className="h-4 w-4 sm:mr-2" />
              <span>{t("labels.addUserRole", { ns: "settings" })}</span>
            </Button>
            <Select value={filterMode} onValueChange={setFilterMode}>
              <SelectTrigger className="h-9 w-full md:w-[180px]">
                <SelectValue placeholder="Select" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  <SelectItem value="all">
                    {t("display.allResults", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="user">
                    {t("display.userGenerated", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="system">
                    {t("display.systemGenerated", { ns: "labels" })}
                  </SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>
          <React.Suspense fallback={<Skeleton className="h-72" />}>
            <SystemRolesList filterMode={filterMode} />
          </React.Suspense>
        </CardContent>
      </Card>
    </article>
  );
}

function filterRoles(roles: RoleListItem[], type: string) {
  switch (type.toLowerCase()) {
    case "system":
      return roles.filter((r) => r.type <= 0);
    case "user":
      return roles.filter((r) => r.type > 0);
    case "all":
    default:
      return roles;
  }
}

function SystemRolesList({ filterMode }: { filterMode: string }) {
  const context = Route.useRouteContext();
  const auth = context.authParams;

  const rolesQuery = useSuspenseQuery(context.systemRolesListOptions);
  const roles = filterRoles(
    (rolesQuery.data?.status === 200 ? (rolesQuery.data?.body ?? []) : []).sort(
      (a, b) => a.roleName.localeCompare(b.roleName)
    ),
    filterMode
  );

  return (
    <ul role="list" className="divide-muted divide-y">
      {roles.length === 0 ? (
        <li>
          <EmptyState
            title={t("display.noResultsFound", { ns: "labels" })}
            subtitle={t("noResultsWereFoundForThisSearch", { ns: "messages" })}
          />
        </li>
      ) : (
        <>
          {roles.map((role, idx) => (
            <SystemRole
              key={`role_list_item_${role.userRoleID}_${idx}`}
              role={role}
              clientId={auth.clientId}
              userId={auth.userId}
            />
          ))}
        </>
      )}
    </ul>
  );
}

function SystemRole({
  role,
  ...props
}: {
  clientId: string;
  userId: string;
  role: RoleListItem;
}) {
  const { t } = useTranslation();

  const queryClient = useQueryClient();

  const auth = { clientId: props.clientId, userId: props.userId };

  const isSystemRole = role.type <= 0; // role.type is less than or equal to 0

  const [showEdit, setShowEdit] = React.useState(false);
  const [showDelete, setShowDelete] = React.useState(false);

  const handlePrefetch = () => {
    queryClient.prefetchQuery(
      fetchRoleByIdOptions({ auth, roleId: role.userRoleID })
    );
  };

  return (
    <>
      <RoleEditDialog
        mode="edit"
        open={showEdit}
        setOpen={setShowEdit}
        clientId={props.clientId}
        userId={props.userId}
        roleId={String(role.userRoleID)}
      />
      <RoleDeleteDialog
        open={showDelete}
        setOpen={setShowDelete}
        clientId={props.clientId}
        userId={props.userId}
        roleId={String(role.userRoleID)}
      />
      <li className="flex justify-between gap-x-6 py-5">
        <div className="flex min-w-0 gap-x-4">
          <div className="max-w-xl min-w-0 flex-auto text-sm">
            <p
              className={cn(
                "flex items-baseline leading-6 font-semibold",
                isSystemRole ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {!isSystemRole && <icons.User className="mr-2 h-3 w-3" />}
              {isSystemRole && <icons.System className="mr-2 h-3 w-3" />}
              {role.roleName}
            </p>
            <p className="text-muted-foreground mt-1 truncate leading-5">
              {role.description}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-x-4 text-sm">
          <div className="hidden shrink-0 sm:flex sm:flex-col sm:items-end">
            <p
              className={cn(
                "leading-6",
                isSystemRole ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {role.createdBy}
            </p>
          </div>
          <div className="flex grow-0 items-center justify-center">
            <DropdownMenu>
              <DropdownMenuTrigger
                onMouseOver={handlePrefetch}
                onTouchStart={handlePrefetch}
                asChild
              >
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={isSystemRole}
                  className="h-8 w-8"
                >
                  <icons.More className="h-3 w-3 lg:h-4 lg:w-4" />
                  <span className="sr-only">
                    {t("buttons.moreActions", { ns: "labels" })}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuGroup>
                  <DropdownMenuItem onClick={() => setShowEdit(true)}>
                    <icons.Edit className="mr-2 h-3 w-3" />
                    <span>{t("buttons.edit", { ns: "labels" })}</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    className="text-destructive"
                    onClick={() => setShowDelete(true)}
                  >
                    <icons.Delete className="mr-2 h-3 w-3" />
                    <span>{t("labels.deleteRole", { ns: "settings" })}</span>
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

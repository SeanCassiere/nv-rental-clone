import React, { Suspense } from "react";
import { useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { t } from "i18next";
import { useTranslation } from "react-i18next";

import { EmptyState } from "@/components/layouts/empty-state";
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

import { RoleListItem } from "@/lib/schemas/role";
import { fetchRoleByIdOptions } from "@/lib/query/role";

import { titleMaker } from "@/lib/utils/title-maker";

import { cn } from "@/lib/utils";

import { RoleDeleteDialog } from "./-components/role-delete-dialog";
import { RoleEditDialog } from "./-components/role-edit-dialog";

export const Route = createLazyFileRoute(
  "/_auth/settings/application/permissions-and-roles"
)({
  component: PermissionsAndRolesPage,
});

const routeApi = getRouteApi(
  "/_auth/settings/application/permissions-and-roles"
);

function PermissionsAndRolesPage() {
  const { t } = useTranslation();

  const context = routeApi.useRouteContext();
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
    <>
      <RoleEditDialog
        mode="new"
        open={showNew}
        setOpen={setShowNew}
        clientId={auth.clientId}
        userId={auth.userId}
        roleId={""}
      />
      <Card className="shadow-none">
        <CardHeader className="p-4 lg:p-6">
          <CardTitle className="text-lg">
            {t("titles.permissionsAndRoles", { ns: "settings" })}
          </CardTitle>
          <CardDescription className="text-base">
            {t("descriptions.permissionsAndRoles", { ns: "settings" })}
          </CardDescription>
        </CardHeader>
        <CardContent className="px-4 pb-4 pt-0 lg:px-6 lg:pb-5">
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
          <Suspense fallback={<Skeleton className="h-72" />}>
            <SystemRolesList filterMode={filterMode} />
          </Suspense>
        </CardContent>
      </Card>
    </>
  );
}

function filterRoles(role: RoleListItem[], type: string) {
  switch (type.toLowerCase()) {
    case "system":
      return role.filter((r) => r.type <= 0);
    case "user":
      return role.filter((r) => r.type > 0);
    case "all":
    default:
      return role;
  }
}

function SystemRolesList({ filterMode }: { filterMode: string }) {
  const context = routeApi.useRouteContext();
  const auth = context.authParams;

  const rolesQuery = useSuspenseQuery(context.systemRolesListOptions);
  const roles = React.useMemo(
    () =>
      filterRoles(
        (rolesQuery.data?.status === 200
          ? rolesQuery.data?.body ?? []
          : []
        ).sort((a, b) => a.roleName.localeCompare(b.roleName)),
        filterMode
      ),
    [filterMode, rolesQuery.data?.body, rolesQuery.data?.status]
  );

  return (
    <ul role="list" className="divide-y divide-muted">
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
          <div className="min-w-0 max-w-xl flex-auto text-sm">
            <p
              className={cn(
                "flex items-baseline font-semibold leading-6",
                isSystemRole ? "text-muted-foreground" : "text-foreground"
              )}
            >
              {!isSystemRole && <icons.User className="mr-2 h-3 w-3" />}
              {isSystemRole && <icons.System className="mr-2 h-3 w-3" />}
              {role.roleName}
            </p>
            <p className="mt-1 truncate leading-5 text-muted-foreground">
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

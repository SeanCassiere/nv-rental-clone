import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { AccordionItem } from "@radix-ui/react-accordion";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import {
  Accordion,
  AccordionContent,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { InputCheckbox } from "@/components/ui/input-checkbox";
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Textarea } from "@/components/ui/textarea";

import type { PermissionListItem, RoleListItem } from "@/schemas/role";

import { roleQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

interface EditRoleDialogProps {
  mode: "new" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  roleId: string;
  clientId: string;
  userId: string;
}

export function EditRoleDialog({
  open,
  setOpen,
  ...props
}: EditRoleDialogProps) {
  const { t } = useTranslation();
  const qc = useQueryClient();

  const formId = React.useId();

  const permissionsQuery = useQuery(
    roleQKeys.permissionsList({
      clientId: props.clientId,
      userId: props.userId,
    })
  );

  const rolesQuery = useQuery(
    roleQKeys.all({ clientId: props.clientId, userId: props.userId })
  );

  const roleQueryOptions = roleQKeys.getById({
    clientId: props.clientId,
    userId: props.userId,
    roleId: props.roleId,
  });
  const roleQuery = useQuery({
    ...roleQueryOptions,
    enabled: roleQueryOptions.enabled && props.mode === "edit" && open,
  });

  const permissionsList =
    permissionsQuery.data?.status === 200 ? permissionsQuery.data?.body : [];
  const roles = rolesQuery.data?.status === 200 ? rolesQuery.data?.body : [];
  const role = roleQuery.data?.status === 200 ? roleQuery.data?.body : null;

  const createRole = useMutation({
    mutationFn: apiClient.role.createRole,
    onMutate: () => {
      qc.cancelQueries({
        queryKey: roleQKeys.all({
          clientId: props.clientId,
          userId: props.userId,
        }).queryKey,
      });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: roleQKeys.all({
          clientId: props.clientId,
          userId: props.userId,
        }).queryKey,
      });

      if (data.status >= 200 && data.status < 300) {
        toast.success(
          t("labelCreated", {
            ns: "messages",
            label: t("labels.role", { ns: "settings" }),
          })
        );

        setOpen(false);
        return;
      }

      toast.error(
        t("somethingWentWrong", {
          ns: "messages",
        }),
        {
          description: t("pleaseTryAgain", {
            ns: "messages",
          }),
        }
      );
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(
          t("somethingWentWrong", {
            ns: "messages",
          }),
          {
            description:
              err?.message ||
              t("pleaseTryAgain", {
                ns: "messages",
              }),
          }
        );
      }
    },
  });

  const updateRole = useMutation({
    mutationFn: apiClient.role.updateRolePermissions,
    onMutate: () => {
      qc.cancelQueries({
        queryKey: roleQKeys.all({
          clientId: props.clientId,
          userId: props.userId,
        }).queryKey,
      });
      qc.cancelQueries({
        queryKey: roleQKeys.getById({
          clientId: props.clientId,
          userId: props.userId,
          roleId: props.roleId,
        }).queryKey,
      });
    },
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: roleQKeys.all({
          clientId: props.clientId,
          userId: props.userId,
        }).queryKey,
      });
      qc.invalidateQueries({
        queryKey: roleQKeys.getById({
          clientId: props.clientId,
          userId: props.userId,
          roleId: props.roleId,
        }).queryKey,
      });

      if (data.status >= 200 && data.status < 300) {
        toast.success(
          t("labelUpdated", {
            ns: "messages",
            label: t("labels.role", { ns: "settings" }),
          })
        );

        setOpen(false);
        return;
      }

      toast.error(
        t("somethingWentWrong", {
          ns: "messages",
        }),
        {
          description: t("pleaseTryAgain", {
            ns: "messages",
          }),
        }
      );
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(
          t("somethingWentWrong", {
            ns: "messages",
          }),
          {
            description:
              err?.message ||
              t("pleaseTryAgain", {
                ns: "messages",
              }),
          }
        );
      }
    },
  });

  const isPending = createRole.isPending || updateRole.isPending;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "new"
              ? t("titles.newUserRole", { ns: "settings" })
              : t("titles.editUserRole", { ns: "settings" })}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "new"
              ? t("descriptions.newUserRole", { ns: "settings" })
              : t("descriptions.editUserRole", { ns: "settings" })}
          </DialogDescription>
        </DialogHeader>
        {props.mode === "new" && (
          <RoleForm
            formId={formId}
            permissions={permissionsList}
            roles={roles}
            pending={isPending}
            initialData={{
              name: "",
              description: "",
              permissions: [],
            }}
            clientId={props.clientId}
            userId={props.userId}
            onSubmit={(data) => {
              createRole.mutate({
                body: {
                  roleName: data.name,
                  description: data.description,
                  permissions: data.permissions,
                  clientId: props.clientId,
                },
              });
            }}
          />
        )}
        {props.mode === "edit" && role && (
          <RoleForm
            formId={formId}
            permissions={permissionsList}
            roles={roles}
            pending={isPending}
            initialData={{
              name: role.roleName,
              description: role.description ?? "",
              permissions: role.permissions.map((p) => p.functionID),
            }}
            clientId={props.clientId}
            userId={props.userId}
            onSubmit={(data) => {
              const originalPermissions = role.permissions.map(
                (p) => p.functionID
              );
              const name = data.name;
              const description = data.description;

              const permissionsAdded = data.permissions.filter(
                (item) => !originalPermissions.includes(item)
              );
              const permissionsRemoved = originalPermissions.filter(
                (item) => !data.permissions.includes(item)
              );

              if (updateRole.isPending) return;

              updateRole.mutate({
                params: { roleId: props.roleId },
                body: {
                  roleName: name,
                  description: description,
                  addPermissions: permissionsAdded,
                  deletePermissions: permissionsRemoved,
                  clientId: props.clientId,
                },
              });
            }}
          />
        )}
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={isPending}
            aria-disabled={isPending}
          >
            {t("buttons.cancel", { ns: "labels" })}
          </Button>
          <Button type="submit" form={formId} aria-disabled={isPending}>
            {isPending && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
            {props.mode === "edit"
              ? t("buttons.saveChanges", { ns: "labels" })
              : t("buttons.save", { ns: "labels" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function RoleForm(props: {
  formId: string;
  permissions: PermissionListItem[];
  roles: RoleListItem[];
  initialData: { name: string; description: string; permissions: number[] };
  onSubmit: (data: {
    name: string;
    description: string;
    permissions: number[];
  }) => void;
  pending?: boolean;
  clientId: string;
  userId: string;
}) {
  const { t } = useTranslation();

  const [shadowTemplateId, setShadowTemplateId] = React.useState(0);
  const required = t("display.required", { ns: "labels" });

  const zodSchema = React.useMemo(
    () =>
      z.object({
        name: z.string().min(1, required),
        templateId: z.number(),
        description: z.string().min(1, required),
        permissions: z.array(z.number()),
      }),
    [required]
  );

  const form = useForm<z.infer<typeof zodSchema>>({
    resolver: zodResolver(zodSchema),
    defaultValues: {
      name: props.initialData.name,
      description: props.initialData.description,
      permissions: props.initialData.permissions,
      templateId: 0,
    },
  });

  const templateId = form.watch("templateId");

  const roleQueryOptions = roleQKeys.getById({
    roleId: String(templateId),
    clientId: props.clientId,
    userId: props.userId,
  });
  const roleQuery = useQuery({
    ...roleQueryOptions,
    enabled: roleQueryOptions.enabled && templateId !== 0,
  });

  React.useEffect(() => {
    if (templateId === 0) return;
    if (roleQuery.status !== "success") return;
    if (roleQuery.data?.status !== 200) return;
    const data = roleQuery.data?.body;

    form.setValue(
      "permissions",
      data.permissions.map((p) => p.functionID)
    );
    form.setValue("templateId", 0);
  }, [form, roleQuery.data, roleQuery.status, templateId]);

  return (
    <Form {...form}>
      <form
        id={props.formId}
        className="flex flex-col gap-4"
        onSubmit={form.handleSubmit(async (data) => {
          props?.onSubmit?.(data);
        })}
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("display.name", { ns: "labels" })}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("display.name", { ns: "labels" })}
                  readOnly={props.pending}
                  autoComplete="off"
                  autoFocus
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("display.description", { ns: "labels" })}
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="resize-none"
                  placeholder={t("display.description", { ns: "labels" })}
                  readOnly={props.pending}
                  autoComplete="off"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="templateId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>
                {t("display.copyFromExisting", { ns: "labels" })}
              </FormLabel>
              <InputSelect
                placeholder={t("labels.selectARole", {
                  ns: "settings",
                })}
                disabled={props.pending}
                defaultValue={String(shadowTemplateId)}
                onValueChange={(val) => {
                  field.onChange(Number(val));
                  setShadowTemplateId(Number(val));
                }}
                items={props.roles.map((role, idx) => ({
                  id: `role_${idx}_${role.userRoleID}`,
                  value: String(role.userRoleID),
                  label: `${role.roleName}`,
                }))}
              >
                <FormControl>
                  <InputSelectTrigger />
                </FormControl>
                <InputSelectContent />
              </InputSelect>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="permissions"
          render={({ field }) => (
            <FormItem>
              <FormMessage />
              <PermissionSelector
                permissionsList={props.permissions}
                selected={field.value}
                onSelect={field.onChange}
              />
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

/**
 * System Function Category
 * ```md
 * 1. Vehicle
 * 2. Customer
 * 3. Reservation
 * 4. Agreement
 * 5. Admin
 * 6. Dashboard
 * 7. Reports
 * 8. GPS
 * ```
 */
function filterPermissions(permissions: PermissionListItem[], code: number) {
  return permissions.filter((p) => p.systemFunctionCategory === code);
}

function PermissionSelector({
  permissionsList,
  ...props
}: {
  permissionsList: PermissionListItem[];
  selected: number[];
  onSelect: (permissions: number[]) => void;
  disabled?: boolean;
}) {
  const vehicle = filterPermissions(permissionsList, 1);
  const customer = filterPermissions(permissionsList, 2);
  const reservation = filterPermissions(permissionsList, 3);
  const agreement = filterPermissions(permissionsList, 4);
  const admin = filterPermissions(permissionsList, 5);
  const dashboard = filterPermissions(permissionsList, 6);
  const reports = filterPermissions(permissionsList, 6);
  const gps = filterPermissions(permissionsList, 7);

  return (
    <Accordion type="multiple" className="divide-y divide-muted">
      <AccordionItem value="dashboard">
        <AccordionTrigger>Dashboard</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {dashboard.map((permission, idx) => (
              <PermissionBox
                key={`dashboard_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="admin">
        <AccordionTrigger>Admin</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {admin.map((permission, idx) => (
              <PermissionBox
                key={`admin_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="fleet">
        <AccordionTrigger>Fleet</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {vehicle.map((permission, idx) => (
              <PermissionBox
                key={`vehicle_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="customers">
        <AccordionTrigger>Customers</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {customer.map((permission, idx) => (
              <PermissionBox
                key={`customer_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="reservations">
        <AccordionTrigger>Reservations</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {reservation.map((permission, idx) => (
              <PermissionBox
                key={`reservation_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="agreements">
        <AccordionTrigger>Agreements</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {agreement.map((permission, idx) => (
              <PermissionBox
                key={`agreement_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="reports">
        <AccordionTrigger>Reports</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {reports.map((permission, idx) => (
              <PermissionBox
                key={`reports_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="gps">
        <AccordionTrigger>GPS</AccordionTrigger>
        <AccordionContent>
          <ul className="grid gap-2">
            {gps.map((permission, idx) => (
              <PermissionBox
                key={`gps_perm_${permission.functionID}_${idx}`}
                selected={props.selected}
                permission={permission}
                onSelect={props.onSelect}
              />
            ))}
          </ul>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}

function PermissionBox(props: {
  selected: number[];
  permission: PermissionListItem;
  onSelect: (permissions: number[]) => void;
  disabled?: boolean;
}) {
  return (
    <li className="w-full">
      <InputCheckbox
        label={props.permission.displayName ?? ""}
        checked={props.selected.includes(props.permission.functionID)}
        onCheckedChange={(checked) => {
          if (checked) {
            props.onSelect([...props.selected, props.permission.functionID]);
          } else {
            props.onSelect(
              props.selected.filter((p) => p !== props.permission.functionID)
            );
          }
        }}
        disabled={props.disabled}
      />
    </li>
  );
}

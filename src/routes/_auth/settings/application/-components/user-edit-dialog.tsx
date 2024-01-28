import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import { InputCheckbox } from "@/components/ui/input-checkbox";
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import type { RoleListItem } from "@/schemas/role";
import {
  buildUpdateUserSchema,
  UserLanguageItem,
  type TUserProfile,
  type UpdateUserInput,
} from "@/schemas/user";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { fetchLocationsListOptions } from "@/utils/query/location";
import { fetchRolesListOptions } from "@/utils/query/role";
import {
  createUserMutationOptions,
  fetchActiveUsersCountOptions,
  fetchLanguagesForUsersOptions,
  fetchMaximumUsersCountOptions,
  fetchUserByIdOptions,
  fetchUserConfigurationOptions,
  updateUserMutationOptions,
} from "@/utils/query/user";

import { cn } from "@/utils";

interface UserEditDialogProps {
  mode: "new" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
  intendedUserId: string;
}

export function UserEditDialog({
  open,
  setOpen,
  ...props
}: UserEditDialogProps) {
  const { t } = useTranslation();

  const formId = React.useId();

  const authParams = {
    clientId: props.clientId,
    userId: props.userId,
  };

  // track user creation mutations
  const creatingUserMutationCount = useIsMutating({
    mutationKey: createUserMutationOptions().mutationKey,
  });
  const isCreateMutationActive = creatingUserMutationCount > 0;

  // track user updating mutations
  const updatingUserMutationCount = useIsMutating({
    mutationKey: updateUserMutationOptions({ userId: props.intendedUserId })
      .mutationKey,
  });
  const isUpdateMutationActive = updatingUserMutationCount > 0;

  const currentUsersCountQuery = useQuery(
    fetchActiveUsersCountOptions({
      auth: authParams,
    })
  );

  const maximumUsersCountQuery = useQuery(
    fetchMaximumUsersCountOptions({
      auth: authParams,
    })
  );

  const userQuery = useQuery(
    fetchUserByIdOptions({
      userId: props.intendedUserId,
      auth: authParams,
      enabled: props.mode === "edit" && props.intendedUserId !== "" && open,
    })
  );

  const rolesQuery = useQuery(fetchRolesListOptions({ auth: authParams }));

  const languagesQuery = useQuery(
    fetchLanguagesForUsersOptions({ auth: authParams })
  );

  const locationsQuery = useQuery(
    fetchLocationsListOptions({
      auth: authParams,
      filters: { withActive: true },
      enabled: props.mode === "new",
    })
  );

  const currentUsersCount =
    currentUsersCountQuery.data?.status === 200
      ? currentUsersCountQuery.data.body
      : 0;
  const maxUsersCount =
    maximumUsersCountQuery.data?.status === 200
      ? maximumUsersCountQuery.data.body
      : 0;
  const isMaxUsersReached = currentUsersCount >= maxUsersCount;

  const user = userQuery.data?.status === 200 ? userQuery.data.body : null;
  const languages =
    languagesQuery.data?.status === 200 ? languagesQuery.data.body : [];
  const roles = rolesQuery.data?.status === 200 ? rolesQuery.data.body : [];
  const locations =
    locationsQuery.data?.status === 200 ? locationsQuery.data.body : [];

  const newUserLocations = locations.map((l) => ({
    locationId: l.locationId,
    locationName: l.locationName ?? "",
    isSelected: true,
  }));

  const editModeDisabled = isUpdateMutationActive;
  const createModeDisabled = isCreateMutationActive || isMaxUsersReached;

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {props.mode === "edit"
              ? t("titles.editUserProfile", {
                  ns: "settings",
                })
              : t("titles.newUserProfile", {
                  ns: "settings",
                })}
          </DialogTitle>
          <DialogDescription>
            {props.mode === "edit"
              ? t("descriptions.modifyProfileDetails", {
                  ns: "settings",
                })
              : t("descriptions.newProfileDetails", {
                  ns: "settings",
                })}
            <br />
            <span
              className={cn(
                currentUsersCount >= maxUsersCount ? "text-destructive" : ""
              )}
            >
              {t("descriptions.remainingUsers", {
                ns: "settings",
                activeUsers: currentUsersCount.toLocaleString(),
                maxUsers: maxUsersCount.toLocaleString(),
              })}
            </span>
          </DialogDescription>
        </DialogHeader>
        {props.mode === "edit" && user && (
          <EditUserForm
            formId={formId}
            userId={props.userId}
            clientId={props.clientId}
            user={user}
            languages={languages}
            roles={roles}
            setOpen={setOpen}
          />
        )}
        {props.mode === "new" && (
          <CreateUserForm
            formId={formId}
            userId={props.userId}
            clientId={props.clientId}
            languages={languages}
            locations={newUserLocations}
            roles={roles}
            setOpen={setOpen}
          />
        )}
        <DialogFooter className="gap-2">
          <Button
            variant="ghost"
            type="button"
            onClick={() => setOpen(false)}
            disabled={
              props.mode === "edit" ? editModeDisabled : createModeDisabled
            }
            aria-disabled={
              props.mode === "edit" ? editModeDisabled : createModeDisabled
            }
          >
            {t("buttons.cancel", { ns: "labels" })}
          </Button>
          <Button
            type="submit"
            form={formId}
            aria-disabled={
              props.mode === "edit" ? editModeDisabled : createModeDisabled
            }
          >
            {isUpdateMutationActive && (
              <icons.Loading className="mr-2 h-4 w-4 animate-spin" />
            )}
            {props.mode === "edit"
              ? t("buttons.saveChanges", { ns: "labels" })
              : t("buttons.save", { ns: "labels" })}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

function EditUserForm(props: {
  user: TUserProfile;
  formId: string;
  userId: string;
  clientId: string;
  languages: UserLanguageItem[];
  roles: RoleListItem[];
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const authParams = {
    clientId: props.clientId,
    userId: props.userId,
  };

  const languagesList = props.languages
    .filter((item) => item.key)
    .sort((a, b) => a.key.localeCompare(b.key));

  const rolesList = props.roles.sort((a, b) =>
    a.roleName.localeCompare(b.roleName)
  );

  const updateUserSchema = React.useMemo(
    () =>
      buildUpdateUserSchema({
        REQUIRED: t("display.required", { ns: "labels" }),
      }),
    [t]
  );

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      clientId: props.user.clientId,
      userName: props.user.userName,
      firstName: props.user.firstName ?? "",
      lastName: props.user.lastName ?? "",
      phone: props.user.phone ?? "",
      email: props.user.email ?? "",
      scanAccessKey: props.user.scanAccessKey ?? "",
      userRoleID: props.user.userRoleID ?? 1,
      language: props.user.language ?? "en-US",
      locationList: props.user.locationList ?? [],
      isActive: props.user.isActive ?? false,
      lockOut: props.user.lockOut ?? false,
      isReservationEmail: props.user.isReservationEmail ?? false,
      createdBy: Number(props.userId),
      createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(new Date()),
    },
  });

  const updateProfile = useMutation({
    ...updateUserMutationOptions({ userId: props.user.userID }),
    onSuccess: (data, variables) => {
      qc.invalidateQueries({
        queryKey: fetchUserConfigurationOptions({ auth: authParams }).queryKey,
      });
      qc.invalidateQueries({
        queryKey: fetchUserByIdOptions({
          userId: variables.params.userId,
          auth: authParams,
        }).queryKey,
      });
      qc.invalidateQueries({
        queryKey: fetchActiveUsersCountOptions({ auth: authParams }).queryKey,
      });
      qc.invalidateQueries({
        queryKey: fetchMaximumUsersCountOptions({ auth: authParams }).queryKey,
      });

      if (data.status >= 200 && data.status < 300) {
        toast.success(
          t("labelUpdated", {
            ns: "messages",
            label: t("titles.profile", { ns: "settings" }),
          })
        );

        props.setOpen(false);
        return;
      }

      if (data.status === 400 || data.status == 500) {
        const body = data.body;
        const title = (body.title ?? "").toLowerCase();

        if (title.includes("email") && title.includes("is already")) {
          form.setError("email", {
            message: t("labelAlreadyTaken", {
              ns: "messages",
              label: t("display.email", { ns: "labels" }),
            }),
          });
        }

        if (title.includes("username") && title.includes("is already")) {
          form.setError("userName", {
            message: t("labelAlreadyTaken", {
              ns: "messages",
              label: t("display.username", { ns: "labels" }),
            }),
          });
        }

        toast.error(
          t("inputValidationFailed", {
            ns: "messages",
          }),
          {
            description: t("somethingFailedValidation", {
              ns: "messages",
            }),
          }
        );
        return;
      }

      // should not happen
      console.error("updateProfile mutation failed\n", data);
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

  const isReadonly = updateProfile.isPending;

  return (
    <Form {...form}>
      <form
        id={props.formId}
        className="flex grow-0 flex-col gap-4 px-1 py-4"
        onSubmit={form.handleSubmit(async (data) => {
          if (updateProfile.isPending) return;

          updateProfile.mutate({
            params: {
              userId: String(props.user.userID),
            },
            body: {
              ...data,
              createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
                new Date()
              ),
            },
          });
        })}
      >
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("display.username", { ns: "labels" })}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("display.username", { ns: "labels" })}
                  readOnly
                  autoComplete="username"
                />
              </FormControl>
              <FormDescription>
                {t("usernameCannotBeChanged", { ns: "messages" })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Separator />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("display.email", { ns: "labels" })}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("display.email", { ns: "labels" })}
                  readOnly={isReadonly}
                  autoComplete="email"
                />
              </FormControl>
              <FormDescription>
                {t("emailAssociatedWithAccount", { ns: "messages" })}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {t("display.firstName", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.firstName", { ns: "labels" })}
                    disabled={isReadonly}
                    autoComplete="given-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("display.lastName", { ns: "labels" })}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.lastName", { ns: "labels" })}
                    disabled={isReadonly}
                    autoComplete="family-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("display.language", { ns: "labels" })}</FormLabel>
                <InputSelect
                  placeholder={t("selectYourLocalization", {
                    ns: "messages",
                  })}
                  disabled={isReadonly}
                  defaultValue={String(field.value)}
                  onValueChange={field.onChange}
                  items={languagesList.map((lang, idx) => ({
                    id: `role_${idx}_${lang.key}`,
                    value: String(lang.key),
                    label: `${lang.value}`,
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
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {t("display.phoneNo", { ns: "labels" })}&nbsp;
                  <span className="text-xs text-foreground/70">
                    {t("display.bracketOptional", { ns: "labels" })}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.phoneNo", { ns: "labels" })}
                    readOnly={isReadonly}
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="userRoleID"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("display.role", { ns: "labels" })}</FormLabel>
                <InputSelect
                  placeholder={t("labels.selectARole", {
                    ns: "settings",
                  })}
                  disabled={isReadonly}
                  defaultValue={String(field.value)}
                  onValueChange={field.onChange}
                  items={rolesList.map((role, idx) => ({
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
        </div>
        <FormField
          control={form.control}
          name="locationList"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("display.locations", { ns: "labels" })}</FormLabel>
              <FormDescription>
                {t("accessibleLocations", { ns: "messages" })}
              </FormDescription>
              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                {field.value.map((location) => (
                  <InputCheckbox
                    key={`location_access_${location.locationId}`}
                    label={location.locationName}
                    checked={location.isSelected}
                    onCheckedChange={(checked) => {
                      const locations = field.value;
                      const idx = locations.findIndex(
                        (item) => item.locationId === location.locationId
                      );
                      locations[idx]!.isSelected = checked;
                      field.onChange(locations);
                    }}
                    disabled={isReadonly}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isReservationEmail"
          render={({ field }) => (
            <FormItem className="mt-2 flex flex-row items-center justify-between gap-1 rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  {t("labels.userToReceiveEmailsQuestion", { ns: "settings" })}
                </FormLabel>
                <FormDescription>
                  {t("receiveReservationEmails", { ns: "messages" })}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadonly}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  {t("titles.accountActive", { ns: "settings" })}
                </FormLabel>
                <FormDescription>
                  {t("descriptions.accountActive", { ns: "settings" })}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={
                    isReadonly || String(props.user.userID) === props.userId
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lockOut"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  {t("titles.accountLock", { ns: "settings" })}
                </FormLabel>
                <FormDescription>
                  {t("descriptions.accountLock", { ns: "settings" })}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={
                    isReadonly ||
                    (!props.user.lockOut &&
                      String(props.user.userID) === props.userId)
                  }
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

const MAX_PASSWORD_LENGTH = 35;

function CreateUserForm(props: {
  formId: string;
  userId: string;
  clientId: string;
  languages: UserLanguageItem[];
  roles: RoleListItem[];
  locations: TUserProfile["locationList"];
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const qc = useQueryClient();
  const authParams = {
    clientId: props.clientId,
    userId: props.userId,
  };

  const [showPassword, setShowPassword] = React.useState(false);

  const languagesList = props.languages
    .filter((item) => item.key)
    .sort((a, b) => a.key.localeCompare(b.key));

  const rolesList = props.roles.sort((a, b) =>
    a.roleName.localeCompare(b.roleName)
  );

  const createUserSchema = React.useMemo(
    () =>
      buildUpdateUserSchema({
        REQUIRED: t("display.required", { ns: "labels" }),
      }).extend({
        password: z
          .string()
          .regex(
            /^(?=.*[A-Za-z])(?=.*\d)(?=.*[@$!%*#?&])[A-Za-z\d@$!%*#?&]{8,}$/,
            {
              message: t("passwordRules", { ns: "messages" }),
            }
          )
          .max(MAX_PASSWORD_LENGTH, {
            message: t("maxLength", {
              ns: "messages",
              length: MAX_PASSWORD_LENGTH,
            }),
          }),
      }),
    [t]
  );

  const form = useForm<z.infer<typeof createUserSchema>>({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      clientId: props.clientId,
      createdBy: props.userId,
      createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(new Date()),
      //
      password: "",
      userName: "",
      firstName: "",
      lastName: "",
      phone: "",
      email: "",
      scanAccessKey: "",
      userRoleID: 1,
      language: "en-US",
      locationList: props.locations,
      isActive: true,
      lockOut: false,
      isReservationEmail: false,
    },
  });

  const createUser = useMutation({
    ...createUserMutationOptions(),
    onSuccess: (data) => {
      qc.invalidateQueries({
        queryKey: fetchUserConfigurationOptions({ auth: authParams }).queryKey,
      });
      qc.invalidateQueries({
        queryKey: fetchActiveUsersCountOptions({ auth: authParams }).queryKey,
      });
      qc.invalidateQueries({
        queryKey: fetchMaximumUsersCountOptions({ auth: authParams }).queryKey,
      });

      if (data.status >= 200 && data.status < 300) {
        toast.success(
          t("labelCreated", {
            ns: "messages",
            label: t("titles.profile", { ns: "settings" }),
          })
        );

        props.setOpen(false);
        return;
      }

      if (data.status === 400 || data.status == 500) {
        const body = data.body;
        const title = (body.title ?? "").toLowerCase();

        if (title.includes("email") && title.includes("is already taken")) {
          form.setError("email", {
            message: t("labelAlreadyTaken", {
              ns: "messages",
              label: t("display.email", { ns: "labels" }),
            }),
          });
        }

        if (title.includes("username") && title.includes("is already taken")) {
          form.setError("userName", {
            message: t("labelAlreadyTaken", {
              ns: "messages",
              label: t("display.username", { ns: "labels" }),
            }),
          });
        }

        toast.error(
          t("inputValidationFailed", {
            ns: "messages",
          }),
          {
            description: t("somethingFailedValidation", {
              ns: "messages",
            }),
          }
        );
        return;
      }

      // should not happen
      console.error("createUser mutation failed\n", data);
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

  const isReadonly = createUser.isPending;

  return (
    <Form {...form}>
      <form
        id={props.formId}
        className="flex grow-0 flex-col gap-4 px-1 py-4"
        onSubmit={form.handleSubmit(async (data) => {
          if (createUser.isPending) return;

          createUser.mutate({
            body: {
              ...data,
              createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(
                new Date()
              ),
            },
          });
        })}
      >
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("display.email", { ns: "labels" })}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("display.email", { ns: "labels" })}
                  readOnly={isReadonly}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("emailAssociatedWithAccount", { ns: "messages" })}
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("display.username", { ns: "labels" })}</FormLabel>
              <FormControl>
                <Input
                  {...field}
                  placeholder={t("display.username", { ns: "labels" })}
                  readOnly={isReadonly}
                  autoComplete="username"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("usernameCannotBeChangedLater", { ns: "messages" })}
              </FormDescription>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t("display.password", { ns: "labels" })}</FormLabel>
              <div className="flex justify-between gap-x-1.5">
                <FormControl>
                  <Input
                    {...field}
                    type={showPassword ? "text" : "password"}
                    placeholder={t("display.password", { ns: "labels" })}
                    readOnly={isReadonly}
                    autoComplete="new-password"
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <icons.EyeOn className="h-3 w-3" />
                  ) : (
                    <icons.EyeOff className="h-3 w-3" />
                  )}
                  <span className="sr-only">
                    {showPassword
                      ? t("pressToShowPassword", { ns: "messages" })
                      : t("pressToHidePassword", { ns: "messages" })}
                  </span>
                </Button>
              </div>
              <FormMessage />
              <FormDescription>
                {t("enterAStrongPassword", { ns: "messages" })}
              </FormDescription>
            </FormItem>
          )}
        />
        <Separator />
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {t("display.firstName", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.firstName", { ns: "labels" })}
                    readOnly={isReadonly}
                    autoComplete="given-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("display.lastName", { ns: "labels" })}</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.lastName", { ns: "labels" })}
                    readOnly={isReadonly}
                    autoComplete="family-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="language"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("display.language", { ns: "labels" })}</FormLabel>
                <InputSelect
                  placeholder={t("selectYourLocalization", {
                    ns: "messages",
                  })}
                  disabled={isReadonly}
                  defaultValue={String(field.value)}
                  onValueChange={field.onChange}
                  items={languagesList.map((lang, idx) => ({
                    id: `role_${idx}_${lang.key}`,
                    value: String(lang.key),
                    label: `${lang.value}`,
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
            name="phone"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>
                  {t("display.phoneNo", { ns: "labels" })}&nbsp;
                  <span className="text-xs text-foreground/70">
                    {t("display.bracketOptional", { ns: "labels" })}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder={t("display.phoneNo", { ns: "labels" })}
                    readOnly={isReadonly}
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
          <FormField
            control={form.control}
            name="userRoleID"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormLabel>{t("display.role", { ns: "labels" })}</FormLabel>
                <InputSelect
                  placeholder={t("labels.selectARole", {
                    ns: "settings",
                  })}
                  disabled={isReadonly}
                  defaultValue={String(field.value)}
                  onValueChange={field.onChange}
                  items={rolesList.map((role, idx) => ({
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
        </div>
        <FormField
          control={form.control}
          name="locationList"
          render={({ field }) => (
            <FormItem className="w-full">
              <FormLabel>{t("display.locations", { ns: "labels" })}</FormLabel>
              <FormDescription>
                {t("accessibleLocations", { ns: "messages" })}
              </FormDescription>
              <div className="grid grid-cols-1 gap-4 pt-2 md:grid-cols-2">
                {field.value.map((location) => (
                  <InputCheckbox
                    key={`location_access_${location.locationId}`}
                    label={location.locationName}
                    checked={location.isSelected}
                    onCheckedChange={(checked) => {
                      const locations = field.value;
                      const idx = locations.findIndex(
                        (item) => item.locationId === location.locationId
                      );
                      locations[idx]!.isSelected = checked;
                      field.onChange(locations);
                    }}
                    disabled={isReadonly}
                  />
                ))}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isReservationEmail"
          render={({ field }) => (
            <FormItem className="mt-2 flex flex-row items-center justify-between gap-1 rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  {t("labels.userToReceiveEmailsQuestion", { ns: "settings" })}
                </FormLabel>
                <FormDescription>
                  {t("receiveReservationEmails", { ns: "messages" })}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isReadonly}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

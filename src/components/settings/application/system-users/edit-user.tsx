import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useIsMutating,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { EyeIcon, EyeOffIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
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
import { Input } from "@/components/ui/input";
import { InputCheckbox } from "@/components/ui/input-checkbox";
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

import { useGetLocationsList } from "@/hooks/network/location/useGetLocationsList";
import { useGetUserLanguages } from "@/hooks/network/user/useGetUserLanguages";

import { type RoleListItem } from "@/schemas/role";
import {
  buildUpdateUserSchema,
  UserLanguageItem,
  type TUserProfile,
  type UpdateUserInput,
} from "@/schemas/user";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { roleQKeys, userQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";
import { cn } from "@/utils";

interface EditUserDialogProps {
  mode: "new" | "edit";
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
  intendedUserId: string;
}

export function EditUserDialog({
  open,
  setOpen,
  ...props
}: EditUserDialogProps) {
  const { t } = useTranslation();

  const formId = React.useId();

  const isUpdatingNumber = useIsMutating({
    mutationKey: userQKeys.updatingProfile(props.intendedUserId),
  });
  const isUpdating = isUpdatingNumber > 0;

  const disabled = isUpdating;

  const currentUsersQuery = useQuery({
    queryKey: userQKeys.activeUsersCount(),
    queryFn: () =>
      apiClient.user.getActiveUsersCount({
        query: {
          clientId: props.clientId,
          userId: props.userId,
        },
      }),
  });

  const maxUsersQuery = useQuery({
    queryKey: userQKeys.maximumUsersCount(),
    queryFn: () =>
      apiClient.user.getMaximumUsersCount({
        query: {
          clientId: props.clientId,
          userId: props.userId,
        },
      }),
  });

  const userQuery = useQuery({
    queryKey: userQKeys.profile(props.intendedUserId),
    queryFn: () =>
      apiClient.user.getProfileByUserId({
        query: {
          clientId: props.clientId,
          userId: props.userId,
          currentUserId: props.userId,
        },
        params: { userId: props.intendedUserId },
      }),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: props.mode === "edit" && props.intendedUserId !== "",
  });

  const rolesQuery = useQuery({
    queryKey: roleQKeys.all(),
    queryFn: () =>
      apiClient.role.getList({
        query: { clientId: props.clientId, userId: props.userId },
      }),
    staleTime: 1000 * 60 * 1, // 1 minute
  });

  const languagesQuery = useGetUserLanguages();

  const locationsQuery = useGetLocationsList({
    query: { withActive: true },
    enabled: props.mode === "new",
  });

  const currentUsers =
    currentUsersQuery.data?.status === 200 ? currentUsersQuery.data.body : 0;
  const maxUsers =
    maxUsersQuery.data?.status === 200 ? maxUsersQuery.data.body : 0;
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
              className={cn(currentUsers >= maxUsers ? "text-destructive" : "")}
            >
              {t("descriptions.remainingUsers", {
                ns: "settings",
                activeUsers: currentUsers.toLocaleString(),
                maxUsers: maxUsers.toLocaleString(),
              })}
            </span>
          </DialogDescription>
        </DialogHeader>
        {props.mode === "edit" && user && (
          <EditUserForm
            formId={formId}
            userId={props.userId}
            user={user}
            languages={languages}
            roles={roles}
            setOpen={setOpen}
          />
        )}
        {props.mode === "new" && (
          <NewUserForm
            formId={formId}
            userId={props.userId}
            clientId={props.clientId}
            languages={languages}
            locations={newUserLocations}
            roles={roles}
            setOpen={setOpen}
          />
        )}
        <DialogFooter>
          <Button
            variant="outline"
            type="button"
            onClick={() => setOpen(false)}
            disabled={disabled}
          >
            {t("buttons.cancel", { ns: "labels" })}
          </Button>
          <Button type="submit" form={formId} disabled={disabled}>
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
  languages: UserLanguageItem[];
  roles: RoleListItem[];
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const qc = useQueryClient();

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
    mutationKey: userQKeys.updatingProfile(String(props.user.userID)),
    mutationFn: apiClient.user.updateProfileByUserId,
    onSuccess: (data, variables) => {
      qc.invalidateQueries(userQKeys.userConfigurations());
      qc.invalidateQueries(userQKeys.profile(variables.params.userId));
      qc.invalidateQueries(userQKeys.activeUsersCount());
      qc.invalidateQueries(userQKeys.maximumUsersCount());

      if (data.status >= 200 && data.status < 300) {
        toast({
          title: t("labelUpdated", {
            ns: "messages",
            label: t("titles.profile", { ns: "settings" }),
          }),
          description: t("labelUpdatedSuccess", {
            ns: "messages",
            label: t("titles.profile", { ns: "settings" }),
          }),
        });

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

        toast({
          title: t("inputValidationFailed", {
            ns: "messages",
          }),
          description: t("somethingFailedValidation", {
            ns: "messages",
          }),
          variant: "destructive",
        });
        return;
      }

      // should not happen
      console.error("updateProfile mutation failed\n", data);
      toast({
        title: t("somethingWentWrong", {
          ns: "messages",
        }),
        description: t("pleaseTryAgain", {
          ns: "messages",
        }),
        variant: "destructive",
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          title: t("somethingWentWrong", {
            ns: "messages",
          }),
          description:
            err?.message ||
            t("pleaseTryAgain", {
              ns: "messages",
            }),
          variant: "destructive",
        });
      }
    },
  });

  const isDisabled = updateProfile.isLoading;

  return (
    <Form {...form}>
      <form
        id={props.formId}
        className="flex grow-0 flex-col gap-4 px-1 py-4"
        onSubmit={form.handleSubmit(async (data) => {
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
                  disabled
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
                  disabled={isDisabled}
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
                    disabled={isDisabled}
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
                    disabled={isDisabled}
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
                  disabled={isDisabled}
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
                    disabled={isDisabled}
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
                  placeholder={t("selectARole", {
                    ns: "messages",
                  })}
                  disabled={isDisabled}
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
                    disabled={isDisabled}
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
            <FormItem className="mt-2 flex flex-row items-center justify-between gap-1 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  {t("display.userToReceiveEmailsQuestion", { ns: "labels" })}
                </FormLabel>
                <FormDescription>
                  {t("receiveReservationEmails", { ns: "messages" })}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isDisabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border p-4">
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
                  disabled={isDisabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lockOut"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border p-4">
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
                  disabled={isDisabled}
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

function NewUserForm(props: {
  formId: string;
  userId: string;
  clientId: string;
  languages: UserLanguageItem[];
  roles: RoleListItem[];
  locations: TUserProfile["locationList"];
  setOpen: (open: boolean) => void;
}) {
  const { t } = useTranslation();
  const { toast } = useToast();
  const qc = useQueryClient();

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
    mutationKey: userQKeys.updatingProfile(String(props.userId)),
    mutationFn: apiClient.user.createdUserProfile,
    onSuccess: (data) => {
      qc.invalidateQueries(userQKeys.userConfigurations());
      qc.invalidateQueries(userQKeys.activeUsersCount());
      qc.invalidateQueries(userQKeys.maximumUsersCount());

      if (data.status >= 200 && data.status < 300) {
        toast({
          title: t("labelCreated", {
            ns: "messages",
            label: t("titles.profile", { ns: "settings" }),
          }),
          description: t("labelCreated", {
            ns: "messages",
            label: t("titles.profile", { ns: "settings" }),
          }),
        });

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

        toast({
          title: t("inputValidationFailed", {
            ns: "messages",
          }),
          description: t("somethingFailedValidation", {
            ns: "messages",
          }),
          variant: "destructive",
        });
        return;
      }

      // should not happen
      console.error("createUser mutation failed\n", data);
      toast({
        title: t("somethingWentWrong", {
          ns: "messages",
        }),
        description: t("pleaseTryAgain", {
          ns: "messages",
        }),
        variant: "destructive",
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          title: t("somethingWentWrong", {
            ns: "messages",
          }),
          description:
            err?.message ||
            t("pleaseTryAgain", {
              ns: "messages",
            }),
          variant: "destructive",
        });
      }
    },
  });

  const isDisabled = createUser.isLoading;

  return (
    <Form {...form}>
      <form
        id={props.formId}
        className="flex grow-0 flex-col gap-4 px-1 py-4"
        onSubmit={form.handleSubmit(async (data) => {
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
                  disabled={isDisabled}
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
                    disabled={isDisabled}
                  />
                </FormControl>
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <EyeIcon className="h-3 w-3" />
                  ) : (
                    <EyeOffIcon className="h-3 w-3" />
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
                    disabled={isDisabled}
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
                    disabled={isDisabled}
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
                  disabled={isDisabled}
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
                    disabled={isDisabled}
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
                  placeholder={t("selectARole", {
                    ns: "messages",
                  })}
                  disabled={isDisabled}
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
                    disabled={isDisabled}
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
            <FormItem className="mt-2 flex flex-row items-center justify-between gap-1 rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  {t("display.userToReceiveEmailsQuestion", { ns: "labels" })}
                </FormLabel>
                <FormDescription>
                  {t("receiveReservationEmails", { ns: "messages" })}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isDisabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
      </form>
    </Form>
  );
}

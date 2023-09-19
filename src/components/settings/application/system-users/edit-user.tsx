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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

import { useGetUserLanguages } from "@/hooks/network/user/useGetUserLanguages";

import { type RoleListItem } from "@/schemas/role";
import {
  UpdateUserSchema,
  UserLanguageItem,
  type TUserConfigurations,
  type TUserProfile,
  type UpdateUserInput,
} from "@/schemas/user";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { roleQKeys, userQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";
import { cn } from "@/utils";

interface EditUserDialogProps {
  mode: "new" | "edit";
  user: TUserConfigurations[number];
  open: boolean;
  setOpen: (open: boolean) => void;
  clientId: string;
  userId: string;
}

export function EditUserDialog({
  open,
  setOpen,
  ...props
}: EditUserDialogProps) {
  const { t } = useTranslation();

  const formId = React.useId();

  const isUpdatingNumber = useIsMutating({
    mutationKey: userQKeys.updatingProfile(String(props.user?.userID)),
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
    queryKey: userQKeys.profile(String(props.user.userID)),
    queryFn: () =>
      apiClient.user.getProfileByUserId({
        query: {
          clientId: props.clientId,
          userId: props.userId,
          currentUserId: props.userId,
        },
        params: { userId: String(props.user.userID) },
      }),
    staleTime: 1000 * 60 * 1, // 1 minute
    enabled: props.mode === "edit",
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

  const currentUsers =
    currentUsersQuery.data?.status === 200 ? currentUsersQuery.data.body : 0;
  const maxUsers =
    maxUsersQuery.data?.status === 200 ? maxUsersQuery.data.body : 0;
  const user = userQuery.data?.status === 200 ? userQuery.data.body : null;
  const languages =
    languagesQuery.data?.status === 200 ? languagesQuery.data.body : [];
  const roles = rolesQuery.data?.status === 200 ? rolesQuery.data.body : [];

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="md:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {t("titles.editUserProfile", {
              ns: "settings",
            })}
          </DialogTitle>
          <DialogDescription>
            {t("descriptions.modifyProfileDetails", {
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
            {t("buttons.saveChanges", { ns: "labels" })}
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

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
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
      } else {
        toast({
          title: t("somethingWentWrong", {
            ns: "messages",
          }),
          description: t("pleaseTryAgain", {
            ns: "messages",
          }),
          variant: "destructive",
        });
      }
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isDisabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectYourLocalization", {
                          ns: "messages",
                        })}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {languagesList.map((item, idx) => (
                      <SelectItem key={`lang_${item}_${idx}`} value={item.key}>
                        {item.value}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                <Select
                  onValueChange={field.onChange}
                  defaultValue={String(field.value)}
                  disabled={isDisabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={t("selectYourLocalization", {
                          ns: "messages",
                        })}
                      />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {rolesList.map((item, idx) => (
                      <SelectItem
                        key={`role_${item}_${idx}`}
                        value={String(item.userRoleID)}
                      >
                        {item.roleName}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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

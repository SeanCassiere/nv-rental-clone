import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createLazyFileRoute, getRouteApi } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
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
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";
import { usePermission } from "@/lib/hooks/usePermission";

import {
  buildUpdateUserSchema,
  type TUserProfile,
  type UpdateUserInput,
  type UserLanguageItem,
} from "@/lib/schemas/user";
import { fetchLocationsListOptions } from "@/lib/query/location";
import {
  fetchActiveUsersCountOptions,
  fetchMaximumUsersCountOptions,
  fetchPermissionsByUserIdOptions,
  fetchUserByIdOptions,
} from "@/lib/query/user";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/lib/utils/date";
import { titleMaker } from "@/lib/utils/title-maker";

import { apiClient } from "@/lib/api";

import { SettingsLayoutHeader } from "./-components/layout-header";

export const Route = createLazyFileRoute("/_auth/(settings)/settings/profile")({
  component: SettingsProfilePage,
});

const routeApi = getRouteApi("/_auth/settings/profile");

function SettingsProfilePage() {
  const context = routeApi.useRouteContext();
  const { authParams } = context;
  const { t } = useTranslation();

  const userQuery = useSuspenseQuery(context.currentUserProfileOptions);

  const languagesQuery = useSuspenseQuery(context.availableLanguagesOptions);

  useDocumentTitle(
    titleMaker(
      t("titles.page", {
        ns: "settings",
        pageTitle: t("titles.profile", { ns: "settings" }),
      })
    )
  );

  return (
    <>
      <SettingsLayoutHeader
        title={t("titles.profile", { ns: "settings" })}
        subtitle={t("descriptions.profile", { ns: "settings" })}
      />
      {userQuery.status === "success" &&
        languagesQuery.status === "success" &&
        userQuery.data.status === 200 && (
          <article className="mt-6 w-full max-w-2xl rounded-md border bg-card p-6">
            <ProfileForm
              user={userQuery.data.body}
              languages={
                languagesQuery.data.status === 200
                  ? languagesQuery.data.body
                  : []
              }
              clientId={authParams.clientId}
              userId={authParams.userId}
            />
          </article>
        )}
    </>
  );
}

function ProfileForm(props: {
  user: TUserProfile;
  languages: UserLanguageItem[];
  clientId: string;
  userId: string;
}) {
  const { user, languages } = props;
  const authParams = {
    clientId: props.clientId,
    userId: props.userId,
  };

  const { t } = useTranslation();
  const queryClient = useQueryClient();

  const canViewAdminTab = usePermission("VIEW_ADMIN_TAB");

  const languagesList = languages
    .filter((item) => item.key)
    .sort((a, b) => a.key.localeCompare(b.key));

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(
      buildUpdateUserSchema({
        REQUIRED: t("display.required", { ns: "labels" }),
      })
    ),
    defaultValues: {
      clientId: user.clientId,
      userName: user.userName,
      firstName: user.firstName ?? "",
      lastName: user.lastName ?? "",
      phone: user.phone ?? "",
      email: user.email ?? "",
      scanAccessKey: user.scanAccessKey ?? "",
      userRoleID: user.userRoleID ?? 1,
      language: user.language ?? "en-US",
      locationList: user.locationList ?? [],
      isActive: user.isActive ?? false,
      lockOut: user.lockOut ?? false,
      isReservationEmail: user.isReservationEmail ?? false,
      createdBy: Number(authParams.userId),
      createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(new Date()),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.user.updateProfileByUserId,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: fetchUserByIdOptions({
          auth: authParams,
          userId: variables.params.userId,
        }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: fetchActiveUsersCountOptions({ auth: authParams }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: fetchMaximumUsersCountOptions({ auth: authParams }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: fetchPermissionsByUserIdOptions({
          auth: authParams,
          userId: variables.params.userId,
        }).queryKey,
      });
      queryClient.invalidateQueries({
        queryKey: fetchLocationsListOptions({
          auth: authParams,
          filters: { withActive: true },
        }).queryKey,
      });

      if (data.status >= 200 && data.status < 300) {
        toast.success(
          t("labelUpdated", {
            ns: "messages",
            label: t("titles.profile", { ns: "settings" }),
          })
        );

        return;
      }

      toast.error(t("somethingWentWrong", { ns: "messages" }), {
        description: t("pleaseTryAgain", { ns: "messages" }),
      });
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast.error(t("somethingWentWrong", { ns: "messages" }), {
          description: err?.message || t("pleaseTryAgain", { ns: "messages" }),
        });
      }
    },
  });

  const isSubmitBtnFrozen = isPending;
  const isFieldsReadonly = canViewAdminTab === false || isSubmitBtnFrozen;

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(async (values) => {
          if (isSubmitBtnFrozen) return;

          mutate({
            params: {
              userId: authParams.userId,
            },
            body: {
              ...values,
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
                  autoComplete="username"
                  readOnly
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("usernameCannotBeChanged", {
                  context: "me",
                  ns: "messages",
                })}
              </FormDescription>
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
                  readOnly={isFieldsReadonly}
                  autoComplete="email"
                />
              </FormControl>
              <FormMessage />
              <FormDescription>
                {t("emailAssociatedWithAccount", {
                  context: "me",
                  ns: "messages",
                })}
              </FormDescription>
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
                    readOnly={isFieldsReadonly}
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
                    readOnly={isFieldsReadonly}
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
                  disabled={isFieldsReadonly}
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
                    readOnly={isFieldsReadonly}
                    autoComplete="tel"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="isReservationEmail"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border bg-background p-4">
              <div className="space-y-0.5">
                <FormLabel>
                  {t("labels.youReceiveEmailsQuestion", { ns: "settings" })}
                </FormLabel>
                <FormDescription>
                  {t("receiveReservationEmails", { ns: "messages" })}
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                  disabled={isFieldsReadonly}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Separator className="mt-0.5" />
        <Button
          type="submit"
          className="w-full lg:w-max"
          disabled={!canViewAdminTab}
          aria-disabled={!canViewAdminTab || isSubmitBtnFrozen}
        >
          {isPending && <icons.Loading className="mr-2 h-4 w-4 animate-spin" />}
          {t("buttons.saveProfileDetails", { ns: "labels" })}
        </Button>
      </form>
    </Form>
  );
}

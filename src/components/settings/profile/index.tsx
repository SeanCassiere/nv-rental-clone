import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { useAuth } from "react-oidc-context";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

import { useAuthValues } from "@/hooks/internal/useAuthValues";
import { usePermission } from "@/hooks/internal/usePermission";

import {
  buildUpdateUserSchema,
  type TUserProfile,
  type UpdateUserInput,
  type UserLanguageItem,
} from "@/schemas/user";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { locationQKeys, userQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export default function SettingsProfileTab() {
  const { t } = useTranslation("settings");
  const auth = useAuth();

  const clientId = auth.user?.profile?.navotar_clientid || "";
  const userId = auth.user?.profile?.navotar_userid || "";
  const authParams = {
    clientId,
    userId,
  };

  const userQuery = useSuspenseQuery(userQKeys.me(authParams));

  const languagesQuery = useSuspenseQuery(userQKeys.languages(authParams));

  return (
    <Card className="shadow-none lg:w-[600px]">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-xl">{t("titles.profile")}</CardTitle>
        <CardDescription className="text-base text-foreground/80">
          {t("descriptions.profile")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 lg:p-6">
        {userQuery.status === "success" &&
          languagesQuery.status === "success" &&
          userQuery.data.status === 200 && (
            <article className="w-full lg:max-w-2xl">
              <ProfileForm
                user={userQuery.data.body}
                languages={
                  languagesQuery.data.status === 200
                    ? languagesQuery.data.body
                    : []
                }
                clientId={clientId}
                userId={userId}
              />
            </article>
          )}
      </CardContent>
    </Card>
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

  const auth = useAuthValues();
  const qc = useQueryClient();

  const { toast } = useToast();

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
      createdBy: Number(auth.userId),
      createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(new Date()),
    },
  });

  const { mutate, isPending } = useMutation({
    mutationFn: apiClient.user.updateProfileByUserId,
    onSuccess: (data, variables) => {
      qc.invalidateQueries({ queryKey: userQKeys.me(authParams).queryKey });
      qc.invalidateQueries({ queryKey: userQKeys.activeUsersCount() });
      qc.invalidateQueries({ queryKey: userQKeys.maximumUsersCount() });
      qc.invalidateQueries({
        queryKey: userQKeys.permissions(authParams).queryKey,
      });
      qc.invalidateQueries({
        queryKey: locationQKeys.all({ withActive: true }),
      });

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
      } else {
        toast({
          title: t("somethingWentWrong", { ns: "messages" }),
          description: t("pleaseTryAgain", { ns: "messages" }),
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          title: t("somethingWentWrong", { ns: "messages" }),
          description: err?.message || t("pleaseTryAgain", { ns: "messages" }),
          variant: "destructive",
        });
      }
    },
  });

  const isDisabled = canViewAdminTab === false || isPending;

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5 rounded"
        onSubmit={form.handleSubmit(async (values) => {
          mutate({
            params: {
              userId: auth.userId,
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
                  disabled={isDisabled}
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
                    disabled={isDisabled}
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
                    disabled={isDisabled}
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
            <FormItem className="flex flex-row items-center justify-between gap-1 rounded-lg border p-4">
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
                  disabled={isDisabled}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Separator className="mt-0.5" />
        <Button type="submit" className="w-full lg:w-max" disabled={isDisabled}>
          {t("buttons.saveProfileDetails", { ns: "labels" })}
        </Button>
      </form>
    </Form>
  );
}

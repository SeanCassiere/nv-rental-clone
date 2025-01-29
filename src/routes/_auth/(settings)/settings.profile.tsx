import * as React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  useMutation,
  useQueryClient,
  useSuspenseQuery,
} from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";
import { useForm, useWatch, type UseFormReturn } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import { icons } from "@/components/ui/icons";
import { Input } from "@/components/ui/input";
import {
  InputSelect,
  InputSelectContent,
  InputSelectTrigger,
} from "@/components/ui/input-select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import { useCopyToClipboard } from "@/lib/hooks/useCopyToClipboard";
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
  fetchLanguagesForUsersOptions,
  fetchMaximumUsersCountOptions,
  fetchPermissionsByUserIdOptions,
  fetchUserByIdOptions,
} from "@/lib/query/user";

import { UI_APPLICATION_NAME } from "@/lib/utils/constants";
import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/lib/utils/date";
import { titleMaker } from "@/lib/utils/title-maker";

import { apiClient } from "@/lib/api";

import { UserResetPasswordDialog } from "./-components/application/user-reset-password-dialog";

export const Route = createFileRoute("/_auth/(settings)/settings/profile")({
  beforeLoad: ({ context }) => ({
    currentUserProfileOptions: fetchUserByIdOptions({
      auth: context.authParams,
      userId: context.authParams.userId,
    }),
    availableLanguagesOptions: fetchLanguagesForUsersOptions({
      auth: context.authParams,
    }),
  }),
  loader: async ({ context }) => {
    const {
      queryClient,
      currentUserProfileOptions,
      availableLanguagesOptions,
    } = context;

    const promises = [
      queryClient.ensureQueryData(currentUserProfileOptions),
      queryClient.ensureQueryData(availableLanguagesOptions),
    ];

    await Promise.allSettled(promises);
  },
  component: SettingsProfilePage,
});

function SettingsProfilePage() {
  const context = Route.useRouteContext();
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
    <article className="flex flex-col gap-4">
      {userQuery.status === "success" &&
      languagesQuery.status === "success" &&
      userQuery.data.status === 200 ? (
        <ProfileForm
          user={userQuery.data.body}
          languages={
            languagesQuery.data.status === 200 ? languagesQuery.data.body : []
          }
          clientId={authParams.clientId}
          userId={authParams.userId}
        />
      ) : (
        <React.Fragment>
          {[...Array(5)].map((_, idx) => (
            <Card key={`skeleton_${idx}`}>
              <CardHeader>
                <CardTitle>
                  <Skeleton className="h-8 w-4/5" />
                </CardTitle>
                <CardDescription>
                  <Skeleton className="h-12 w-4/5" />
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Skeleton className="h-12 w-4/5" />
              </CardContent>
              <CardFooter className="justify-end border-t pt-6">
                <Button
                  size="sm"
                  variant="outline"
                  className="bg-transparent"
                  disabled
                >
                  {t("buttons.save", { ns: "labels" })}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </React.Fragment>
      )}
    </article>
  );
}

interface ProfileFormProps {
  user: TUserProfile;
  languages: UserLanguageItem[];
  clientId: string;
  userId: string;
}

function ProfileForm(props: ProfileFormProps) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const canViewAdminTab = usePermission("VIEW_ADMIN_TAB");
  const { user, clientId, userId } = props;

  const authParams = {
    clientId,
    userId,
  };

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
      createdBy: Number(userId),
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

  const isLocked = canViewAdminTab === false || isPending;

  const handleFormSubmit = form.handleSubmit(async (values) => {
    if (isLocked) return;

    mutate({
      params: {
        userId: authParams.userId,
      },
      body: {
        ...values,
        createdDate: localDateTimeWithoutSecondsToQueryYearMonthDay(new Date()),
      },
    });
  });

  return (
    <React.Fragment>
      <UsernameBlock
        {...props}
        form={form}
        onFormSubmit={handleFormSubmit}
        isLocked={isLocked}
        isMutating={isPending}
      />
      <EmailBlock
        {...props}
        form={form}
        onFormSubmit={handleFormSubmit}
        isLocked={isLocked}
        isMutating={isPending}
      />
      <DisplayNameBlock
        {...props}
        form={form}
        onFormSubmit={handleFormSubmit}
        isLocked={isLocked}
        isMutating={isPending}
      />
      <LanguageBlock
        {...props}
        form={form}
        onFormSubmit={handleFormSubmit}
        isLocked={isLocked}
        isMutating={isPending}
      />
      <PhoneNumberBlock
        {...props}
        form={form}
        onFormSubmit={handleFormSubmit}
        isLocked={isLocked}
        isMutating={isPending}
      />
      <ResetPasswordBlock
        {...props}
        form={form}
        onFormSubmit={handleFormSubmit}
        isLocked={isLocked}
        isMutating={isPending}
      />
    </React.Fragment>
  );
}

type BlockProps = ProfileFormProps & {
  form: UseFormReturn<UpdateUserInput, any, undefined>;
  onFormSubmit: ReturnType<
    UseFormReturn<UpdateUserInput, any, undefined>["handleSubmit"]
  >;
  isLocked: boolean;
  isMutating: boolean;
};

const COPY_TIMEOUT = 1500;

function UsernameBlock({ form }: BlockProps) {
  const { t } = useTranslation();
  const username = useWatch({ control: form.control, name: "userName" });

  const [hidden, setHidden] = React.useState(false);
  const [_, copy] = useCopyToClipboard();

  const handleCopy = React.useCallback(() => {
    setHidden(true);
    copy(username).catch(() => {
      console.error(`Failed to copy: ${username}`);
    });
  }, [copy, username]);

  React.useEffect(() => {
    const t = hidden ? setTimeout(() => setHidden(false), COPY_TIMEOUT) : null;
    return () => {
      if (t) clearTimeout(t);
    };
  }, [hidden, setHidden]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">
          {t("titles.profileUsername", { ns: "settings" })}
        </CardTitle>
        <CardDescription>
          {t("descriptions.profileUsername", {
            ns: "settings",
            appName: UI_APPLICATION_NAME,
          })}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border-border flex h-10 items-center justify-between rounded-md border pl-3 opacity-90 lg:w-72">
          <span className="text-muted-foreground grow cursor-not-allowed truncate">
            {username}
          </span>
          <Tooltip delayDuration={0}>
            <TooltipTrigger asChild>
              <Button
                type="button"
                onClick={handleCopy}
                variant="ghost"
                size="icon"
                className="h-9"
              >
                {hidden ? (
                  <icons.Check className="h-3 w-3" />
                ) : (
                  <icons.Copy className="h-3 w-3" />
                )}
                <span className="sr-only">
                  {t("buttons.copy", { ns: "labels" })}
                </span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{t("buttons.copy", { ns: "labels" })}</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </CardContent>
    </Card>
  );
}

function EmailBlock({ form, onFormSubmit, isLocked, isMutating }: BlockProps) {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("titles.profileEmail", { ns: "settings" })}
            </CardTitle>
            <CardDescription>
              {t("descriptions.profileEmail", {
                ns: "settings",
                appName: UI_APPLICATION_NAME,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only">
                    {t("display.email", { ns: "labels" })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="bg-transparent lg:w-72"
                      placeholder={t("display.email", { ns: "labels" })}
                      readOnly={isLocked}
                      autoComplete="email"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Separator />
            <FormField
              control={form.control}
              name="isReservationEmail"
              render={({ field }) => (
                <FormItem className="grid gap-2 space-y-0">
                  <FormLabel className="sr-only">
                    {t("labels.youReceiveEmailsQuestion", { ns: "settings" })}
                  </FormLabel>
                  <FormDescription>
                    {t("receiveReservationEmails", { ns: "messages" })}
                  </FormDescription>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                      disabled={isLocked}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end border-t py-2.5">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="bg-transparent"
              disabled={isLocked || isMutating}
            >
              <span>{t("buttons.save", { ns: "labels" })}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function DisplayNameBlock({
  onFormSubmit,
  form,
  isLocked,
  isMutating,
}: BlockProps) {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("titles.profileDisplayName", { ns: "settings" })}
            </CardTitle>
            <CardDescription>
              {t("descriptions.profileDisplayName", {
                ns: "settings",
                appName: UI_APPLICATION_NAME,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col gap-4 md:flex-row lg:flex-wrap">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-muted-foreground mb-2">
                      {t("display.firstName", { ns: "labels" })}
                    </FormLabel>
                    <FormControl className="mb-0">
                      <Input
                        {...field}
                        className="bg-transparent lg:w-72"
                        placeholder={t("display.firstName", { ns: "labels" })}
                        autoComplete="given-name"
                        readOnly={isLocked}
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
                  <FormItem>
                    <FormLabel className="text-muted-foreground mb-2">
                      {t("display.lastName", { ns: "labels" })}
                    </FormLabel>
                    <FormControl className="mb-0">
                      <Input
                        {...field}
                        className="bg-transparent lg:w-72"
                        placeholder={t("display.lastName", { ns: "labels" })}
                        autoComplete="family-name"
                        readOnly={isLocked}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </CardContent>
          <CardFooter className="justify-end border-t py-2.5">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="bg-transparent"
              disabled={isLocked || isMutating}
            >
              <span>{t("buttons.save", { ns: "labels" })}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function LanguageBlock({
  form,
  languages,
  onFormSubmit,
  isLocked,
  isMutating,
}: BlockProps) {
  const { t } = useTranslation();
  const languagesList = languages
    .filter((item) => item.key)
    .sort((a, b) => a.key.localeCompare(b.key));
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("titles.profileLanguage", { ns: "settings" })}
            </CardTitle>
            <CardDescription>
              {t("descriptions.profileLanguage", {
                ns: "settings",
                appName: UI_APPLICATION_NAME,
              })}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <FormField
              control={form.control}
              name="language"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only space-y-0">
                    {t("display.language", { ns: "labels" })}
                  </FormLabel>
                  <InputSelect
                    placeholder={t("selectYourLocalization", {
                      ns: "messages",
                    })}
                    disabled={isLocked}
                    defaultValue={String(field.value)}
                    onValueChange={field.onChange}
                    items={languagesList.map((lang, idx) => ({
                      id: `lang_${idx}_${lang.key}`,
                      value: String(lang.key),
                      label: `${lang.value}`,
                    }))}
                  >
                    <FormControl>
                      <InputSelectTrigger className="bg-transparent lg:w-72" />
                    </FormControl>
                    <InputSelectContent />
                  </InputSelect>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end border-t py-2.5">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="bg-transparent"
              disabled={isLocked || isMutating}
            >
              <span>{t("buttons.save", { ns: "labels" })}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function PhoneNumberBlock({
  onFormSubmit,
  form,
  isLocked,
  isMutating,
}: BlockProps) {
  const { t } = useTranslation();
  return (
    <Form {...form}>
      <form onSubmit={onFormSubmit}>
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">
              {t("titles.profilePhoneNumber", { ns: "settings" })}
            </CardTitle>
            <CardDescription>
              {t("descriptions.profilePhoneNumber", {
                ns: "settings",
                appName: UI_APPLICATION_NAME,
              })}
            </CardDescription>
          </CardHeader>

          <CardContent>
            <FormField
              control={form.control}
              name="phone"
              render={({ field }) => (
                <FormItem className="space-y-0">
                  <FormLabel className="sr-only">
                    {t("display.phoneNo", { ns: "labels" })}
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      className="m-0 bg-transparent lg:w-72"
                      placeholder={t("display.phoneNo", { ns: "labels" })}
                      autoComplete="tel"
                      readOnly={isLocked}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter className="justify-end border-t py-2.5">
            <Button
              type="submit"
              size="sm"
              variant="outline"
              className="bg-transparent"
              disabled={isLocked || isMutating}
            >
              <span>{t("buttons.save", { ns: "labels" })}</span>
            </Button>
          </CardFooter>
        </Card>
      </form>
    </Form>
  );
}

function ResetPasswordBlock({ clientId, userId, user }: BlockProps) {
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(false);
  return (
    <>
      <UserResetPasswordDialog
        open={open}
        setOpen={setOpen}
        user={user}
        clientId={clientId}
        userId={userId}
      />
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {t("titles.profileResetPassword", { ns: "settings" })}
          </CardTitle>
          <CardDescription>
            {t("descriptions.profileResetPassword", {
              ns: "settings",
              appName: UI_APPLICATION_NAME,
            })}
          </CardDescription>
        </CardHeader>
        <CardFooter className="justify-end border-t py-2.5">
          <Button
            type="button"
            size="sm"
            variant="outline"
            className="text-destructive/90 hover:text-destructive bg-transparent"
            onClick={() => setOpen(true)}
          >
            <span>{t("labels.resetPassword", { ns: "settings" })}</span>
          </Button>
        </CardFooter>
      </Card>
    </>
  );
}

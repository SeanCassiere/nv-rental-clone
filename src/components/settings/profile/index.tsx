import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";

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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { useToast } from "@/components/ui/use-toast";

import { useAuthValues } from "@/hooks/internal/useAuthValues";
import { usePermission } from "@/hooks/internal/usePermission";
import { useGetUserLanguages } from "@/hooks/network/user/useGetUserLanguages";
import { useGetUserProfile } from "@/hooks/network/user/useGetUserProfile";

import {
  UpdateUserSchema,
  type TUserProfile,
  type UpdateUserInput,
  type UserLanguageItem,
} from "@/schemas/user";

import { localDateTimeWithoutSecondsToQueryYearMonthDay } from "@/utils/date";
import { locationQKeys, userQKeys } from "@/utils/query-key";

import { apiClient } from "@/api";

export default function SettingsProfileTab() {
  const { t } = useTranslation("settings");

  const userQuery = useGetUserProfile({
    suspense: true,
  });

  const languagesQuery = useGetUserLanguages({
    suspense: true,
  });

  return (
    <Card className="shadow-none lg:w-[600px]">
      <CardHeader className="p-4 lg:p-6">
        <CardTitle className="text-xl">{t("titles.profile")}</CardTitle>
        <CardDescription className="text-base text-foreground/80">
          {t("descriptions.profile")}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0 lg:p-6">
        {(userQuery.status === "loading" ||
          languagesQuery.status === "loading") && (
          <Skeleton className="h-96 w-full lg:max-w-2xl" />
        )}
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
}) {
  const { user, languages } = props;

  const { t: tConfig } = useTranslation("settings");
  const { t: tMessages } = useTranslation("messages");
  const { t: tLabels } = useTranslation("labels");

  const auth = useAuthValues();
  const queryClient = useQueryClient();

  const { toast } = useToast();

  const canViewAdminTab = usePermission("VIEW_ADMIN_TAB");

  const languagesList = languages
    .filter((item) => item.key)
    .sort((a, b) => a.key.localeCompare(b.key));

  const form = useForm<UpdateUserInput>({
    resolver: zodResolver(UpdateUserSchema),
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

  const { mutate, isLoading } = useMutation({
    mutationFn: apiClient.user.updateProfileByUserId,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries(userQKeys.me());
      queryClient.invalidateQueries(
        userQKeys.permissions(variables.params.userId)
      );
      queryClient.invalidateQueries(locationQKeys.all());

      if (data.status >= 200 && data.status < 300) {
        toast({
          title: tMessages("labelUpdated", {
            label: tConfig("titles.profile"),
          }),
          description: tMessages("labelUpdatedSuccess", {
            label: tConfig("titles.profile"),
          }),
        });
      } else {
        toast({
          title: tMessages("somethingWentWrong"),
          description: tMessages("pleaseTryAgain"),
          variant: "destructive",
        });
      }
    },
    onError: (err) => {
      if (err instanceof Error) {
        toast({
          title: tMessages("somethingWentWrong"),
          description: err?.message || tMessages("pleaseTryAgain"),
          variant: "destructive",
        });
      }
    },
  });

  const isDisabled = canViewAdminTab === false || isLoading;

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
              <FormLabel>{tLabels("display.username")}</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>
                {tMessages("usernameCannotBeChanged", { context: "me" })}
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
              <FormLabel>{tLabels("display.email")}</FormLabel>
              <FormControl>
                <Input {...field} disabled={isDisabled} />
              </FormControl>
              <FormDescription>
                {tMessages("emailAssociatedWithAccount", { context: "me" })}
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
                <FormLabel>{tLabels("display.firstName")}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isDisabled} />
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
                <FormLabel>{tLabels("display.lastName")}</FormLabel>
                <FormControl>
                  <Input {...field} disabled={isDisabled} />
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
                <FormLabel>{tLabels("display.language")}</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                  disabled={isDisabled}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue
                        placeholder={tMessages("selectYourLocalization")}
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
                  {tLabels("display.phoneNo")}&nbsp;
                  <span className="text-xs text-foreground/70">
                    {tLabels("display.bracketOptional")}
                  </span>
                </FormLabel>
                <FormControl>
                  <Input {...field} disabled={isDisabled} />
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
                  {tLabels("display.youReceiveEmailsQuestion")}
                </FormLabel>
                <FormDescription>
                  {tMessages("receiveReservationEmails")}
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
          {tLabels("buttons.saveProfileDetails")}
        </Button>
      </form>
    </Form>
  );
}

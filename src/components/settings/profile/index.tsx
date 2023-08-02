import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";

import { useForm } from "react-hook-form";

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
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  UpdateUserSchema,
  type TUserProfile,
  type UpdateUserInput,
  type UserLanguageItem,
} from "@/schemas/user";

import { useGetUserProfile } from "@/hooks/network/user/useGetUserProfile";
import { useGetUserLanguages } from "@/hooks/network/user/useGetUserLanguages";

export default function SettingsProfileTab() {
  const userQuery = useGetUserProfile({
    suspense: true,
  });

  const languagesQuery = useGetUserLanguages({
    suspense: true,
  });

  return (
    <>
      <h2 className="text-xl font-semibold leading-10 text-primary">Profile</h2>
      <p className="text-base text-primary/80">
        Customize and manage your profile with ease.
      </p>
      {(userQuery.status === "loading" ||
        languagesQuery.status === "loading") && (
        <Skeleton className="mt-6 h-96 w-full lg:max-w-2xl" />
      )}
      {userQuery.status === "success" &&
        languagesQuery.status === "success" && (
          <article className="mt-6 w-full lg:max-w-2xl">
            <ProfileForm
              user={userQuery.data}
              languages={languagesQuery.data}
            />
          </article>
        )}
    </>
  );
}

function ProfileForm(props: {
  user: TUserProfile;
  languages: UserLanguageItem[];
}) {
  const { user, languages } = props;

  const languagesList = languages.filter((item) => item.key);

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
    },
  });

  return (
    <Form {...form}>
      <form
        className="flex flex-col gap-5"
        onSubmit={form.handleSubmit(async (values) => {
          console.log("update user", values);
        })}
      >
        <FormField
          control={form.control}
          name="userName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} disabled />
              </FormControl>
              <FormDescription>
                This is your username and cannot be changed.
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
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormDescription>
                The email address associated with your account.
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
                <FormLabel>First name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Last name</FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Language</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select your localization" />
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
                  Phone no.{" "}
                  <span className="text-xs text-primary/70">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input {...field} />
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
                <FormLabel>Receive emails?</FormLabel>
                <FormDescription>
                  You'll be copied on emails that are sent from the system.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Separator className="mt-0.5" />
        <Button type="submit" className="w-full lg:w-max">
          Save profile details
        </Button>
      </form>
    </Form>
  );
}

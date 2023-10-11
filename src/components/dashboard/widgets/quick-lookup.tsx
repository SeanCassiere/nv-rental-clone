import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { Loader2Icon } from "lucide-react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import { CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
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

const QuickLookupWidget = () => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">Quick lookup</CardTitle>
      </CardHeader>
      <CardContent>
        <QuickLookupForm />
      </CardContent>
    </>
  );
};

export default React.memo(QuickLookupWidget);

function buildFormSchema() {
  return z.object({
    refType: z.string(),
    vehicleLicenseNo: z.string(),
    agreementNo: z.string(),
    reservationNo: z.string(),
    customerPhoneNo: z.string(),
  });
}

export function QuickLookupForm() {
  const { t } = useTranslation();

  const form = useForm({
    resolver: zodResolver(buildFormSchema()),
    defaultValues: {
      accessor: "customerPhoneNo",
      vehicleLicenseNo: "",
      agreementNo: "",
      reservationNo: "",
      customerPhoneNo: "",
    },
    shouldUnregister: true,
  });

  const accessor = form.watch("accessor");

  const isSearching = false;

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-y-2 sm:grid-cols-5 sm:gap-x-4"
        onSubmit={form.handleSubmit((values) => {
          console.log(
            "🚀 ~ file: quick-lookup.tsx:50 ~ onSubmit={form.handleSubmit ~ values:",
            values
          );
        })}
      >
        <FormField
          control={form.control}
          name="accessor"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="sr-only">
                Type
                {/* {t("display.vehicleNo", { ns: "labels" })} */}
              </FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a verified email to display" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="customerPhoneNo">
                    {t("display.phoneNo", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="agreementNo">
                    {t("display.agreementNo", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="reservationNo">
                    {t("display.reservationNo", { ns: "labels" })}
                  </SelectItem>
                  <SelectItem value="vehicleLicenseNo">
                    {t("display.licenseNo", { ns: "labels" })}
                  </SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        {accessor === "customerPhoneNo" && (
          <FormField
            control={form.control}
            name="customerPhoneNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.phoneNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("display.phoneNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {accessor === "reservationNo" && (
          <FormField
            control={form.control}
            name="reservationNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.reservationNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("display.reservationNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {accessor === "agreementNo" && (
          <FormField
            control={form.control}
            name="agreementNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.agreementNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("display.agreementNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {accessor === "vehicleLicenseNo" && (
          <FormField
            control={form.control}
            name="vehicleLicenseNo"
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="sr-only">
                  {t("display.licenseNo", { ns: "labels" })}
                </FormLabel>
                <FormControl>
                  <Input
                    placeholder={t("display.licenseNo", { ns: "labels" })}
                    autoComplete="off"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <Button type="submit" className="mt-2">
          {isSearching && <Loader2Icon className="mr-2 h-4 w-4 animate-spin" />}
          {t("buttons.lookup", { ns: "labels" })}
        </Button>
      </form>
    </Form>
  );
}

import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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

const QuickCheckinAgreementWidget = ({
  locations,
}: {
  locations: string[];
}) => {
  return (
    <>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-medium">
          Quick rental checkin
        </CardTitle>
      </CardHeader>
      <CardContent>
        <QuickCheckinAgreementForm locations={locations} />
      </CardContent>
    </>
  );
};

export default React.memo(QuickCheckinAgreementWidget);

function buildFormSchema() {
  return z.object({
    agreementNo: z.string(),
    vehicleNo: z.string(),
  });
}

export function QuickCheckinAgreementForm({
  locations,
}: {
  locations: string[];
}) {
  const form = useForm({
    resolver: zodResolver(buildFormSchema()),
    defaultValues: {
      agreementNo: "",
      vehicleNo: "",
    },
  });

  return (
    <Form {...form}>
      <form
        className="grid grid-cols-1 gap-y-2 sm:grid-cols-5 sm:gap-x-4"
        onSubmit={form.handleSubmit(async (values) => {
          // check if any of the values have a string length greater than 0
          // if so, then we can assume that the user has entered some data
          // and we can proceed to the next step
          const hasData = Object.values(values).some(
            (value) => value.length > 0
          );
          if (!hasData) {
            toast.error('Enter either "Agreement no." or "Vehicle no."');
            return;
          }

          console.log(
            "🚀 ~ file: quick-checkin-agreement.tsx:65 ~ onSubmit={form.handleSubmit ~ values:",
            values
          );
          console.log(
            "🚀 ~ file: quick-checkin-agreement.tsx:65 ~ onSubmit={form.handleSubmit ~ locations:",
            locations
          );
          //
        })}
      >
        <FormField
          control={form.control}
          name="vehicleNo"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="sr-only">Vehicle no.</FormLabel>
              <FormControl>
                <Input placeholder="Vehicle no." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="agreementNo"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="sr-only">Agreement no.</FormLabel>
              <FormControl>
                <Input placeholder="Agreement no." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" className="mt-2">
          Checkin
        </Button>
      </form>
    </Form>
  );
}

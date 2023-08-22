import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import SelectCustomerModal from "@/components/Dialogs/SelectCustomerModal";
import { Button } from "@/components/ui/button";
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
  InputDatePicker,
  InputDatePickerSlot,
} from "@/components/ui/input-datepicker";

import { useDatePreference } from "@/hooks/internal/useDatePreferences";

const REQUIRED = "Required" as const;

function CommonCustomerInformationSchema() {
  return z
    .object({
      address: z.string().min(1, REQUIRED),
      city: z.string().min(1, REQUIRED),
      countryId: z.coerce.number().min(1, REQUIRED),
      customerId: z.coerce.number().min(1, REQUIRED),
      dateOfBirth: z.string().min(1, REQUIRED).nullable(),
      // driverType
      email: z.string().min(1, REQUIRED),
      firstName: z.string().min(1, REQUIRED),
      lastName: z.string().min(1, REQUIRED),
      licenseExpiryDate: z.string().nullable(),
      licenseIssueDate: z.string().nullable(),
      licenseNumber: z.string().nullable(),
      bPhone: z.string().nullable(),
      cPhone: z.string().nullable(),
      hPhone: z.string().nullable(),
      stateId: z.coerce.number().min(1, REQUIRED),
      zipCode: z.string().min(1, REQUIRED),
      isTaxSaver: z.boolean().default(false),
    })
    .superRefine((data, ctx) => {
      if (!data.hPhone && !data.bPhone && !data.cPhone) {
        return ctx.addIssue({
          code: "custom",
          message: "A phone number is required",
          path: ["hPhone"],
        });
      }
    });
}
export type CommonCustomerInformationSchemaParsed = z.infer<
  ReturnType<typeof CommonCustomerInformationSchema>
>;

const valOpts = {
  shouldValidate: true,
};

export interface CustomerStageProps {
  customerInformation: CommonCustomerInformationSchemaParsed | undefined;
  onCompleted: (data: CommonCustomerInformationSchemaParsed) => void;
  isEdit: boolean;
}

export const CustomerStage = ({
  customerInformation,
  // isEdit,
  onCompleted,
}: CustomerStageProps) => {
  const { dateFormat } = useDatePreference();

  const [showCustomerPicker, setShowCustomerPicker] = useState(false);

  const values: CommonCustomerInformationSchemaParsed = {
    address: customerInformation?.address || "",
    city: customerInformation?.city || "",
    countryId: customerInformation?.countryId || 0,
    customerId: customerInformation?.customerId || 0,
    dateOfBirth: customerInformation?.dateOfBirth || "",
    email: customerInformation?.email || "",
    firstName: customerInformation?.firstName || "",
    lastName: customerInformation?.lastName || "",
    licenseExpiryDate: customerInformation?.licenseExpiryDate || null,
    licenseIssueDate: customerInformation?.licenseIssueDate || null,
    licenseNumber: customerInformation?.licenseNumber || null,
    bPhone: customerInformation?.bPhone || "",
    cPhone: customerInformation?.cPhone || "",
    hPhone: customerInformation?.hPhone || "",
    stateId: customerInformation?.stateId || 0,
    zipCode: customerInformation?.zipCode || "",
    isTaxSaver: customerInformation?.isTaxSaver || false,
  };

  const form = useForm({
    resolver: zodResolver(CommonCustomerInformationSchema()),
    defaultValues: values,
    values: customerInformation ? values : undefined,
  });

  const form_dob = form.watch("dateOfBirth");

  return (
    <Form {...form}>
      <SelectCustomerModal
        show={showCustomerPicker}
        setShow={setShowCustomerPicker}
        onSelect={(customer) => {
          form.setValue("address", customer.Address1 ?? "", valOpts);
          form.setValue("city", customer.City ?? "", valOpts);
          form.setValue("countryId", customer.CountryId ?? 0, valOpts);
          form.setValue("customerId", customer.CustomerId, valOpts);
          form.setValue("dateOfBirth", customer.DateOfbirth ?? null, valOpts);
          form.setValue("email", customer.Email ?? "", valOpts);
          form.setValue("firstName", customer.FirstName ?? "", valOpts);
          form.setValue("lastName", customer.LastName ?? "", valOpts);
          form.setValue(
            "licenseExpiryDate",
            customer.LicenseExpiryDate ?? null,
            valOpts
          );
          form.setValue(
            "licenseIssueDate",
            customer.LicenseIssueDate ?? null,
            valOpts
          );
          form.setValue(
            "licenseNumber",
            customer.LicenseNumber ?? null,
            valOpts
          );
          form.setValue("bPhone", customer.bPhone ?? "", valOpts);
          form.setValue("cPhone", customer.cPhone ?? "", valOpts);
          form.setValue("hPhone", customer.hPhone ?? "", valOpts);
          form.setValue("stateId", customer.StateId ?? 0, valOpts);
          form.setValue("zipCode", customer.ZipCode ?? "", valOpts);
          const isTaxSaver =
            customer.CustomerType?.toLowerCase().includes("taxsaver") ||
            customer.IsTaxExempt ||
            false;
          form.setValue("isTaxSaver", isTaxSaver, valOpts);
        }}
      />

      <div className="flex px-1">
        <Button
          variant="outline"
          onClick={() => {
            setShowCustomerPicker(true);
          }}
        >
          Search customer
        </Button>
      </div>
      <form
        onSubmit={form.handleSubmit(async (data) => {
          onCompleted?.(data);
        })}
        className="flex flex-col gap-4 px-1 pt-4"
        autoComplete="off"
      >
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          <div>
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First name</FormLabel>
                  <FormControl>
                    <Input placeholder="First name" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last name</FormLabel>
                  <FormControl>
                    <Input placeholder="Last name" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="dateOfBirth"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Date of birth</FormLabel>
                  <InputDatePicker
                    mode="date"
                    format={dateFormat}
                    value={
                      form_dob !== "" && form_dob !== null
                        ? new Date(form_dob)
                        : undefined
                    }
                    onChange={field.onChange}
                    readOnly
                  >
                    <FormControl>
                      <InputDatePickerSlot placeholder="Date of birth" />
                    </FormControl>
                  </InputDatePicker>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="hPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Home phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Home phone"
                      readOnly
                      {...field}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="bPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Work phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Work phone"
                      readOnly
                      {...field}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="cPhone"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mobile phone</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Mobile phone"
                      readOnly
                      {...field}
                      value={field.value ?? undefined}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="licenseNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>License no.</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="License no."
                      readOnly
                      key={`customer-licenseNumber-${field.value}`}
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="md:col-span-2">
            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Address</FormLabel>
                  <FormControl>
                    <Input placeholder="Address" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="city"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>City</FormLabel>
                  <FormControl>
                    <Input placeholder="City" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div>
            <FormField
              control={form.control}
              name="zipCode"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zip</FormLabel>
                  <FormControl>
                    <Input placeholder="Zip code" readOnly {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div>
          <Button type="submit">Save & Continue</Button>
        </div>
      </form>
    </Form>
  );
};

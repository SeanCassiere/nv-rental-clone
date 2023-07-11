import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InformationBlockCardWithChildren } from "../PrimaryModule/ModuleInformation/common";
import { DocumentTextSolid } from "../icons";
import { Button, DatePicker, TextInput } from "../Form";
import SelectCustomerModal from "../Dialogs/SelectCustomerModal";

const REQUIRED = "Required" as const;

function CommonCustomerInformationSchema() {
  return z
    .object({
      address: z.string().min(1, REQUIRED),
      city: z.string().min(1, REQUIRED),
      countryId: z.number().min(1, REQUIRED),
      customerId: z.number().min(1, REQUIRED),
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
      stateId: z.number().min(1, REQUIRED),
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

const CommonCustomerInformation = ({
  customerInformation,
  // isEdit,
  onCompleted,
}: {
  customerInformation: CommonCustomerInformationSchemaParsed | undefined;
  onCompleted: (data: CommonCustomerInformationSchemaParsed) => void;
  isEdit: boolean;
}) => {
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

  const {
    handleSubmit,
    register,
    formState: { errors },
    getValues,
    setValue,
  } = useForm({
    resolver: zodResolver(CommonCustomerInformationSchema()),
    defaultValues: values,
    values: customerInformation ? values : undefined,
  });

  return (
    <>
      <SelectCustomerModal
        show={showCustomerPicker}
        setShow={setShowCustomerPicker}
        onSelect={(customer) => {
          setValue("address", customer.Address1 ?? "", valOpts);
          setValue("city", customer.City ?? "", valOpts);
          setValue("countryId", customer.CountryId ?? 0, valOpts);
          setValue("customerId", customer.CustomerId, valOpts);
          setValue("dateOfBirth", customer.DateOfbirth ?? null, valOpts);
          setValue("email", customer.Email ?? "", valOpts);
          setValue("firstName", customer.FirstName ?? "", valOpts);
          setValue("lastName", customer.LastName ?? "", valOpts);
          setValue(
            "licenseExpiryDate",
            customer.LicenseExpiryDate ?? null,
            valOpts,
          );
          setValue(
            "licenseIssueDate",
            customer.LicenseIssueDate ?? null,
            valOpts,
          );
          setValue("licenseNumber", customer.LicenseNumber ?? null, valOpts);
          setValue("bPhone", customer.bPhone ?? "", valOpts);
          setValue("cPhone", customer.cPhone ?? "", valOpts);
          setValue("hPhone", customer.hPhone ?? "", valOpts);
          setValue("stateId", customer.StateId ?? 0, valOpts);
          setValue("zipCode", customer.ZipCode ?? "", valOpts);
          const isTaxSaver =
            customer.CustomerType?.toLowerCase().includes("taxsaver") ||
            customer.IsTaxExempt ||
            false;
          setValue("isTaxSaver", isTaxSaver, valOpts);
        }}
      />
      <InformationBlockCardWithChildren
        identifier="customer-information"
        icon={<DocumentTextSolid className="h-5 w-5" />}
        title="Customer information"
        isLoading={false}
      >
        <div className="mx-4 mt-4 flex">
          <Button
            onClick={() => {
              setShowCustomerPicker(true);
            }}
          >
            Search customer
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            onCompleted?.(data);
          })}
          className="flex flex-col gap-4 p-4"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <div>
              <TextInput
                label="First name"
                {...register("firstName")}
                error={!!errors.firstName}
                errorText={errors.firstName?.message}
                readOnly
              />
            </div>
            <div>
              <TextInput
                label="Last name"
                {...register("lastName")}
                error={!!errors.lastName}
                errorText={errors.lastName?.message}
                readOnly
              />
            </div>
            <div>
              <DatePicker
                selected={
                  getValues("dateOfBirth")
                    ? new Date(getValues("dateOfBirth")!)
                    : null
                }
                onChange={(date) => {
                  //
                }}
                placeholderText="Date of birth"
                readOnly
              />
            </div>
            <div>
              <TextInput
                label="Home phone"
                {...register("hPhone")}
                error={!!errors.hPhone}
                errorText={errors.hPhone?.message}
                readOnly
              />
            </div>
            <div>
              <TextInput
                label="Work phone"
                {...register("bPhone")}
                error={!!errors.bPhone}
                errorText={errors.bPhone?.message}
                readOnly
              />
            </div>
            <div>
              <TextInput
                label="Mobile phone"
                {...register("cPhone")}
                error={!!errors.cPhone}
                errorText={errors.cPhone?.message}
                readOnly
              />
            </div>
            <div>
              <TextInput
                label="License no."
                {...register("licenseNumber")}
                error={!!errors.licenseNumber}
                errorText={errors.licenseNumber?.message}
                readOnly
              />
            </div>
            <div className="md:col-span-2">
              <TextInput
                label="Address"
                {...register("address")}
                error={!!errors.address}
                errorText={errors.address?.message}
                readOnly
              />
            </div>
            <div>
              <TextInput
                label="City"
                {...register("city")}
                error={!!errors.city}
                errorText={errors.city?.message}
                readOnly
              />
            </div>
            <div>
              <TextInput
                label="Zip"
                {...register("zipCode")}
                error={!!errors.zipCode}
                errorText={errors.zipCode?.message}
                readOnly
              />
            </div>
          </div>
          <div>
            <Button type="submit" color="teal">
              Save & Continue
            </Button>
          </div>
        </form>
      </InformationBlockCardWithChildren>
    </>
  );
};

export default CommonCustomerInformation;

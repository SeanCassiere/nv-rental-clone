import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { InformationBlockCardWithChildren } from "../PrimaryModule/ModuleInformation/common";
import { DocumentTextSolid } from "../icons";
import {
  Button,
  // TextInput
} from "../Form";
import SelectCustomerModal from "../Dialogs/SelectCustomerModal";

const REQUIRED = "Required" as const;

function CommonCustomerInformationSchema() {
  return z.object({
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
    phone: z.string().min(1, REQUIRED),
    stateId: z.number().min(1, REQUIRED),
    zipCode: z.string().min(1, REQUIRED),
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
    phone: customerInformation?.phone || "",
    stateId: customerInformation?.stateId || 0,
    zipCode: customerInformation?.zipCode || "",
  };

  const {
    handleSubmit,
    // register,
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
            valOpts
          );
          setValue(
            "licenseIssueDate",
            customer.LicenseIssueDate ?? null,
            valOpts
          );
          setValue("licenseNumber", customer.LicenseNumber ?? null, valOpts);
          setValue("phone", customer.hPhone ?? "", valOpts);
          setValue("stateId", customer.StateId ?? 0, valOpts);
          setValue("zipCode", customer.ZipCode ?? "", valOpts);
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
          <p>Data</p>
          <pre className="text-sm">{JSON.stringify(getValues(), null, 2)}</pre>
          {[...Object.keys(errors)].length > 0 && (
            <>
              <p>Errors</p>
              <pre className="text-sm">{JSON.stringify(errors, null, 2)}</pre>
            </>
          )}
          <div className="grid gap-4 md:grid-cols-2">
            <div></div>
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

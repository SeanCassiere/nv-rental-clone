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

function CommonCustomerInformationSchema() {
  return z.object({});
}
export type CommonCustomerInformationSchemaParsed = z.infer<
  ReturnType<typeof CommonCustomerInformationSchema>
>;

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
    ...customerInformation,
  };

  const {
    handleSubmit,
    // register,
    // formState: { errors },
    // getValues,
    // setValue,
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
          console.log("selected customer", customer);
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
            Search customers
          </Button>
        </div>
        <form
          onSubmit={handleSubmit(async (data) => {
            onCompleted?.(data);
          })}
          className="flex flex-col gap-4 p-4"
          autoComplete="off"
        >
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

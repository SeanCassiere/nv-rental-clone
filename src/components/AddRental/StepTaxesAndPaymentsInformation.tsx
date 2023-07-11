import { useState } from "react";
import { Transition } from "@headlessui/react";

import { useGetTaxes } from "../../hooks/network/taxes/useGetTaxes";
import { Button } from "../Form";
import { ChevronDownOutline, DocumentTextSolid } from "../icons";
import { InformationBlockCardWithChildren } from "../PrimaryModule/ModuleInformation/common";
import { cn } from "@/utils";

interface StepTaxesAndPaymentsInformationProps {
  module: "agreements" | "reservations";
  isEdit: boolean;
  rentalInformation:
    | {
        checkoutDate: Date;
        checkinDate: Date;
        checkoutLocation: number;
        checkinLocation: number;
        rentalType: string;
        rentalReferenceId: string;
      }
    | undefined;

  selectedTaxes: number[];
  onSelectedTaxes: (taxesIds: number[]) => void;

  onCompleted: () => void;
  currency?: string;
}

const StepTaxesAndPaymentsInformation = (
  props: StepTaxesAndPaymentsInformationProps,
) => {
  const [step, setStep] = useState(0);

  const handleNext = () => {
    if (step === 1) {
      props.onCompleted();
    } else {
      setStep((prev) => prev + 1);
    }
  };

  return (
    <div className="grid gap-1">
      <InformationBlockCardWithChildren
        identifier="taxes-information"
        icon={<DocumentTextSolid className="h-5 w-5" />}
        title="Tax information"
        isLoading={false}
        renderEndIcon={
          <button className="px-2 py-1" onClick={() => setStep(0)}>
            <ChevronDownOutline
              className={cn("h-4 w-4", step === 0 ? "rotate-180" : "")}
            />
          </button>
        }
      >
        <Transition
          show={step === 0}
          enter="transition-all duration-75"
          enterFrom="opacity-0 scale-100"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-100"
        >
          <CommonTaxesInformation
            isEdit={props.isEdit}
            module={props.module}
            rentalInformation={props.rentalInformation}
            taxes={props.selectedTaxes}
            onSelectedTaxes={props.onSelectedTaxes}
            onNavigateNext={handleNext}
            isSupportingInfoAvailable={Boolean(props.rentalInformation)}
          />
        </Transition>
      </InformationBlockCardWithChildren>
      <InformationBlockCardWithChildren
        identifier="payment-information"
        icon={<DocumentTextSolid className="h-5 w-5" />}
        title="Payment information"
        isLoading={false}
        renderEndIcon={
          <button className="px-2 py-1" onClick={() => setStep(1)}>
            <ChevronDownOutline
              className={cn("h-4 w-4", step === 1 ? "rotate-180" : "")}
            />
          </button>
        }
      >
        <Transition
          show={step === 1}
          enter="transition-all duration-75"
          enterFrom="opacity-0 scale-100"
          enterTo="opacity-100 scale-100"
          leave="transition-all duration-75"
          leaveFrom="opacity-100 scale-100"
          leaveTo="opacity-0 scale-100"
        >
          <div>
            <div>Payments</div>
            <button
              onClick={() => {
                handleNext();
              }}
            >
              Next
            </button>
          </div>
        </Transition>
      </InformationBlockCardWithChildren>
    </div>
  );
};

export default StepTaxesAndPaymentsInformation;

interface CommonTaxesInformationProps {
  isEdit: boolean;
  module: "agreements" | "reservations";
  rentalInformation: StepTaxesAndPaymentsInformationProps["rentalInformation"];

  taxes: StepTaxesAndPaymentsInformationProps["selectedTaxes"];
  onSelectedTaxes: StepTaxesAndPaymentsInformationProps["onSelectedTaxes"];

  isSupportingInfoAvailable: boolean;
  onNavigateNext: () => void;
}
const CommonTaxesInformation = (props: CommonTaxesInformationProps) => {
  const {
    isSupportingInfoAvailable,
    taxes,
    rentalInformation,
    onNavigateNext,
    onSelectedTaxes,
  } = props;

  const [selectedTaxes, setSelectedTaxes] =
    useState<CommonTaxesInformationProps["taxes"]>(taxes);

  const taxesData = useGetTaxes({
    filters: { LocationId: rentalInformation?.checkoutLocation ?? 0 },
    enabled: isSupportingInfoAvailable,
  });

  const mandatoryTaxes = (taxesData.data || [])
    .filter((tax) => tax.isOptional === false)
    .map((tax) => tax.id);

  return (
    <>
      <div className="mx-4 my-4">
        {!isSupportingInfoAvailable && (
          <div className="pb-4 text-red-500">
            Checkout location is required to be able to add taxes.
          </div>
        )}
        <div className="grid grid-cols-1 items-center md:grid-cols-3">
          {(taxesData.data || [])
            .sort((tax1, tax2) => tax1.id - tax2.id)
            .map((tax, idx) => (
              <div
                key={`${tax.id}-${idx}`}
                className="flex items-center justify-start gap-2"
              >
                <input
                  type="checkbox"
                  checked={selectedTaxes.includes(tax.id)}
                  onChange={(evt) => {
                    const checked = evt.target.checked;
                    setSelectedTaxes((prev) => {
                      const withoutId = prev.filter((id) => id !== tax.id);
                      if (checked) {
                        return withoutId.concat(tax.id);
                      }
                      return withoutId;
                    });
                  }}
                  id={`${tax.id}-${idx}-${tax.name}`}
                  disabled={mandatoryTaxes.includes(tax.id)}
                  className="rounded text-teal-500 focus:outline-teal-500 disabled:cursor-not-allowed disabled:text-slate-400"
                />
                <label
                  htmlFor={`${tax.id}-${idx}-${tax.name}`}
                  className={cn(
                    "",
                    mandatoryTaxes.includes(tax.id)
                      ? "cursor-not-allowed"
                      : "cursor-pointer",
                  )}
                >
                  {tax.name}
                </label>
              </div>
            ))}
        </div>
        <div className="mt-4">
          <Button
            type="button"
            color="teal"
            onClick={() => {
              onSelectedTaxes(selectedTaxes);
              onNavigateNext();
            }}
          >
            Save & Continue
          </Button>
        </div>
      </div>
    </>
  );
};

import { useState } from "react";
import { Transition } from "@headlessui/react";

import CommonRatesInformation from "./CommonRatesInformation";
import { type RentalRateParsed } from "../../utils/schemas/rate";
import { InformationBlockCardWithChildren } from "../PrimaryModule/ModuleInformation/common";
import { ChevronDownOutline, DocumentTextSolid } from "../icons";
import classNames from "classnames";

export interface StepRatesAndChargesInformationProps {
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
  vehicleInformation:
    | {
        vehicleTypeId: number;
      }
    | undefined;
  rateName: string;
  onSelectRateName: (rateName: string) => void;
  rate: RentalRateParsed | null;
  onSelectedRate: (rate: RentalRateParsed) => void;
  misCharges: any[];
  onCompleted: () => void;
}

const StepRatesAndChargesInformation = (
  props: StepRatesAndChargesInformationProps
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
        identifier="rates-information"
        icon={<DocumentTextSolid className="h-5 w-5" />}
        title="Rental rates information"
        isLoading={false}
        renderEndIcon={
          <button className="px-2 py-1" onClick={() => setStep(0)}>
            <ChevronDownOutline
              className={classNames("h-4 w-4", step === 0 ? "rotate-180" : "")}
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
          <CommonRatesInformation
            isEdit={props.isEdit}
            module={props.module}
            rentalInformation={props.rentalInformation}
            vehicleInformation={props.vehicleInformation}
            rateName={props.rateName}
            onSelectRateName={props.onSelectRateName}
            rate={props.rate}
            onSelectedRate={props.onSelectedRate}
            onNavigateNext={handleNext}
            isSupportingInfoAvailable={
              Boolean(props.rentalInformation) &&
              Boolean(props.vehicleInformation)
            }
          />
        </Transition>
      </InformationBlockCardWithChildren>
      <InformationBlockCardWithChildren
        identifier="misc-charges-information"
        icon={<DocumentTextSolid className="h-5 w-5" />}
        title="Miscellaneous charges information"
        isLoading={false}
        renderEndIcon={
          <button className="px-2 py-1" onClick={() => setStep(1)}>
            <ChevronDownOutline
              className={classNames("h-4 w-4", step === 1 ? "rotate-180" : "")}
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
          <div>Misc Charges</div>
          <button
            onClick={() => {
              handleNext();
            }}
          >
            Next
          </button>
        </Transition>
      </InformationBlockCardWithChildren>
    </div>
  );
};

export default StepRatesAndChargesInformation;

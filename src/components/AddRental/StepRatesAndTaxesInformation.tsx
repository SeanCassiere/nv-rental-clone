import { useState } from "react";

import CommonRatesInformation from "./CommonRatesInformation";

export interface StepRatesAndTaxesInformationProps {
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
  misCharges: any[];
  onCompleted: () => void;
}

const StepRatesAndTaxesInformation = (
  props: StepRatesAndTaxesInformationProps
) => {
  const [step, setStep] = useState(0);
  return (
    <div>
      <p>Step: {Number(step).toString()}</p>
      <CommonRatesInformation
        isEdit={props.isEdit}
        module={props.module}
        rentalInformation={props.rentalInformation}
        vehicleInformation={props.vehicleInformation}
      />
      <button
        onClick={() => {
          if (step < 2) {
            setStep((prev) => prev + 1);
            return;
          }

          props.onCompleted();
        }}
        className="rounded bg-teal-500 p-2 text-white"
      >
        Next
      </button>
    </div>
  );
};

export default StepRatesAndTaxesInformation;

import { useState } from "react";

import CommonRatesInformation from "./CommonRatesInformation";
import { type RentalRateParsed } from "../../utils/schemas/rate";

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
  rateName: string;
  onSelectRateName: (rateName: string) => void;
  rate: RentalRateParsed | null;
  onSelectedRate: (rate: RentalRateParsed) => void;
  misCharges: any[];
  onCompleted: () => void;
}

const StepRatesAndTaxesInformation = (
  props: StepRatesAndTaxesInformationProps
) => {
  const [step, setStep] = useState(0);
  return (
    <div>
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
      <p>Step: {Number(step).toString()}</p>
      <CommonRatesInformation
        isEdit={props.isEdit}
        module={props.module}
        rentalInformation={props.rentalInformation}
        vehicleInformation={props.vehicleInformation}
        rateName={props.rateName}
        onSelectRateName={props.onSelectRateName}
        rate={props.rate}
        onSelectedRate={props.onSelectedRate}
      />
    </div>
  );
};

export default StepRatesAndTaxesInformation;

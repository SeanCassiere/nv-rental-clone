import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import type { RentalRateParsed } from "@/schemas/rate";

import type { CalculateRentalSummaryInput } from "@/utils/query/summary";

import { MiscChargesStage } from "./misc-charges-stage";
import { RatesStage } from "./rates-stage";

export interface RatesAndChargesTabProps {
  durationStageData:
    | {
        checkoutDate: Date;
        checkinDate: Date;
        checkoutLocation: number;
        checkinLocation: number;
        rentalType: string;
        rentalReferenceId: string;
      }
    | undefined;
  vehicleStageData:
    | {
        vehicleTypeId: number;
      }
    | undefined;

  rateName: string;
  onSelectRateName: (rateName: string) => void;

  rate: RentalRateParsed | null;
  onSelectedRate: (rate: RentalRateParsed) => void;

  miscCharges: CalculateRentalSummaryInput["miscCharges"];
  onSelectedMiscCharges: (
    charges: CalculateRentalSummaryInput["miscCharges"]
  ) => void;

  isEdit: boolean;
  onCompleted: () => void;
}

const RatesAndChargesTab = (props: RatesAndChargesTabProps) => {
  const {
    durationStageData,
    vehicleStageData,
    miscCharges,
    onSelectedMiscCharges,
    rate,
    onSelectedRate,
    rateName,
    onSelectRateName,
    isEdit,
    onCompleted,
  } = props;
  const [tab, setTab] = React.useState("rates");

  return (
    <Card>
      <CardContent>
        <Accordion type="single" value={tab} onValueChange={setTab}>
          <AccordionItem value="rates">
            <AccordionTrigger>Rates details</AccordionTrigger>
            <AccordionContent>
              <RatesStage
                durationStageData={durationStageData}
                vehicleStageData={vehicleStageData}
                rate={rate}
                onSelectedRate={onSelectedRate}
                rateName={rateName}
                onSelectRateName={onSelectRateName}
                isEdit={isEdit}
                onCompleted={() => {
                  setTab("misc-charges");
                }}
                hideRateSelector={false}
                hidePromotionCodeFields
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="misc-charges">
            <AccordionTrigger>Miscellaneous charges</AccordionTrigger>
            <AccordionContent>
              <MiscChargesStage
                durationStageData={durationStageData}
                vehicleStageData={vehicleStageData}
                selectedMiscCharges={miscCharges}
                onSelectedMiscCharges={onSelectedMiscCharges}
                isEdit={isEdit}
                onCompleted={() => {
                  onCompleted();
                }}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default RatesAndChargesTab;

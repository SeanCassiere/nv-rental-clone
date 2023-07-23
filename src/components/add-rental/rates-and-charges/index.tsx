import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import type { CalculateRentalSummaryMiscChargeType } from "@/types/CalculateRentalSummaryAmounts";
import type { RentalRateParsed } from "@/schemas/rate";

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

  miscCharges: CalculateRentalSummaryMiscChargeType[];
  onSelectedMiscCharges: (
    charges: CalculateRentalSummaryMiscChargeType[]
  ) => void;

  isEdit: boolean;
  onCompleted: () => void;

  currency?: string;
}

const RatesAndChargesTab = (props: RatesAndChargesTabProps) => {
  const { isEdit, onCompleted } = props;
  const [tab, setTab] = React.useState("rates");

  return (
    <Card>
      <CardContent>
        <Accordion type="single" value={tab} onValueChange={setTab}>
          <AccordionItem value="rates">
            <AccordionTrigger>Rates details</AccordionTrigger>
            <AccordionContent>Rates information</AccordionContent>
          </AccordionItem>
          <AccordionItem value="misc-charges">
            <AccordionTrigger>Miscellaneous charges</AccordionTrigger>
            <AccordionContent>
              Miscellaneous charges information
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default RatesAndChargesTab;

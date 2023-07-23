import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import { TaxesStage } from "./taxes-stage";
import { PaymentsStage } from "./payments-stage";

export interface TaxesAndPaymentsTabProps {
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

  selectedTaxes: number[];
  onSelectedTaxes: (taxesIds: number[]) => void;

  isEdit: boolean;
  onCompleted: () => void;
  currency: string | undefined;
}

const TaxesAndPaymentsTab = (props: TaxesAndPaymentsTabProps) => {
  const {
    durationStageData,
    selectedTaxes,
    onSelectedTaxes,
    isEdit,
    onCompleted,
    currency,
  } = props;

  const [tab, setTab] = React.useState("taxes");

  return (
    <Card>
      <CardContent>
        <Accordion type="single" value={tab} onValueChange={setTab}>
          <AccordionItem value="taxes">
            <AccordionTrigger>Taxes</AccordionTrigger>
            <AccordionContent>
              <TaxesStage
                durationStageData={durationStageData}
                taxes={selectedTaxes}
                onSelectedTaxes={onSelectedTaxes}
                isEdit={isEdit}
                onCompleted={() => {
                  setTab("payments");
                }}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="payments">
            <AccordionTrigger>Payments</AccordionTrigger>
            <AccordionContent>
              <PaymentsStage />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default TaxesAndPaymentsTab;

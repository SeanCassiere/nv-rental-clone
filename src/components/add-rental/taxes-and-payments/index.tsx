import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import { PaymentsStage } from "./payments-stage";
import { TaxesStage } from "./taxes-stage";

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
}

const TaxesAndPaymentsTab = (props: TaxesAndPaymentsTabProps) => {
  const {
    durationStageData,
    selectedTaxes,
    onSelectedTaxes,
    isEdit,
    onCompleted,
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

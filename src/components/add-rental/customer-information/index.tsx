import React from "react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import { CustomerStage, type CustomerStageProps } from "./customer-stage";

export interface CustomerInformationTabProps {
  customerStageData: CustomerStageProps["customerInformation"];
  onCustomerStageComplete: CustomerStageProps["onCompleted"];

  isEdit: boolean;
  onCompleted: () => void;
}

const CustomerInformationTab = (props: CustomerInformationTabProps) => {
  const { customerStageData, onCustomerStageComplete, isEdit, onCompleted } =
    props;

  const [tab, setTab] = React.useState("customer");

  return (
    <Card>
      <CardContent>
        <Accordion type="single" value={tab} onValueChange={setTab}>
          <AccordionItem value="customer">
            <AccordionTrigger>Customer details</AccordionTrigger>
            <AccordionContent>
              <CustomerStage
                customerInformation={customerStageData}
                onCompleted={(data) => {
                  onCustomerStageComplete(data);
                  onCompleted();
                }}
                isEdit={isEdit}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  );
};

export default CustomerInformationTab;

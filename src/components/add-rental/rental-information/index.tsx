import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { DurationStage } from "./duration-stage";
import { VehicleStage } from "./vehicle-stage";
import { CustomerStage } from "./customer-stage";

interface RentalInformationTabProps {
  onDurationStageComplete: () => void;
  onVehicleStageComplete: () => void;
  onCustomerStageComplete: () => void;
}

const RentalInformationTab = (props: RentalInformationTabProps) => {
  const {} = props;

  const [tab, setTab] = React.useState("rental");

  return (
    <Accordion type="single" value={tab} onValueChange={setTab}>
      <AccordionItem value="rental">
        <AccordionTrigger>Rental information</AccordionTrigger>
        <AccordionContent>
          <DurationStage />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="vehicle">
        <AccordionTrigger>Vehicle information</AccordionTrigger>
        <AccordionContent>
          <VehicleStage />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="customer">
        <AccordionTrigger>Customer information</AccordionTrigger>
        <AccordionContent>
          <CustomerStage />
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default RentalInformationTab;

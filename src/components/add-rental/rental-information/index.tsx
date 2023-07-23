import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { DurationStage, type DurationStageProps } from "./duration-stage";
import { VehicleStage, type VehicleStageProps } from "./vehicle-stage";
import { CustomerStage } from "./customer-stage";

interface RentalInformationTabProps {
  durationStageData: DurationStageProps["initialData"];
  onDurationStageComplete: DurationStageProps["onCompleted"];

  vehicleStageData: VehicleStageProps["vehicleInformation"];
  onVehicleStageComplete: VehicleStageProps["onCompleted"];

  onCustomerStageComplete: () => void;

  isEdit: boolean;
  onCompleted: () => void;
}

const RentalInformationTab = (props: RentalInformationTabProps) => {
  const {
    durationStageData,
    vehicleStageData,
    onDurationStageComplete,
    onVehicleStageComplete,
    isEdit,
  } = props;

  const [tab, setTab] = React.useState("duration");

  return (
    <Accordion type="single" value={tab} onValueChange={setTab}>
      <AccordionItem value="duration">
        <AccordionTrigger>Duration information</AccordionTrigger>
        <AccordionContent>
          <DurationStage
            initialData={durationStageData}
            onCompleted={(data) => {
              onDurationStageComplete(data);
              setTab("vehicle");
            }}
            isEdit={isEdit}
          />
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="vehicle">
        <AccordionTrigger>Vehicle information</AccordionTrigger>
        <AccordionContent>
          <VehicleStage
            rentalInformation={durationStageData}
            vehicleInformation={vehicleStageData}
            onCompleted={(data) => {
              onVehicleStageComplete(data);
              setTab("customer");
            }}
            isEdit={isEdit}
          />
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

import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";

import { DurationStage, type DurationStageProps } from "./duration-stage";
import { VehicleStage, type VehicleStageProps } from "./vehicle-stage";
import { CustomerStage, type CustomerStageProps } from "./customer-stage";

interface RentalInformationTabProps {
  durationStageData: DurationStageProps["initialData"];
  onDurationStageComplete: DurationStageProps["onCompleted"];

  vehicleStageData: VehicleStageProps["vehicleInformation"];
  onVehicleStageComplete: VehicleStageProps["onCompleted"];

  customerStageData: CustomerStageProps["customerInformation"];
  onCustomerStageComplete: CustomerStageProps["onCompleted"];

  isEdit: boolean;
  onCompleted: () => void;
}

const RentalInformationTab = (props: RentalInformationTabProps) => {
  const {
    durationStageData,
    onDurationStageComplete,
    vehicleStageData,
    onVehicleStageComplete,
    customerStageData,
    onCustomerStageComplete,
    isEdit,
    onCompleted,
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
  );
};

export default RentalInformationTab;

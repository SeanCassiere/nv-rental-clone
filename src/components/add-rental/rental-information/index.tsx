import React from "react";

import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";

import { DurationStage, type DurationStageProps } from "./duration-stage";
import { VehicleStage, type VehicleStageProps } from "./vehicle-stage";

export interface RentalInformationTabProps {
  durationStageData: DurationStageProps["initialData"];
  onDurationStageComplete: DurationStageProps["onCompleted"];

  vehicleStageData: VehicleStageProps["vehicleInformation"];
  onVehicleStageComplete: VehicleStageProps["onCompleted"];

  isEdit: boolean;
  onCompleted: () => void;
}

const RentalInformationTab = (props: RentalInformationTabProps) => {
  const {
    durationStageData,
    onDurationStageComplete,
    vehicleStageData,
    onVehicleStageComplete,
    isEdit,
    onCompleted,
  } = props;

  const [tab, setTab] = React.useState("duration");

  return (
    <Card>
      <CardContent>
        <Accordion type="single" value={tab} onValueChange={setTab}>
          <AccordionItem value="duration">
            <AccordionTrigger>Duration details</AccordionTrigger>
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
            <AccordionTrigger>Vehicle details</AccordionTrigger>
            <AccordionContent>
              <VehicleStage
                rentalInformation={durationStageData}
                vehicleInformation={vehicleStageData}
                onCompleted={(data) => {
                  onVehicleStageComplete(data);
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

export default RentalInformationTab;

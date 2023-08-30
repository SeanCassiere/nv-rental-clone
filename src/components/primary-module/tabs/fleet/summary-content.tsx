import { useMemo, useState, type ReactNode } from "react";

import CustomerInformation from "@/components/primary-module/information-block/customer-information";
import FleetInformation from "@/components/primary-module/information-block/fleet-information";
import { VehicleSummary } from "@/components/primary-module/summary/vehicle";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useGetVehicleData } from "@/hooks/network/vehicle/useGetVehicleData";
import { useGetVehicleSummary } from "@/hooks/network/vehicle/useGetVehicleSummary";

type FleetSummaryTabProps = {
  vehicleId: string;
};

const FleetSummaryTab = (props: FleetSummaryTabProps) => {
  const vehicleData = useGetVehicleData({
    vehicleId: props.vehicleId,
  });
  const vehicle =
    vehicleData.data?.status === 200 ? vehicleData.data.body : null;

  const vehicleSummary = useGetVehicleSummary({ vehicleId: props.vehicleId });
  const summaryData =
    vehicleSummary.data?.status === 200 ? vehicleSummary.data.body : undefined;

  const agreementData = useGetAgreementData({
    agreementId: summaryData?.currentAgreement || "0",
  });
  const agreement =
    agreementData.data?.status === 200 ? agreementData.data.body : null;

  const [currentTab, setCurrentTab] = useState("general");

  const tabsConfig = useMemo(() => {
    const tabs: { id: string; label: string; component: ReactNode }[] = [];

    tabs.push({
      id: "general",
      label: "General",
      component: (
        <FleetInformation
          mode="vehicle"
          isLoading={vehicleData.isLoading}
          data={
            vehicle
              ? {
                  doors: vehicle.vehicle?.doors,
                  batteryLevel: vehicle.vehicle?.batteryLevel,
                  cylinders: vehicle.vehicle?.cylinders,
                  fuelLevel: vehicle.vehicle?.fuelLevel,
                  trim: vehicle.vehicle?.trim,
                  spotNo: vehicle.vehicle?.spotNumber,
                  tankSize: vehicle.vehicle?.tankSize,
                  fuelType: vehicle.vehicle?.fuelType,
                  transmission: vehicle.vehicle?.transmission,
                  originalOdometer: vehicle.vehicle?.origionalOdometer,
                  vin: vehicle.vehicle?.vin,
                }
              : {}
          }
        />
      ),
    });
    tabs.push({ id: "ownership", label: "Ownership", component: "Ownership" });
    tabs.push({
      id: "license-and-insurance",
      label: "License & insurance",
      component: "License & Insurance",
    });
    tabs.push({ id: "reminders", label: "Reminders", component: "Reminders" });
    tabs.push({
      id: "other-information",
      label: "Other information",
      component: "Other information",
    });

    return tabs;
  }, [vehicle, vehicleData.isLoading]);

  const canViewCurrentCustomerInformation = true;

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-8">
        {canViewCurrentCustomerInformation && (
          <CustomerInformation
            mode="vehicle"
            data={{
              customerId: agreement?.customerDetails?.customerId,
              firstName: agreement?.customerDetails?.firstName,
              middleName: agreement?.customerDetails?.middleName,
              lastName: agreement?.customerDetails?.lastName,
              email: agreement?.customerEmail,
              dateOfBirth: agreement?.customerDetails?.dateOfbirth,
              mobileNumber: agreement?.customerDetails?.cPhone,
              homeNumber: agreement?.customerDetails?.hPhone,
              driverLicenseNumber: agreement?.customerDetails?.licenseNumber,
              creditCardType: agreement?.customerDetails?.creditCardType,
              creditCardNumber: agreement?.customerDetails?.creditCardNo,
              creditCardExpirationDate:
                agreement?.customerDetails?.creditCardExpiryDate,
              creditCardSecurityCode:
                agreement?.customerDetails?.creditCardCVSNo,
              checkoutDate: agreement?.checkoutDate,
              checkinDate: agreement?.checkinDate,
            }}
            isLoading={vehicleData.isLoading}
          />
        )}

        <Tabs value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="w-full sm:max-w-max">
            {tabsConfig.map((tab, idx) => (
              <TabsTrigger key={`tab-summary-trigger-${idx}`} value={tab.id}>
                {tab.label}
              </TabsTrigger>
            ))}
          </TabsList>
          {tabsConfig.map((tab, idx) => (
            <TabsContent
              key={`tab-summary-content-${idx}`}
              value={tab.id}
              className="min-h-[180px]"
            >
              {tab.component}
            </TabsContent>
          ))}
        </Tabs>
      </div>

      <div className="flex flex-col gap-4 lg:col-span-4">
        <VehicleSummary
          vehicleId={props.vehicleId}
          summaryData={summaryData}
          vehicleNo={vehicle?.vehicle.vehicleNo || undefined}
        />
      </div>
    </div>
  );
};

export default FleetSummaryTab;

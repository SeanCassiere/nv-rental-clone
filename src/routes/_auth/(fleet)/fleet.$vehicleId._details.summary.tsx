import * as React from "react";
import { useQuery, useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute } from "@tanstack/react-router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { fetchAgreementByIdOptions } from "@/lib/query/agreement";

import CustomerInformation from "@/routes/_auth/-modules/information-block/customer-information";
import VehicleInformation from "@/routes/_auth/-modules/information-block/vehicle-information";
import { VehicleSummary } from "@/routes/_auth/-modules/summary/vehicle";
import { Container } from "@/routes/-components/container";

export const Route = createFileRoute(
  "/_auth/(fleet)/fleet/$vehicleId/_details/summary"
)({
  component: Component,
});

function Component() {
  const { authParams, viewVehicleOptions, viewVehicleSummaryOptions } =
    Route.useRouteContext();
  const { vehicleId } = Route.useParams();

  const vehicleData = useSuspenseQuery(viewVehicleOptions);
  const vehicle =
    vehicleData.data?.status === 200 ? vehicleData.data.body : null;

  const vehicleSummary = useSuspenseQuery(viewVehicleSummaryOptions);
  const summaryData =
    vehicleSummary.data?.status === 200 ? vehicleSummary.data.body : undefined;

  const agreementData = useQuery(
    fetchAgreementByIdOptions({
      auth: authParams,
      agreementId: summaryData?.currentAgreement || "0",
    })
  );
  const agreement =
    agreementData.data?.status === 200 ? agreementData.data.body : null;

  const [currentTab, setCurrentTab] = React.useState("general");

  const tabsConfig = React.useMemo(() => {
    const tabs: { id: string; label: string; component: React.ReactNode }[] =
      [];

    tabs.push({
      id: "general",
      label: "General",
      component: (
        <VehicleInformation
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
    <Container as="div">
      <div className="mb-6 grid max-w-full grid-cols-1 gap-4 px-2 sm:px-4 lg:grid-cols-12">
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
            vehicleId={vehicleId}
            summaryData={summaryData}
            vehicleNo={vehicle?.vehicle.vehicleNo || undefined}
          />
        </div>
      </div>
    </Container>
  );
}

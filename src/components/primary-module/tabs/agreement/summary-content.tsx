import { useMemo, useState, type ReactNode } from "react";

import CustomerInformation from "@/components/primary-module/information-block/customer-information";
import FleetInformation from "@/components/primary-module/information-block/fleet-information";
import RentalInformation from "@/components/primary-module/information-block/rental-information";
import { RentalSummary } from "@/components/primary-module/summary/rental-summary";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";

type AgreementSummaryTabProps = {
  agreementId: string;
};

const AgreementSummaryTab = (props: AgreementSummaryTabProps) => {
  const canViewCustomerInformation = true;
  const canViewRentalInformation = true;

  const [currentTab, setCurrentTab] = useState("vehicle");

  const agreementQuery = useGetAgreementData({
    agreementId: props.agreementId,
  });
  const agreement =
    agreementQuery.data?.status === 200 ? agreementQuery.data.body : null;

  const isCheckedIn = agreement?.returnDate ? true : false;

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "agreements",
    referenceId: props.agreementId,
  });

  const tabsConfig = useMemo(() => {
    const tabs: { id: string; label: string; component: ReactNode }[] = [];

    tabs.push({
      id: "vehicle",
      label: "Vehicle",
      component: (
        <FleetInformation
          mode={isCheckedIn ? "agreement-checked-in" : "agreement-checked-out"}
          isLoading={agreementQuery.isLoading}
          data={
            agreement
              ? {
                  vehicleId: agreement?.vehicleId,
                  vehicleNo: agreement?.vehicleNo,
                  vehicleType: agreement?.vehicleType,
                  licenseNo: agreement?.licenseNo,
                  make: agreement?.vehicleMakeName,
                  model: agreement?.modelName,
                  year: agreement?.year,
                  fuelLevelOut: agreement?.fuelLevelOut,
                  fuelLevelIn: agreement?.fuelLevelIn,
                  odometerOut: agreement?.odometerOut,
                  odometerIn: agreement?.odometerIn,
                }
              : {}
          }
        />
      ),
    });

    if (canViewRentalInformation) {
      tabs.push({
        id: "rental",
        label: "Rental & rates",
        component: (
          <RentalInformation
            mode="agreement"
            data={
              agreement?.rateList && agreement?.rateList[0]
                ? {
                    totalDays: agreement?.totalDays,
                    rateName: agreement?.rateList[0]?.rateName,
                    dailyMilesAllowed:
                      agreement?.rateList[0]?.displaydailyMilesAllowed,
                    weeklyMilesAllowed:
                      agreement?.rateList[0]?.displayweeklyMilesAllowed,
                    monthlyMilesAllowed:
                      agreement?.rateList[0]?.displaymonthlyMilesAllowed,
                    hourlyRate: agreement?.rateList[0]?.hourlyRate,
                    halfHourlyRate: agreement?.rateList[0]?.halfHourlyRate,
                    dailyRate: agreement?.rateList[0]?.dailyRate,
                    halfDayRate: agreement?.rateList[0]?.halfDayRate,
                    weeklyRate: agreement?.rateList[0]?.weeklyRate,
                    weekendRate: agreement?.rateList[0]?.weekendDayRate,
                    monthlyRate: agreement?.rateList[0]?.monthlyRate,
                    destination: agreement?.destination,
                  }
                : {}
            }
            isLoading={agreementQuery.isLoading}
          />
        ),
      });
    }

    return tabs;
  }, [
    agreement,
    agreementQuery.isLoading,
    canViewRentalInformation,
    isCheckedIn,
  ]);

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-8">
        {canViewCustomerInformation && (
          <CustomerInformation
            mode="agreement"
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
            isLoading={agreementQuery.isLoading}
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
        <RentalSummary
          module="agreements"
          summaryData={rentalRatesSummary.data}
        />
      </div>
    </div>
  );
};

export default AgreementSummaryTab;

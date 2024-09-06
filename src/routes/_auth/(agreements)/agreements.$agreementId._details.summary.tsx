import * as React from "react";
import { useSuspenseQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { z } from "zod";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { useFeature } from "@/lib/hooks/useFeature";

import { getDigSigDriversListOptions } from "@/lib/query/digitalSignature";

import CustomerInformation from "@/routes/_auth/-modules/information-block/customer-information";
import RentalInformation from "@/routes/_auth/-modules/information-block/rental-information";
import VehicleInformation from "@/routes/_auth/-modules/information-block/vehicle-information";
import { RentalSummary } from "@/routes/_auth/-modules/summary/rental-summary";
import { Container } from "@/routes/-components/container";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/_details/summary"
)({
  component: Component,
  validateSearch: z.object({
    summary_tab: z.string().optional(),
  }),
  beforeLoad: ({ context, params }) => {
    const { authParams } = context;
    return {
      digitalSignatureDriversOptions: getDigSigDriversListOptions({
        auth: authParams,
        agreementId: params.agreementId,
      }),
    };
  },
  loader: async ({ context }) => {
    const { queryClient, digitalSignatureDriversOptions } = context;
    await queryClient.prefetchQuery(digitalSignatureDriversOptions);
  },
});
const SummarySignatureCard = React.lazy(
  () => import("@/routes/_auth/(agreements)/-components/summary-signature-card")
);

function Component() {
  const currentTab = Route.useSearch({
    select: (s) => {
      if (s.summary_tab && ["vehicle", "rental"].includes(s.summary_tab)) {
        return s.summary_tab;
      }
      return "vehicle";
    },
  });
  const {
    viewAgreementOptions,
    viewAgreementSummaryOptions,
    digitalSignatureDriversOptions,
    authParams: auth,
  } = Route.useRouteContext();

  const canViewCustomerInformation = true;
  const canViewRentalInformation = true;

  const [_, canViewDigitalSignaturePad] = useFeature(
    "DIGITAL_SIGNATURE_PAD",
    null
  );

  const agreementQuery = useSuspenseQuery(viewAgreementOptions);
  const agreement =
    agreementQuery.data?.status === 200 ? agreementQuery.data.body : null;
  const isCheckedIn = agreement?.returnDate ? true : false;

  const summaryQuery = useSuspenseQuery(viewAgreementSummaryOptions);
  const summaryData =
    summaryQuery.data?.status === 200 ? summaryQuery.data?.body : undefined;

  const signatureDriverListQuery = useSuspenseQuery(
    digitalSignatureDriversOptions
  );
  const signatureDriverList =
    signatureDriverListQuery.data?.status === 200
      ? signatureDriverListQuery.data.body
      : [];

  const tabsConfig = React.useMemo(() => {
    const tabs: { id: string; label: string; component: React.ReactNode }[] =
      [];

    tabs.push({
      id: "vehicle",
      label: "Vehicle",
      component: (
        <VehicleInformation
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
    <Container as="div">
      <div className="mb-6 grid max-w-full grid-cols-1 gap-4 px-2 sm:px-4 lg:grid-cols-12">
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

          {tabsConfig.length >= 1 ? (
            <Tabs defaultValue={currentTab} key={`tab-${currentTab}`}>
              <TabsList className="w-full sm:max-w-max">
                {tabsConfig.map((tab, idx) => (
                  <TabsTrigger
                    key={`tab-summary-trigger-${idx}`}
                    value={tab.id}
                    asChild
                  >
                    <Link
                      from="/agreements/$agreementId/summary"
                      search={(s) => ({ ...s, summary_tab: tab.id })}
                      resetScroll={false}
                    >
                      {tab.label}
                    </Link>
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
          ) : null}
        </div>

        <div className="flex flex-col gap-4 lg:col-span-4">
          <RentalSummary module="agreements" summaryData={summaryData} />
          <React.Suspense fallback={null}>
            {canViewDigitalSignaturePad && agreement ? (
              <SummarySignatureCard
                auth={auth}
                isCheckin={isCheckedIn}
                agreement={agreement}
                drivers={signatureDriverList}
              />
            ) : null}
          </React.Suspense>
        </div>
      </div>
    </Container>
  );
}

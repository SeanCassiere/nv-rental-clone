import { useQuery } from "@tanstack/react-query";
import { useAuth } from "react-oidc-context";

import CustomerInformation from "@/components/primary-module/information-block/customer-information";
import RentalInformation from "@/components/primary-module/information-block/rental-information";
import VehicleInformation from "@/components/primary-module/information-block/vehicle-information";
import { RentalSummary } from "@/components/primary-module/summary/rental-summary";

import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";

import { getAuthFromAuthHook } from "@/utils/auth";
import { fetchReservationByIdOptions } from "@/utils/query/reservation";

type ReservationSummaryTabProps = {
  reservationId: string;
};

const ReservationSummaryTab = (props: ReservationSummaryTabProps) => {
  const auth = useAuth();
  const authParams = getAuthFromAuthHook(auth);

  const reservationData = useQuery(
    fetchReservationByIdOptions({
      auth: authParams,
      reservationId: props.reservationId,
    })
  );
  const reservation =
    reservationData.data?.status === 200 ? reservationData.data?.body : null;

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "reservations",
    referenceId: props.reservationId,
  });

  const summaryData =
    rentalRatesSummary.data?.status === 200
      ? rentalRatesSummary.data?.body
      : undefined;

  const canViewCustomerInformation = true;
  const canViewRentalInformation = true;
  const canViewVehicleInformation = true;

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-8">
        {canViewCustomerInformation && (
          <CustomerInformation
            mode="reservation"
            data={{
              customerId: reservation?.customerDetails?.customerId,
              firstName: reservation?.customerDetails?.firstName,
              middleName: reservation?.customerDetails?.middleName,
              lastName: reservation?.customerDetails?.lastName,
              email: reservation?.customerDetails?.email,
              dateOfBirth: reservation?.customerDetails?.dateOfbirth,
              mobileNumber: reservation?.customerDetails?.cPhone,
              homeNumber: reservation?.customerDetails?.hPhone,
              driverLicenseNumber: reservation?.customerDetails?.licenseNumber,
              creditCardType: reservation?.customerDetails?.creditCardType,
              creditCardNumber: reservation?.customerDetails?.creditCardNo,
              creditCardExpirationDate:
                reservation?.customerDetails?.creditCardExpiryDate,
              creditCardSecurityCode:
                reservation?.customerDetails?.creditCardCVSNo,
            }}
            isLoading={reservationData.isLoading}
          />
        )}
        {canViewVehicleInformation && (
          <VehicleInformation
            mode="reservation"
            data={{
              vehicleId: reservation?.reservationview?.vehicleId,
              vehicleNo: reservation?.reservationview?.vehicleNo,
              vehicleType: reservation?.reservationview?.vehicleType,
              licenseNo: reservation?.reservationview?.licenseNo,
              make: reservation?.reservationview?.vehicleMakeName,
              model: reservation?.reservationview?.modelName,
              year: reservation?.reservationview?.year,
            }}
            isLoading={reservationData.isLoading}
          />
        )}
        {canViewRentalInformation && (
          <RentalInformation
            mode="reservation"
            data={
              reservation?.rateList && reservation?.rateList[0]
                ? {
                    totalDays: reservation?.reservationview?.totalDays,
                    rateName: reservation?.rateList[0]?.rateName,
                    dailyMilesAllowed:
                      reservation?.rateList[0]?.displaydailyMilesAllowed,
                    weeklyMilesAllowed:
                      reservation?.rateList[0]?.displayweeklyMilesAllowed,
                    monthlyMilesAllowed:
                      reservation?.rateList[0]?.displaymonthlyMilesAllowed,
                    hourlyRate: reservation?.rateList[0]?.hourlyRate,
                    halfHourlyRate: reservation?.rateList[0]?.halfHourlyRate,
                    dailyRate: reservation?.rateList[0]?.dailyRate,
                    halfDayRate: reservation?.rateList[0]?.halfDayRate,
                    weeklyRate: reservation?.rateList[0]?.weeklyRate,
                    weekendRate: reservation?.rateList[0]?.weekendDayRate,
                    monthlyRate: reservation?.rateList[0]?.monthlyRate,
                    destination: reservation?.reservationview?.destination,
                  }
                : {}
            }
            isLoading={reservationData.isLoading}
          />
        )}
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 lg:col-span-4">
        <RentalSummary module="reservations" summaryData={summaryData} />
      </div>
    </div>
  );
};

export default ReservationSummaryTab;

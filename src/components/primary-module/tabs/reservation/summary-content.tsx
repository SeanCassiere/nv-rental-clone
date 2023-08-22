import { RentalSummary } from "@/components/primary-module/summary/rental-summary";

import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";
import { useGetReservationData } from "@/hooks/network/reservation/useGetReservationData";

import CustomerInformation from "../../information-block/customer-information";
import FleetInformation from "../../information-block/fleet-information";
import RentalInformation from "../../information-block/rental-information";

type ReservationSummaryTabProps = {
  reservationId: string;
};

const ReservationSummaryTab = (props: ReservationSummaryTabProps) => {
  const reservationData = useGetReservationData({
    reservationId: props.reservationId,
  });
  const reservation =
    reservationData.data?.status === 200 ? reservationData.data?.body : null;

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "reservations",
    referenceId: props.reservationId,
  });

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
          <FleetInformation
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
        <RentalSummary
          module="reservations"
          summaryData={rentalRatesSummary.data}
        />
      </div>
    </div>
  );
};

export default ReservationSummaryTab;

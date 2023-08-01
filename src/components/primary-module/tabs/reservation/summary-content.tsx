import CustomerInformation from "../../information-block/customer-information";
import RentalInformation from "../../information-block/rental-information";
import FleetInformation from "../../information-block/fleet-information";

import { RentalSummary } from "@/components/primary-module/summary/rental-summary";

import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";
import { useGetReservationData } from "@/hooks/network/reservation/useGetReservationData";

type ReservationSummaryTabProps = {
  reservationId: string;
};

const ReservationSummaryTab = (props: ReservationSummaryTabProps) => {
  const reservationData = useGetReservationData({
    reservationId: props.reservationId,
  });

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
              customerId: reservationData.data?.customerDetails?.customerId,
              firstName: reservationData.data?.customerDetails?.firstName,
              middleName: reservationData.data?.customerDetails?.middleName,
              lastName: reservationData.data?.customerDetails?.lastName,
              email: reservationData.data?.customerDetails?.email,
              dateOfBirth: reservationData.data?.customerDetails?.dateOfbirth,
              mobileNumber: reservationData.data?.customerDetails?.cPhone,
              homeNumber: reservationData.data?.customerDetails?.hPhone,
              driverLicenseNumber:
                reservationData.data?.customerDetails?.licenseNumber,
              creditCardType:
                reservationData.data?.customerDetails?.creditCardType,
              creditCardNumber:
                reservationData.data?.customerDetails?.creditCardNo,
              creditCardExpirationDate:
                reservationData.data?.customerDetails?.creditCardExpiryDate,
              creditCardSecurityCode:
                reservationData.data?.customerDetails?.creditCardCVSNo,
            }}
            isLoading={reservationData.isLoading}
          />
        )}
        {canViewVehicleInformation && (
          <FleetInformation
            mode="reservation"
            data={{
              vehicleId: reservationData.data?.reservationview?.vehicleId,
              vehicleNo: reservationData.data?.reservationview?.vehicleNo,
              vehicleType: reservationData.data?.reservationview?.vehicleType,
              licenseNo: reservationData.data?.reservationview?.licenseNo,
              make: reservationData.data?.reservationview?.vehicleMakeName,
              model: reservationData.data?.reservationview?.modelName,
              year: reservationData.data?.reservationview?.year,
            }}
            isLoading={reservationData.isLoading}
          />
        )}
        {canViewRentalInformation && (
          <RentalInformation
            mode="reservation"
            data={
              reservationData.data?.rateList &&
              reservationData.data?.rateList[0]
                ? {
                    totalDays: reservationData.data?.reservationview?.totalDays,
                    rateName: reservationData.data?.rateList[0]?.rateName,
                    dailyMilesAllowed:
                      reservationData.data?.rateList[0]
                        ?.displaydailyMilesAllowed,
                    weeklyMilesAllowed:
                      reservationData.data?.rateList[0]
                        ?.displayweeklyMilesAllowed,
                    monthlyMilesAllowed:
                      reservationData.data?.rateList[0]
                        ?.displaymonthlyMilesAllowed,
                    hourlyRate: reservationData.data?.rateList[0]?.hourlyRate,
                    halfHourlyRate:
                      reservationData.data?.rateList[0]?.halfHourlyRate,
                    dailyRate: reservationData.data?.rateList[0]?.dailyRate,
                    halfDayRate: reservationData.data?.rateList[0]?.halfDayRate,
                    weeklyRate: reservationData.data?.rateList[0]?.weeklyRate,
                    weekendRate:
                      reservationData.data?.rateList[0]?.weekendDayRate,
                    monthlyRate: reservationData.data?.rateList[0]?.monthlyRate,
                    destination:
                      reservationData.data?.reservationview?.destination,
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

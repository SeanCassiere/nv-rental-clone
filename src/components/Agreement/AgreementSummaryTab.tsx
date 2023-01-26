import CustomerInformation from "../PrimaryModule/ModuleInformation/CustomerInformation";
import RentalInformation from "../PrimaryModule/ModuleInformation/RentalInformation";
import { RentalRatesSummary } from "../PrimaryModule/ModuleSummary/RentalRatesSummary";

import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetModuleRentalRatesSummary } from "../../hooks/network/module/useGetModuleRentalRatesSummary";
import VehicleInformation from "../PrimaryModule/ModuleInformation/VehicleInformation";

type AgreementSummaryTabProps = {
  agreementId: string;
};

const AgreementSummaryTab = (props: AgreementSummaryTabProps) => {
  const agreementData = useGetAgreementData({
    agreementId: props.agreementId,
  });

  const isCheckedIn = agreementData.data?.returnDate ? true : false;

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "agreements",
    referenceId: props.agreementId,
  });

  const clientProfile = useGetClientProfile();

  const canViewCustomerInformation = true;
  const canViewRentalInformation = true;
  const canViewVehicleInformation = true;

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 lg:grid-cols-12">
      <div className="flex flex-col gap-4 lg:col-span-7">
        {canViewCustomerInformation && (
          <CustomerInformation
            mode="agreement"
            data={{
              customerId: agreementData.data?.customerDetails?.customerId,
              firstName: agreementData.data?.customerDetails?.firstName,
              middleName: agreementData.data?.customerDetails?.middleName,
              lastName: agreementData.data?.customerDetails?.lastName,
              email: agreementData.data?.customerEmail,
              dateOfBirth: agreementData.data?.customerDetails?.dateOfbirth,
              mobileNumber: agreementData.data?.customerDetails?.cPhone,
              homeNumber: agreementData.data?.customerDetails?.hPhone,
              driverLicenseNumber:
                agreementData.data?.customerDetails?.licenseNumber,
              creditCardType:
                agreementData.data?.customerDetails?.creditCardType,
              creditCardNumber:
                agreementData.data?.customerDetails?.creditCardNo,
              creditCardExpirationDate:
                agreementData.data?.customerDetails?.creditCardExpiryDate,
              creditCardSecurityCode:
                agreementData.data?.customerDetails?.creditCardCVSNo,
              checkoutDate: agreementData.data?.checkoutDate,
              checkinDate: agreementData.data?.checkinDate,
            }}
            isLoading={agreementData.isLoading}
          />
        )}
        {canViewVehicleInformation && (
          <VehicleInformation
            mode={
              isCheckedIn ? "agreement-checked-in" : "agreement-checked-out"
            }
            isLoading={agreementData.isLoading}
            data={
              agreementData.data
                ? {
                    vehicleId: agreementData.data?.vehicleId,
                    vehicleNo: agreementData.data?.vehicleNo,
                    vehicleType: agreementData.data?.vehicleType,
                    licenseNo: agreementData.data?.licenseNo,
                    make: agreementData.data?.vehicleMakeName,
                    model: agreementData.data?.modelName,
                    year: agreementData.data?.year,
                    fuelLevelOut: agreementData.data?.fuelLevelOut,
                    fuelLevelIn: agreementData.data?.fuelLevelIn,
                    odometerOut: agreementData.data?.odometerOut,
                    odometerIn: agreementData.data?.odometerIn,
                  }
                : {}
            }
          />
        )}
        {canViewRentalInformation && (
          <RentalInformation
            mode="agreement"
            data={
              agreementData.data?.rateList && agreementData.data?.rateList[0]
                ? {
                    totalDays: agreementData.data?.totalDays,
                    rateName: agreementData.data?.rateList[0]?.rateName,
                    dailyMilesAllowed:
                      agreementData.data?.rateList[0]?.displaydailyMilesAllowed,
                    weeklyMilesAllowed:
                      agreementData.data?.rateList[0]
                        ?.displayweeklyMilesAllowed,
                    monthlyMilesAllowed:
                      agreementData.data?.rateList[0]
                        ?.displaymonthlyMilesAllowed,
                    hourlyRate: agreementData.data?.rateList[0]?.hourlyRate,
                    halfHourlyRate:
                      agreementData.data?.rateList[0]?.halfHourlyRate,
                    dailyRate: agreementData.data?.rateList[0]?.dailyRate,
                    halfDayRate: agreementData.data?.rateList[0]?.halfDayRate,
                    weeklyRate: agreementData.data?.rateList[0]?.weeklyRate,
                    weekendRate:
                      agreementData.data?.rateList[0]?.weekendDayRate,
                    monthlyRate: agreementData.data?.rateList[0]?.monthlyRate,
                    destination: agreementData.data?.destination,
                  }
                : {}
            }
            isLoading={agreementData.isLoading || clientProfile.isLoading}
            currency={clientProfile.data?.currency || undefined}
          />
        )}
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 lg:col-span-5">
        <RentalRatesSummary
          module="agreements"
          summaryData={rentalRatesSummary.data}
          currency={clientProfile.data?.currency || undefined}
        />
      </div>
    </div>
  );
};

export default AgreementSummaryTab;

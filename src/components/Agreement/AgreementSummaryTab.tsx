import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetModuleRentalRatesSummary } from "../../hooks/network/module/useGetModuleRentalRatesSummary";
import { sortObject } from "../../utils/sortObject";
import CustomerInformation from "../PrimaryModule/ModuleInformation/CustomerInformation";
import RentalInformation from "../PrimaryModule/ModuleInformation/RentalInformation";
import { RentalRatesSummary } from "../PrimaryModule/ModuleSummary/RentalRatesSummary";

type AgreementSummaryTabProps = {
  agreementId: string;
};

const AgreementSummaryTab = (props: AgreementSummaryTabProps) => {
  const agreementData = useGetAgreementData({
    agreementId: props.agreementId,
  });

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "agreements",
    referenceId: props.agreementId,
  });

  const clientProfile = useGetClientProfile();

  const canViewCustomerInformation = true;
  const canViewRentalInformation = true;

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 focus:ring-0 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-7">
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
            }}
            isLoading={agreementData.isLoading}
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
        <div className="max-h-[500px] overflow-x-scroll bg-slate-50">
          <h2>Agreement data</h2>
          <code className="text-xs">
            <pre>{JSON.stringify(sortObject(agreementData.data), null, 2)}</pre>
          </code>
        </div>
      </div>
      {/*  */}
      <div className="flex flex-col gap-4 md:col-span-5">
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

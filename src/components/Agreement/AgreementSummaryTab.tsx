import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import { useGetClientProfile } from "../../hooks/network/client/useGetClientProfile";
import { useGetModuleRentalRatesSummary } from "../../hooks/network/module/useGetModuleRentalRatesSummary";
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

  return (
    <div className="grid max-w-full grid-cols-1 gap-4 md:grid-cols-12">
      <div className="flex flex-col gap-4 md:col-span-7">
        <div className="overflow-x-scroll bg-white">
          <h2>Agreement data</h2>
          <code className="text-xs">
            <pre>{JSON.stringify(agreementData.data, null, 2)}</pre>
          </code>
        </div>
        <div className="bg-white">Agreement block 1</div>
        <div className="bg-white">Agreement block 2</div>
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

import { useCallback } from "react";
import { useNavigate, useParams, useRouter, useSearch } from "@tanstack/router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { viewAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { checkinAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";
import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";

import { titleMaker } from "@/utils/title-maker";

const CheckinAgreementPage = () => {
  const navigate = useNavigate({ from: checkinAgreementByIdRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: checkinAgreementByIdRoute.id,
  });
  const { agreementId } = useParams({ from: checkinAgreementByIdRoute.id });

  const handleFindError = () => router.history.go(-1);

  const summaryData = useGetAgreementData({
    agreementId,
    onError: handleFindError,
  });

  const rentalRatesSummary = useGetModuleRentalRatesSummary({
    module: "agreements",
    referenceId: agreementId,
  });

  const handleStageTabClick = useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
        params: { agreementId },
      });
    },
    [agreementId, navigate]
  );

  const handleAgreementSaveComplete = useCallback(() => {
    navigate({
      to: viewAgreementByIdRoute.to,
      params: { agreementId },
      search: () => ({ tab: "summary" }),
    });
  }, [agreementId, navigate]);

  const handleCancelEditAgreement = useCallback(() => {
    router.navigate({
      to: "../",
    });
  }, [router]);

  useDocumentTitle(
    titleMaker(
      `Check-in - ${summaryData.data?.agreementNumber || "Loading"} - Agreement`
    )
  );
  return (
    <ProtectorShield>
      <AddRentalParentForm
        referenceId={parseInt(agreementId)}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleAgreementSaveComplete}
        onRentalCancelClick={handleCancelEditAgreement}
        referenceNumber={summaryData.data?.agreementNumber || undefined}
        summaryData={rentalRatesSummary.data}
        isCheckin
      />
    </ProtectorShield>
  );
};

export default CheckinAgreementPage;

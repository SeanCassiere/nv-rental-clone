import { useCallback, useEffect } from "react";
import { useNavigate, useParams, useRouter, useSearch } from "@tanstack/router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";

import {
  checkinAgreementByIdRoute,
  viewAgreementByIdRoute,
} from "@/routes/agreements/agreement-id-route";

import { titleMaker } from "@/utils/title-maker";

const CheckinAgreementPage = () => {
  const navigate = useNavigate({ from: checkinAgreementByIdRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: checkinAgreementByIdRoute.id,
  });
  const { agreementId } = useParams({ from: checkinAgreementByIdRoute.id });

  const summaryData = useGetAgreementData({
    agreementId,
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

  const agreement =
    summaryData.data?.status === 200 ? summaryData.data.body : null;

  useDocumentTitle(
    titleMaker(
      `Check-in - ${agreement?.agreementNumber || "Loading"} - Agreement`
    )
  );

  useEffect(() => {
    if (summaryData.status !== "error") return;

    router.history.go(-1);
  }, [router.history, summaryData.status]);

  return (
    <ProtectorShield>
      <AddRentalParentForm
        referenceId={parseInt(agreementId)}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleAgreementSaveComplete}
        onRentalCancelClick={handleCancelEditAgreement}
        referenceNumber={agreement?.agreementNumber || undefined}
        summaryData={rentalRatesSummary.data}
        isCheckin
      />
    </ProtectorShield>
  );
};

export default CheckinAgreementPage;

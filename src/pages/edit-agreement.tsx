import { useCallback, useEffect } from "react";
import { useNavigate, useParams, useRouter, useSearch } from "@tanstack/router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { viewAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";
import { editAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";
import { useGetAgreementData } from "@/hooks/network/agreement/useGetAgreementData";
import { useGetModuleRentalRatesSummary } from "@/hooks/network/module/useGetModuleRentalRatesSummary";

import { titleMaker } from "@/utils/title-maker";

const EditAgreementPage = () => {
  const navigate = useNavigate({ from: editAgreementByIdRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: editAgreementByIdRoute.id,
  });
  const { agreementId } = useParams({ from: editAgreementByIdRoute.id });

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

  useDocumentTitle(
    titleMaker(
      `Edit - ${summaryData.data?.agreementNumber || "Loading"} - Agreement`
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
        referenceNumber={summaryData.data?.agreementNumber || undefined}
        summaryData={rentalRatesSummary.data}
      />
    </ProtectorShield>
  );
};

export default EditAgreementPage;
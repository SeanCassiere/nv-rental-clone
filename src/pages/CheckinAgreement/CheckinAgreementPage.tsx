import { useCallback } from "react";
import {
  useNavigate,
  useParams,
  useRouter,
  useSearch,
} from "@tanstack/react-router";

import AddRentalParentForm from "../../components/AddRental";
import Protector from "../../components/Protector";
import { type ModuleTabConfigItem } from "../../components/PrimaryModule/ModuleTabs";

import { viewAgreementByIdRoute } from "../../routes/agreements/agreementIdPath";

import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";
import { checkinAgreementByIdRoute } from "../../routes/agreements/agreementIdPath";
import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";
import { useGetModuleRentalRatesSummary } from "../../hooks/network/module/useGetModuleRentalRatesSummary";

import { titleMaker } from "../../utils/title-maker";

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
    (destination: ModuleTabConfigItem) => {
      navigate({
        search: () => ({ stage: destination.id }),
        params: { agreementId },
      });
    },
    [agreementId, navigate]
  );

  const handleAgreementSaveComplete = useCallback(() => {
    navigate({
      to: viewAgreementByIdRoute.fullPath,
      params: { agreementId },
      search: () => ({ tab: "summary" }),
    });
  }, [agreementId, navigate]);

  const handleCancelEditAgreement = useCallback(() => {
    navigate({
      to: "..",
    });
  }, [navigate]);

  useDocumentTitle(
    titleMaker(
      `Check-in - ${summaryData.data?.agreementNumber || "Loading"} - Agreement`
    )
  );
  return (
    <Protector>
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
    </Protector>
  );
};

export default CheckinAgreementPage;

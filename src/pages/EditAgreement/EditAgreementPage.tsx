import { useCallback } from "react";
import { useNavigate, useParams, useSearch } from "@tanstack/react-router";

import AddRentalParentForm from "../../components/AddRental";
import Protector from "../../components/Protector";

import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";
import { editAgreementByIdRoute } from "../../routes/agreements/agreementIdPath";

import { titleMaker } from "../../utils/title-maker";
import { type ModuleTabConfigItem } from "../../components/PrimaryModule/ModuleTabs";
import { viewAgreementByIdRoute } from "../../routes/agreements/agreementIdPath";
import { useGetAgreementData } from "../../hooks/network/agreement/useGetAgreementData";

const EditAgreementPage = () => {
  const navigate = useNavigate({ from: editAgreementByIdRoute.id });

  const { stage = "rental-information" } = useSearch({
    from: editAgreementByIdRoute.id,
  });
  const { agreementId } = useParams({ from: editAgreementByIdRoute.id });

  const agreementData = useGetAgreementData({ agreementId });

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

  useDocumentTitle(
    titleMaker(`Edit - ${agreementData.data?.agreementNumber} - Agreement`)
  );
  return (
    <Protector>
      <AddRentalParentForm
        referenceId={parseInt(agreementId)}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onAgreementSaveComplete={handleAgreementSaveComplete}
        referenceNumber={agreementData.data?.agreementNumber || undefined}
      />
    </Protector>
  );
};

export default EditAgreementPage;

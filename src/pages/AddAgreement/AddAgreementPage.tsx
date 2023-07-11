import { useCallback } from "react";
import { useNavigate, useRouter, useSearch } from "@tanstack/router";

import AddRentalParentForm from "../../components/AddRental";
import Protector from "../../components/Protector";

import { useDocumentTitle } from "../../hooks/internal/useDocumentTitle";
import { addAgreementRoute } from "../../routes/agreements/addAgreement";

import { titleMaker } from "../../utils/title-maker";
import { type ModuleTabConfigItem } from "../../components/PrimaryModule/ModuleTabs";
import { viewAgreementByIdRoute } from "../../routes/agreements/agreementIdPath";

const AddAgreementPage = () => {
  const navigate = useNavigate({ from: addAgreementRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: addAgreementRoute.id,
  });

  const handleStageTabClick = useCallback(
    (destination: ModuleTabConfigItem) => {
      navigate({
        search: () => ({ stage: destination.id }),
      });
    },
    [navigate],
  );

  const handleAgreementSaveComplete = useCallback(
    (agreementId: number) => {
      navigate({
        to: viewAgreementByIdRoute.to,
        params: { agreementId: String(agreementId) },
        search: () => ({ tab: "summary" }),
      });
    },
    [navigate],
  );

  const handleCancelAddAgreement = useCallback(() => {
    router.navigate({
      to: "..",
    });
  }, [router]);

  useDocumentTitle(titleMaker("New - Agreement"));
  return (
    <Protector>
      <AddRentalParentForm
        referenceId={0}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleAgreementSaveComplete}
        onRentalCancelClick={handleCancelAddAgreement}
      />
    </Protector>
  );
};

export default AddAgreementPage;

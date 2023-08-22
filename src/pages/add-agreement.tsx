import { useCallback } from "react";
import { useNavigate, useRouter, useSearch } from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/internal/useDocumentTitle";

import { addAgreementRoute } from "@/routes/agreements/add-agreement-route";
import { viewAgreementByIdRoute } from "@/routes/agreements/agreement-id-route";

import { titleMaker } from "@/utils/title-maker";

const AddAgreementPage = () => {
  const navigate = useNavigate({ from: addAgreementRoute.id });
  const router = useRouter();

  const { stage = "rental-information" } = useSearch({
    from: addAgreementRoute.id,
  });

  const handleStageTabClick = useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
      });
    },
    [navigate]
  );

  const handleAgreementSaveComplete = useCallback(
    (agreementId: number) => {
      navigate({
        to: viewAgreementByIdRoute.to,
        params: { agreementId: String(agreementId) },
        search: () => ({ tab: "summary" }),
      });
    },
    [navigate]
  );

  const handleCancelAddAgreement = useCallback(() => {
    router.navigate({
      to: "..",
    });
  }, [router]);

  useDocumentTitle(titleMaker("New - Agreement"));
  return (
    <ProtectorShield>
      <AddRentalParentForm
        referenceId={0}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleAgreementSaveComplete}
        onRentalCancelClick={handleCancelAddAgreement}
      />
    </ProtectorShield>
  );
};

export default AddAgreementPage;

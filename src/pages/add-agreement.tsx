import { useCallback } from "react";
import { RouteApi, useNavigate, useRouter } from "@tanstack/react-router";

import AddRentalParentForm from "@/components/add-rental";
import ProtectorShield from "@/components/protector-shield";

import { useDocumentTitle } from "@/hooks/useDocumentTitle";

import { titleMaker } from "@/utils/title-maker";

const routeApi = new RouteApi({ id: "/agreements/new" });

const AddAgreementPage = () => {
  const navigate = useNavigate({ from: "/agreements/new" });
  const router = useRouter();

  const { stage = "rental-information" } = routeApi.useSearch();

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
        to: "/agreements/$agreementId",
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

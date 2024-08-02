import * as React from "react";
import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute("/_auth/(agreements)/agreements/new")({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
  component: AddAgreementPage,
});

function AddAgreementPage() {
  const navigate = Route.useNavigate();

  const stage = Route.useSearch({
    select: (s) => s?.stage ?? "rental-information",
  });

  const handleStageTabClick = React.useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
      });
    },
    [navigate]
  );

  const handleAgreementSaveComplete = React.useCallback(
    (agreementId: number) => {
      navigate({
        to: "/agreements/$agreementId/summary",
        params: { agreementId: String(agreementId) },
      });
    },
    [navigate]
  );

  const handleCancelAddAgreement = React.useCallback(() => {
    navigate({
      to: "..",
    });
  }, [navigate]);

  useDocumentTitle(titleMaker("New - Agreement"));

  return (
    <Container>
      <AddRentalParentForm
        referenceId={0}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleAgreementSaveComplete}
        onRentalCancelClick={handleCancelAddAgreement}
      />
    </Container>
  );
}

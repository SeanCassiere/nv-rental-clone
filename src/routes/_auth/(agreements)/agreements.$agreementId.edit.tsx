import { useCallback, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/edit"
)({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  preSearchFilters: [() => ({ stage: "rental-information" })],
  component: EditAgreementPage,
});

function EditAgreementPage() {
  const navigate = Route.useNavigate();
  const router = useRouter();

  const routeContext = Route.useRouteContext();
  const { stage = "rental-information" } = Route.useSearch();
  const { agreementId } = Route.useParams();

  const agreementData = useQuery(routeContext.viewAgreementOptions);

  const rentalRatesSummary = useQuery(routeContext.viewAgreementSummaryOptions);
  const summaryData =
    rentalRatesSummary.data?.status === 200
      ? rentalRatesSummary.data?.body
      : undefined;

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
      to: "/agreements/$agreementId/summary",
      params: { agreementId },
      search: () => ({ tab: "summary" }),
    });
  }, [agreementId, navigate]);

  const handleCancelEditAgreement = useCallback(() => {
    navigate({
      to: "..",
    });
  }, [navigate]);

  const agreement =
    agreementData.data?.status === 200 ? agreementData.data.body : null;

  useDocumentTitle(
    titleMaker(`Edit - ${agreement?.agreementNumber || "Loading"} - Agreement`)
  );

  useEffect(() => {
    if (agreementData.status !== "error") return;

    router.history.go(-1);
  }, [router.history, agreementData.status]);

  return (
    <Container>
      <AddRentalParentForm
        referenceId={parseInt(agreementId)}
        currentStage={stage}
        module="agreement"
        onStageTabClick={handleStageTabClick}
        onRentalSaveClick={handleAgreementSaveComplete}
        onRentalCancelClick={handleCancelEditAgreement}
        referenceNumber={agreement?.agreementNumber || undefined}
        summaryData={summaryData}
      />
    </Container>
  );
}

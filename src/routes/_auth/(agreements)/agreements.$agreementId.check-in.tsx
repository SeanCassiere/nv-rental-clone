import * as React from "react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { z } from "zod";

import AddRentalParentForm from "@/components/add-rental";

import { useDocumentTitle } from "@/lib/hooks/useDocumentTitle";

import { Container } from "@/routes/-components/container";

import { titleMaker } from "@/lib/utils/title-maker";

export const Route = createFileRoute(
  "/_auth/(agreements)/agreements/$agreementId/check-in"
)({
  validateSearch: (search) =>
    z
      .object({
        stage: z.string().optional(),
      })
      .parse(search),
  component: CheckinAgreementPage,
});

function CheckinAgreementPage() {
  const navigate = Route.useNavigate();
  const router = useRouter();

  const routeContext = Route.useRouteContext();
  const stage = Route.useSearch({
    select: (s) => s?.stage ?? "rental-information",
  });
  const { agreementId } = Route.useParams();

  const agreementData = useQuery(routeContext.viewAgreementOptions);

  const rentalRatesSummary = useQuery(routeContext.viewAgreementSummaryOptions);
  const summaryData =
    rentalRatesSummary.data?.status === 200
      ? rentalRatesSummary.data?.body
      : undefined;

  const handleStageTabClick = React.useCallback(
    (destination: string) => {
      navigate({
        search: () => ({ stage: destination }),
        params: { agreementId },
      });
    },
    [agreementId, navigate]
  );

  const handleAgreementSaveComplete = React.useCallback(() => {
    navigate({
      to: "/agreements/$agreementId/summary",
      params: { agreementId },
    });
  }, [agreementId, navigate]);

  const handleCancelEditAgreement = React.useCallback(() => {
    navigate({
      to: "..",
    });
  }, [navigate]);

  const agreement =
    agreementData.data?.status === 200 ? agreementData.data.body : null;

  useDocumentTitle(
    titleMaker(
      `Check-in - ${agreement?.agreementNumber || "Loading"} - Agreement`
    )
  );

  React.useEffect(() => {
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
        isCheckin
      />
    </Container>
  );
}
